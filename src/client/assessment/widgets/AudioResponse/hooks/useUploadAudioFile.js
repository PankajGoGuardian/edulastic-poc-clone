import { useState } from 'react'
import { uploadToS3, captureSentryException } from '@edulastic/common'
import { aws } from '@edulastic/constants'
import { RECORDING_INACTIVE } from '../constants'

const folder = aws.s3Folders.DEFAULT

const useUploadAudioFile = ({
  useS3AudioUrl,
  saveUserResponse,
  setRecordingState,
  setErrorData,
}) => {
  const [isUploadingAudio, setIsUploadingAudio] = useState(false)

  const uploadFile = async ({ audioFile, objectAudioUrl }) => {
    if (useS3AudioUrl) {
      try {
        setIsUploadingAudio(true)
        const uploadedUrl = await uploadToS3(audioFile, folder)
        setIsUploadingAudio(false)
        saveUserResponse(uploadedUrl)
        return uploadedUrl
      } catch (error) {
        const errorMessage = 'Failed to upload audio'
        setErrorData({
          isOpen: true,
          errorMessage,
        })
        setRecordingState(RECORDING_INACTIVE)
        setIsUploadingAudio(false)
        captureSentryException(error, {
          errorMessage: `Audio Response - ${errorMessage}`,
        })
      }
    } else {
      saveUserResponse(objectAudioUrl)
    }
  }

  return {
    isUploadingAudio,
    uploadFile,
  }
}

export default useUploadAudioFile
