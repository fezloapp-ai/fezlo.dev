'use client'

import { useEffect, useRef, useState } from 'react'
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'
import { supabase } from '@/lib/supabase'

interface WebcamCaptureProps {
  onSuccess?: (motionScore: number, verificationId: string) => void
  onError?: (message: string) => void
}

export default function WebcamCapture({ onSuccess, onError }: WebcamCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const landmarkerRef = useRef<FaceLandmarker | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'active' | 'denied'>('idle')
  const [challengeState, setChallengeState] = useState<'ready' | 'running' | 'success' | 'failed'>('ready')
  const [photo, setPhoto] = useState<string | null>(null)
  const noseXStart = useRef<number | null>(null)
  const maxDelta = useRef(0)

  useEffect(() => {
    async function init() {
      setStatus('loading')
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
      )
      landmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
        },
        runningMode: 'VIDEO',
        numFaces: 1,
      })
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setStatus('active')
      }
    }
    init().catch(() => {
      setStatus('denied')
      onError?.('Accès caméra refusé.')
    })
  }, [])

  function startChallenge() {
    setPhoto(null)
    setChallengeState('running')
    noseXStart.current = null
    maxDelta.current = 0
    const start = Date.now()
    const duration = 4000

    function loop() {
      const video = videoRef.current
      const landmarker = landmarkerRef.current
      if (!video || !landmarker) return
      const result = landmarker.detectForVideo(video, performance.now())
      const landmarks = result.faceLandmarks[0]
      if (landmarks) {
        const nose = landmarks[1]
        if (noseXStart.current === null) {
          noseXStart.current = nose.x
        } else {
          const delta = Math.abs(nose.x - noseXStart.current)
          if (delta > maxDelta.current) maxDelta.current = delta
        }
      }
      if (Date.now() - start < duration) {
        requestAnimationFrame(loop)
      } else {
        finishChallenge()
      }
    }
    loop()
  }

  async function finishChallenge() {
    const moved = maxDelta.current > 0.04
    const { data: inserted } = await supabase
      .from('verifications')
      .insert({ motion_score: maxDelta.current, passed: moved })
      .select('id')
      .single()
    if (moved) {
      capturePhoto()
      setChallengeState('success')
      onSuccess?.(maxDelta.current, inserted?.id ?? '')
    } else {
      setChallengeState('failed')
    }
  }

  function capturePhoto() {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    ctx?.drawImage(video, 0, 0)
    setPhoto(canvas.toDataURL('image/jpeg'))
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <video ref={videoRef} autoPlay playsInline muted className="rounded-xl w-full max-w-md" />
      <canvas ref={canvasRef} className="hidden" />
      {status === 'loading' && <p className="text-yellow-500">Chargement du modèle...</p>}
      {status === 'denied' && <p className="text-red-500">Accès caméra refusé.</p>}
      {status === 'active' && challengeState === 'ready' && (
        <button onClick={startChallenge} className="bg-yellow-600 text-black font-bold px-6 py-3 rounded-full">
          Commencer la vérification
        </button>
      )}
      {challengeState === 'running' && (
        <p className="text-white text-xl font-bold">Bougez la tête naturellement...</p>
      )}
      {challengeState === 'failed' && (
        <div className="text-center">
          <p className="text-red-500">Mouvement non détecté.</p>
          <button onClick={startChallenge} className="mt-2 text-yellow-500 underline">Réessayer</button>
        </div>
      )}
      {challengeState === 'success' && photo && (
        <div className="text-center">
          <p className="text-green-500 mb-2">Enregistré ✓</p>
          <img src={photo} alt="capture" className="rounded-xl w-48" />
          <button onClick={startChallenge} className="block mx-auto mt-4 text-yellow-500 underline">Recommencer</button>
        </div>
      )}
    </div>
  )
}
