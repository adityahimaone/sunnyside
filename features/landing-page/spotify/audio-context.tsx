'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

interface AudioContextType {
  isPlaying: boolean
  togglePlay: () => void
  isMuted: boolean
  toggleMute: () => void
  volume: number
  setVolume: (volume: number) => void
  playbackRate: number
  setPlaybackRate: (rate: number) => void
  currentTrack: string
  audioRef: React.RefObject<HTMLAudioElement | null>
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)
const AUDIO_SOURCE = '/music/edge-of-desire-sunrise-mix.weba'

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [playbackRate, setPlaybackRate] = useState(1.0)
  const [currentTrack, setCurrentTrack] = useState('The Portfolio Mix')
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const endedHandlerRef = useRef<(() => void) | null>(null)

  const ensureAudio = useCallback(() => {
    if (audioRef.current) return audioRef.current
    const audio = new Audio(AUDIO_SOURCE)
    audio.preload = 'none'
    audio.loop = true
    audio.volume = isMuted ? 0 : volume
    audio.playbackRate = playbackRate
    const handleEnded = () => setIsPlaying(false)
    endedHandlerRef.current = handleEnded
    audio.addEventListener('ended', handleEnded)
    audioRef.current = audio
    return audio
  }, [isMuted, playbackRate, volume])

  useEffect(() => {
    return () => {
      const audio = audioRef.current
      if (!audio) return
      if (endedHandlerRef.current) {
        audio.removeEventListener('ended', endedHandlerRef.current)
      }
      audio.pause()
      audioRef.current = null
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate
    }
  }, [playbackRate])

  const togglePlay = useCallback(() => {
    const audio = ensureAudio()
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true)
            setCurrentTrack(
              'Jonas Blue & Malive - Edge Of Desire (Sunrise Mix)',
            )
          })
          .catch(() => {
            setIsPlaying(false)
          })
      }
    }
  }, [ensureAudio, isPlaying])

  const toggleMute = useCallback(() => setIsMuted((prev) => !prev), [])

  const value = useMemo(
    () => ({
      isPlaying,
      togglePlay,
      isMuted,
      toggleMute,
      volume,
      setVolume,
      playbackRate,
      setPlaybackRate,
      currentTrack,
      audioRef,
    }),
    [
      currentTrack,
      isMuted,
      isPlaying,
      playbackRate,
      toggleMute,
      togglePlay,
      volume,
    ],
  )

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
}

export function useAudio() {
  const context = useContext(AudioContext)
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider')
  }
  return context
}
