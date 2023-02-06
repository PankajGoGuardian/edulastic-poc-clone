import { useState, useEffect, useRef } from 'react'
import { captureSentryException } from '@edulastic/common'

const useAudioPlayer = ({ audioUrl, onClickRerecord, setErrorData }) => {
  const [isAudioLoading, setIsAudioLoading] = useState(true)
  const audioRef = useRef(null)

  const handleOnClickRerecord = () => {
    onClickRerecord()
  }

  useEffect(() => {
    audioRef.current.addEventListener('loadedmetadata', async () => {
      try {
        setIsAudioLoading(true)
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
        /**
         * The audio element has issues of playing when audio loads,
         * audio track seeks to end on load and plays partially.
         * Below is the workaround so that audio starts from beginning
         * and plays correctly. It is just like seeking the audio in between
         * somewhere and then to start so that tracks and current time
         * are set appropriately.
         */
        audioRef.current.currentTime = 1
        audioRef.current.currentTime = 0
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
  }, [audioUrl])

  return {
    audioRef,
    isAudioLoading,
    handleOnClickRerecord,
  }
}

export default useAudioPlayer
