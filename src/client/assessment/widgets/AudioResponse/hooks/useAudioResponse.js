import { useState, useEffect } from 'react'
import {
  RECORDING_INACTIVE,
  RECORDING_COMPLETED,
  AUDIO_UPLOAD_INACTIVE,
} from '../constants'

const useAudioResponse = ({
  userAnswer,
  saveAnswer,
  setRecordingState,
  setAudioUploadStatus,
  questionId,
  itemId,
}) => {
  const [errorData, setErrorData] = useState({
    isOpen: false,
    errorMessage: '',
  })

  const saveUserResponse = (userAudioResponseUrl) => {
    saveAnswer(userAudioResponseUrl)
  }

  const handleChangeRecordingState = (recordingState) => {
    setRecordingState({ questionId, itemId, recordingState })
  }

  const handleChangeUploadStatus = (audioUploadStatus) => {
    setAudioUploadStatus({ questionId, itemId, audioUploadStatus })
  }

  const onClickRerecord = () => {
    handleChangeRecordingState(RECORDING_INACTIVE)
    saveUserResponse('')
  }

  useEffect(() => {
    handleChangeUploadStatus(AUDIO_UPLOAD_INACTIVE)
  }, [])

  useEffect(() => {
    if (userAnswer?.length) {
      handleChangeRecordingState(RECORDING_COMPLETED)
      return
    }
    handleChangeRecordingState(RECORDING_INACTIVE)
  }, [userAnswer])

  return {
    errorData,
    setErrorData,
    saveUserResponse,
    onClickRerecord,
    handleChangeRecordingState,
    handleChangeUploadStatus,
  }
}

export default useAudioResponse
