// api/gemini-token.ts
// Edge function that mints a short-lived session/token for Gemini Realtime WebRTC.
// Keeps GOOGLE_API_KEY server-side. The browser never sees the key.

export const config = { runtime: 'edge' }

export default async function handler(_req: Request) {
  const key = process.env.GOOGLE_API_KEY
  if (!key) {
    return new Response(JSON.stringify({ error: 'Missing GOOGLE_API_KEY' }), { status: 500 })
  }

  try {
    const r = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/realtime:sessions?alt=sdp&key=' + key,
      { method: 'POST' }
    )

    if (!r.ok) {
      const txt = await r.text()
      return new Response(JSON.stringify({ error: txt }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const tokenPayload = await r.json()
    return new Response(JSON.stringify(tokenPayload), {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: String(err?.message ?? err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
