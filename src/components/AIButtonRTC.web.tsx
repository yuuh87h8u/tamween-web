import React, { useRef, useState } from 'react'
import { connectGeminiRTC } from '@/src/ai/realtimeWebRTC'

type HTMLMediaElementWithSrcObject = HTMLMediaElement & { srcObject?: MediaStream }

export type AIButtonRTCProps = {
  addToFamilyNotes: (items: string[]) => void
  openBills: () => void
  openBankDeals: () => void
  openHospital: () => void
  className?: string
}

export default function AIButtonRTC(props: AIButtonRTCProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [on, setOn] = useState<boolean>(false)
  const sessionRef = useRef<{ stop: () => void } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const start = async () => {
    try {
      setError(null)
      const session = await connectGeminiRTC({
        tokenUrl: '/api/gemini-token',
        onTrackAudio: (stream) => {
          if (audioRef.current) {
            try {
              (audioRef.current as unknown as HTMLMediaElementWithSrcObject).srcObject = stream
            } catch (e) {
              console.log('Failed to attach audio stream', e)
            }
          }
        },
        onData: (msg) => {
          try {
            if (msg?.type === 'action') {
              if (msg.name === 'add_notes') props.addToFamilyNotes(msg?.payload?.items ?? [])
              if (msg.name === 'open_bills') props.openBills()
              if (msg.name === 'open_bank_deals') props.openBankDeals()
              if (msg.name === 'open_hospital') props.openHospital()
            }
          } catch (e) {
            console.log('onData handler error', e)
          }
        },
      })
      sessionRef.current = session
      setOn(true)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      console.log('Failed to start AI session', msg)
      setError(msg)
      setOn(false)
    }
  }

  const stop = () => {
    try {
      sessionRef.current?.stop()
    } catch (e) {
      console.log('Failed to stop AI session', e)
    }
    sessionRef.current = null
    setOn(false)
  }

  return (
    <div className={`fixed bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-50 ${props.className ?? ''}`}>
      <button
        onClick={() => (on ? stop() : start())}
        className={`px-6 py-3 rounded-full shadow-lg text-white transition-colors ${on ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
        data-testid="ai-button-rtc"
      >
        <span>{on ? 'Stop AI' : 'Talk to AI'}</span>
      </button>
      <audio ref={audioRef} autoPlay />
      {error ? (
        <div className="text-sm text-red-600" data-testid="ai-button-rtc-error">
          <span>{error}</span>
        </div>
      ) : null}
    </div>
  )
}
