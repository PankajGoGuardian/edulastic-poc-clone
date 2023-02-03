import { uploadToS3, captureSentryException } from '@edulastic/common'
import { aws } from '@edulastic/constants'
import {
  RECORDING_INACTIVE,
  AUDIO_UPLOAD_ACTIVE,
  AUDIO_UPLOAD_SUCCESS,
  AUDIO_UPLOAD_ERROR,
  AUDIO_UPLOAD_INACTIVE,
} from '../constants'

const folder = aws.s3Folders.DEFAULT

const useUploadAudioFile = ({
  useS3AudioUrl,
  saveUserResponse,
  handleChangeRecordingState,
  handleChangeUploadStatus,
  recordingAndUploadCompleteForQid,
  setErrorData,
}) => {
  const uploadFile = async ({ audioFile, objectAudioUrl }) => {
    if (useS3AudioUrl) {
      try {
        handleChangeUploadStatus(AUDIO_UPLOAD_ACTIVE)
        const uploadedUrl = await uploadToS3(audioFile, folder)
        saveUserResponse(uploadedUrl)
        handleChangeUploadStatus(AUDIO_UPLOAD_SUCCESS)
        recordingAndUploadCompleteForQid(AUDIO_UPLOAD_SUCCESS)
        return uploadedUrl
      } catch (error) {
        const errorMessage = 'Failed to upload audio'
        setErrorData({
          isOpen: true,
          errorMessage,
        })
        handleChangeRecordingState(RECORDING_INACTIVE)
        handleChangeUploadStatus(AUDIO_UPLOAD_INACTIVE)
        recordingAndUploadCompleteForQid(AUDIO_UPLOAD_ERROR)
        captureSentryException(error, {
          errorMessage: `Audio Response - ${errorMessage}`,
        })
      }
    } else {
      saveUserResponse(objectAudioUrl)
    }
  }

  return {
    uploadFile,
  }
}

export default useUploadAudioFile
