import { useRef, useEffect } from 'react'
import { hasMediaDevice } from '@edulastic/common'

import { RECORDING_ACTIVE, RECORDING_INACTIVE, START, STOP } from '../constants'
import { getAudioRecordingErrorMessage } from '../utils'
import VoiceRecorder from '../lib/VoiceRecorder'

const useAudioRecorder = ({
  onChangeRecordingState,
  onRecordingComplete,
  setErrorData,
  userId,
  stopRecordingForQid,
  setStopAudioRecordingAndUploadForQid,
  questionId,
}) => {
  const voiceRecorderRef = useRef(null)
  let voiceRecorderData

  const handleStartRecording = async () => {
    const hasAudioMediaDevice = await hasMediaDevice('audioinput')
    if (!hasAudioMediaDevice) {
      return {
        error: true,
        errorMessage: 'Recording audio is not supported in this browser.',
      }
    }

    try {
      await voiceRecorderRef.current.startRecording()
      return {
        error: false,
        errorMessage: null,
      }
    } catch (error) {
      return {
        error: true,
        errorMessage: getAudioRecordingErrorMessage(error, error.name, START),
      }
    }
  }

  const handleStopRecording = async () => {
    try {
      const audioBlob = await voiceRecorderRef.current.stopRecording()
      const { type = '' } = audioBlob
      const fileOptions = { type }
      const audioFile = new File(
        [audioBlob],
        `recorded-audio-${userId}-${Date.now()}.mp3`,
        fileOptions
      )
      const audioUrl = URL.createObjectURL(audioBlob)
      return {
        audioUrl,
        audioFile,
      }
    } catch (error) {
      return {
        error: true,
        errorMessage: getAudioRecordingErrorMessage(error, error.name, STOP),
      }
    }
  }

  const handleCancelRecording = (voiceRecorderReference) => {
    if (voiceRecorderReference?.recorder?.audioRecorder?.recording) {
      voiceRecorderReference.cancelRecording()
    }
  }

  const onClickRecordAudio = async () => {
    const { error = false, errorMessage } = await handleStartRecording()
    if (error) {
      onChangeRecordingState(RECORDING_INACTIVE)
      setErrorData({
        isOpen: true,
        errorMessage,
      })
    } else {
      onChangeRecordingState(RECORDING_ACTIVE)
    }
  }

  const onClickStopRecording = async () => {
    const {
      error = false,
      audioUrl,
      audioFile,
      errorMessage,
    } = await handleStopRecording()
    if (error) {
      onChangeRecordingState(RECORDING_INACTIVE)
      setErrorData({
        isOpen: true,
        errorMessage,
      })
    } else {
      onRecordingComplete({ audioFile, audioUrl })
    }
  }

  const cancelActiveRecording = () => {
    handleCancelRecording(voiceRecorderData)
  }

  useEffect(() => {
    voiceRecorderRef.current = new VoiceRecorder()
    voiceRecorderData = voiceRecorderRef.current
    return () => {
      cancelActiveRecording()
      voiceRecorderRef.current = null
    }
  }, [])

  useEffect(() => {
    if (stopRecordingForQid && stopRecordingForQid === questionId) {
      onClickStopRecording()
      setStopAudioRecordingAndUploadForQid({ questionId: '' })
    }
  }, [stopRecordingForQid])

  return { onClickRecordAudio, onClickStopRecording }
}

export default useAudioRecorder
