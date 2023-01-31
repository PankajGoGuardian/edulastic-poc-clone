import { useState, useEffect } from 'react'
import { RECORDING_INACTIVE, RECORDING_COMPLETED } from '../constants'

const useAudioResponse = ({ userAnswer, saveAnswer }) => {
  const [recordingState, setRecordingState] = useState(RECORDING_INACTIVE)
  const [errorData, setErrorData] = useState({
    isOpen: false,
    errorMessage: '',
  })

  const saveUserResponse = (userAudioResponseUrl) => {
    saveAnswer(userAudioResponseUrl)
  }

  const onClickRerecord = () => {
    setRecordingState(RECORDING_INACTIVE)
    saveUserResponse('')
  }

  useEffect(() => {
    if (userAnswer?.length) {
      setRecordingState(RECORDING_COMPLETED)
      return
    }
    setRecordingState(RECORDING_INACTIVE)
  }, [userAnswer])

  return {
    recordingState,
    errorData,
    setErrorData,
    saveUserResponse,
    setRecordingState,
    onClickRerecord,
  }
}

export default useAudioResponse
