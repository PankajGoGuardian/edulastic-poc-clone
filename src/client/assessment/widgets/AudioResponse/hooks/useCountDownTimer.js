import { useRef, useState, useEffect, useMemo } from 'react'
import { getFormattedTimeInMinutesAndSeconds } from '../../../utils/timeUtils'

const useCountDownTimer = ({
  audioDurationInMilliSeconds,
  handleStopRecording,
}) => {
  const endTime = useMemo(() => Date.now() + audioDurationInMilliSeconds, [])
  const initialTime = Math.floor(endTime - Date.now())
  const [milliSeconds, setMilliSeconds] = useState(initialTime)
  const intervalRef = useRef()

  const updateTimer = () => {
    if (milliSeconds > 0) {
      setMilliSeconds(Math.floor(endTime - Date.now()))
    }
  }

  useEffect(() => {
    intervalRef.current = setInterval(updateTimer, 200)
    if (milliSeconds <= 0) {
      handleStopRecording()
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [milliSeconds])

  return { time: getFormattedTimeInMinutesAndSeconds(milliSeconds) }
}

export default useCountDownTimer
