import { useState, useEffect, useRef } from 'react'
import { captureSentryException } from '@edulastic/common'
import { getFormattedTimeInMinutesAndSeconds } from '../../../utils/timeUtils'
import { PLAY, PAUSE, STOP } from '../constants'

const useAudioPlayer = ({ audioUrl, onClickRerecord, setErrorData }) => {
  const [isAudioLoading, setIsAudioLoading] = useState(true)
  const [audioData, setAudioData] = useState(null)
  const [playerState, setPlayerState] = useState(null)
  const [currentProgress, setCurrentProgress] = useState(0)
  const [audioSliderCount, setAudioSliderCount] = useState(0)
  const audioRef = useRef(new Audio(audioUrl))
  const audioRefData = audioRef.current
  const intervalRef = useRef(null)

  const checkAudioState = (audioState) =>
    isAudioLoading || playerState === audioState || !audioData

  const handlePlay = () => {
    if (checkAudioState(PLAY)) return
    setPlayerState(PLAY)
    audioData.play()
  }

  const handlePause = () => {
    if (checkAudioState(PAUSE)) return
    setPlayerState(PAUSE)
    audioData.pause()
  }

  const resetAudioTime = () => {
    if (audioData && audioData.currentTime) {
      audioData.currentTime = 0
    }
  }

  const handleStop = () => {
    if (checkAudioState(STOP)) return
    setPlayerState(STOP)
    audioData.pause()
    resetAudioTime()
  }

  const handleOnClickRerecord = () => {
    handleStop()
    onClickRerecord()
  }

  const cancelAudioPlayback = () => {
    if (audioRefData) {
      setPlayerState(STOP)
      audioRefData.pause()
      audioRefData.currentTime = 0
    }
  }

  useEffect(() => {
    audioRef.current.addEventListener('loadedmetadata', async () => {
      try {
        const loadedAudio = audioRef.current
        /**
         * Browser returns infinity duration.
         * Majority browsers has this issue.
         * Its a workaround to get correct duration of audio
         */
        while (loadedAudio.duration === Infinity) {
          await new Promise((r) => setTimeout(r, 1000))
          loadedAudio.currentTime = 10000000 * Math.random()
        }
        setAudioData(loadedAudio)
        setIsAudioLoading(false)
      } catch (error) {
        const errorMessage = 'An error occured while loading the audio.'
        setErrorData({
          isOpen: true,
          errorMessage,
        })
        captureSentryException(error, {
          errorMessage: `Audio Resopnse - ${errorMessage}`,
        })
      } finally {
        setIsAudioLoading(false)
      }
    })

    return () => {
      cancelAudioPlayback()
      audioRef.current = null
      setAudioData(null)
    }
  }, [])

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (playerState === PLAY && audioData) {
        setCurrentProgress(audioData.currentTime)
      }
      if (audioData && audioData.ended) {
        setPlayerState(null)
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }, 100)

    return () => {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  })

  const duration = (audioData && audioData.duration) || '-'
  const lapsedTime = (duration || 0) - (currentProgress || 0)
  const audioTimerData = lapsedTime >= 0 ? lapsedTime * 1000 : 0
  const audioSliderProgressPercent = Math.round(
    (currentProgress / duration) * 100 || 0
  )
  const audioSliderFillCount = Math.ceil(
    (audioSliderProgressPercent / 100) * audioSliderCount || 0
  )

  return {
    audioDuration: getFormattedTimeInMinutesAndSeconds(audioTimerData),
    isAudioLoading,
    handlePlay,
    handlePause,
    handleOnClickRerecord,
    resetAudioTime,
    playerState,
    setAudioSliderCount,
    audioSliderFillCount,
  }
}

export default useAudioPlayer
