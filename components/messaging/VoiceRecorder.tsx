'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Mic, Square, Play, Pause, Trash2, Send } from 'lucide-react'
import { cn } from '@/lib/utils'

interface VoiceRecorderProps {
  onSend: (audioBlob: Blob, duration: number) => void
  onCancel?: () => void
  disabled?: boolean
}

export function VoiceRecorder({ onSend, onCancel, disabled }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [duration, setDuration] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)

  useEffect(() => {
    return () => {
      // Cleanup
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [audioUrl])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        setRecordedAudio(audioBlob)
        const url = URL.createObjectURL(audioBlob)
        setAudioUrl(url)
        
        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop())
        }
      }

      mediaRecorder.start()
      setIsRecording(true)
      setIsPaused(false)
      startTimeRef.current = Date.now()
      
      // Update duration every second
      intervalRef.current = setInterval(() => {
        if (!isPaused) {
          setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000))
        }
      }, 1000)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Impossible d\'accéder au microphone. Veuillez vérifier les permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording && !isPaused) {
      mediaRecorderRef.current.pause()
      setIsPaused(true)
    } else if (mediaRecorderRef.current && isRecording && isPaused) {
      mediaRecorderRef.current.resume()
      setIsPaused(false)
      startTimeRef.current = Date.now() - (duration * 1000)
    }
  }

  const cancelRecording = () => {
    if (isRecording) {
      stopRecording()
    }
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }
    setRecordedAudio(null)
    setAudioUrl(null)
    setDuration(0)
    setIsPlaying(false)
    onCancel?.()
  }

  const playPreview = () => {
    if (audioRef.current && audioUrl) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const handleSend = () => {
    if (recordedAudio) {
      onSend(recordedAudio, duration)
      // Reset state
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
      setRecordedAudio(null)
      setAudioUrl(null)
      setDuration(0)
      setIsPlaying(false)
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (recordedAudio && audioUrl) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800"
      >
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          onTimeUpdate={(e) => {
            const audio = e.currentTarget
            if (audio.duration && audio.currentTime >= audio.duration) {
              setIsPlaying(false)
            }
          }}
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={playPreview}
          className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900/30 hover:bg-orange-200 dark:hover:bg-orange-900/50"
        >
          {isPlaying ? (
            <Pause className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          ) : (
            <Play className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          )}
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-orange-200 dark:bg-orange-900/50 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-orange-500 to-yellow-500"
                initial={{ width: 0 }}
                animate={{ width: isPlaying ? '100%' : '0%' }}
                transition={{ duration: audioRef.current?.duration || 0, ease: 'linear' }}
              />
            </div>
            <span className="text-sm font-medium text-orange-700 dark:text-orange-300 min-w-[3rem] text-right">
              {formatDuration(duration)}
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={cancelRecording}
          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button
          onClick={handleSend}
          className="h-10 px-4 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white"
        >
          <Send className="h-4 w-4 mr-2" />
          Envoyer
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800"
    >
      {!isRecording ? (
        <>
          <Button
            onClick={startRecording}
            disabled={disabled}
            className={cn(
              "h-12 w-12 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white shadow-lg",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            size="icon"
          >
            <Mic className="h-6 w-6" />
          </Button>
          <div className="flex-1">
            <p className="text-sm font-medium text-orange-700 dark:text-orange-300">
              Appuyez pour enregistrer un message vocal
            </p>
          </div>
        </>
      ) : (
        <>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="h-12 w-12 rounded-full bg-red-500 flex items-center justify-center"
          >
            <div className="h-3 w-3 bg-white rounded-full" />
          </motion.div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
                {isPaused ? 'En pause' : 'Enregistrement...'}
              </span>
              <span className="text-sm font-bold text-red-600 dark:text-red-400">
                {formatDuration(duration)}
              </span>
            </div>
            <div className="h-1 bg-orange-200 dark:bg-orange-900/50 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-orange-500 to-yellow-500"
                animate={{ width: ['0%', '100%'] }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={pauseRecording}
            className="h-10 w-10"
          >
            {isPaused ? (
              <Play className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            ) : (
              <Pause className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={stopRecording}
            className="h-10 w-10 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
          >
            <Square className="h-5 w-5" />
          </Button>
        </>
      )}
    </motion.div>
  )
}

