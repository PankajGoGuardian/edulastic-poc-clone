import { useRef, useState, useEffect } from 'react'
import { getFormattedTimeInMinutesAndSeconds } from '../../../utils/timeUtils'

const useCountDownTimer = ({
  audioDurationInMilliSeconds,
  handleStopRecording,
}) => {
  const [milliSeconds, setMilliSeconds] = useState(audioDurationInMilliSeconds)
  const intervalRef = useRef()

  const updateTimer = () => {
    if (milliSeconds > 0) {
      setMilliSeconds((_milliSeconds) => _milliSeconds - 1000)
    }
  }

  useEffect(() => {
    intervalRef.current = setInterval(updateTimer, 1000)
    if (milliSeconds === 0) {
      handleStopRecording()
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [milliSeconds])

  return { time: getFormattedTimeInMinutesAndSeconds(milliSeconds) }
}

export default useCountDownTimer
