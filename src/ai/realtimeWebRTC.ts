// src/ai/realtimeWebRTC.ts
// Browser-side helper to negotiate a WebRTC session with Gemini Realtime.
// Streams mic audio -> Gemini; receives streamed TTS audio back via onTrack.
// Optionally opens a data channel for JSON "actions" (open bills, add notes, etc).

export type RTCConnectOptions = {
  tokenUrl: string                 // '/api/gemini-token'
  onTrackAudio: (s: MediaStream) => void
  onData?: (msg: any) => void      // optional: JSON actions channel
  languageHint?: 'ar' | 'en'       // optional
}

export async function connectGeminiRTC(opts: RTCConnectOptions) {
  const { tokenUrl, onTrackAudio, onData } = opts

  // 1) Ask our Edge endpoint for a short-lived session/token
  const resp = await fetch(tokenUrl, { method: 'POST' })
  const tokenPayload = await resp.json()
  if (tokenPayload.error) throw new Error(tokenPayload.error)

  // Example shapes differ by rollout; common fields include a bearer or secret
  const bearer = tokenPayload?.client_secret || tokenPayload?.access_token
  if (!bearer) throw new Error('Token payload missing client_secret/access_token')

  // 2) Create PeerConnection
  const pc = new RTCPeerConnection({
    iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }],
  })

  // 3) Handle incoming audio from Gemini
  pc.ontrack = (ev) => {
    const [stream] = ev.streams
    onTrackAudio(stream)
  }

  // 4) (Optional) data channel to receive JSON "action" messages
  const dc = pc.createDataChannel('actions')
  if (onData) {
    dc.onmessage = (e) => {
      try { onData(JSON.parse(e.data)) } catch { onData(e.data) }
    }
  }

  // 5) Add mic
  const mic = await navigator.mediaDevices.getUserMedia({ audio: true })
  mic.getTracks().forEach((t) => pc.addTrack(t, mic))

  // 6) Create offer (we want to receive audio)
  const offer = await pc.createOffer({ offerToReceiveAudio: true })
  await pc.setLocalDescription(offer)

  // 7) Send SDP offer directly to Gemini Realtime over HTTPS, authorized with the ephemeral token
  // The connect endpoint is SDP-over-HTTP; returns the SDP answer as text.
  const sdpResp = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:connect?alt=sdp',
    {
      method: 'POST',
      headers: {
        // Use Bearer if token is a bearer; if docs specify another header (e.g., X-Goog-Api-Key),
        // replace accordingly based on the tokenPayload you received.
        Authorization: `Bearer ${bearer}`,
        'Content-Type': 'application/sdp',
      },
      body: offer.sdp!,
    }
  )

  if (!sdpResp.ok) throw new Error('Failed to obtain SDP answer from Gemini')
  const answerSDP = await sdpResp.text()
  await pc.setRemoteDescription({ type: 'answer', sdp: answerSDP })

  return { pc, dc, stop: () => {
    pc.getSenders().forEach((s) => s.track?.stop())
    pc.close()
  }}
}
