import { roleuser } from '@edulastic/constants'
import { captureSentryException } from '@edulastic/common'
import { START, maxAudioDurationLimit } from '../constants'

export const getAudioRecordingErrorMessage = (error, errorName, state) => {
  let errorMessage = ''
  switch (errorName) {
    case 'NotAllowedError':
      errorMessage =
        'Edulastic needs access to your microphone so that you can record responses.'
      break
    default:
      errorMessage = `An error occured while ${
        state === START ? 'starting' : 'stopping'
      } the audio.`
      captureSentryException(error, {
        errorMessage: `Audio Response - ${errorMessage}`,
      })
  }
  return errorMessage
}

export const shouldUploadToS3AndUseS3Url = ({
  userRole,
  isTestPreviewModalVisible,
  isTestDemoPlayer,
}) => {
  return [
    userRole === roleuser.STUDENT,
    isTestPreviewModalVisible,
    isTestDemoPlayer,
  ].some((val) => val)
}

export const hideRecorder = ({ inLCB, isStudentReport, isLCBView }) => {
  return [inLCB, isStudentReport, isLCBView].some((val) => val)
}

export const IsValidNumber = (duration) => {
  return typeof duration === 'number' && duration <= maxAudioDurationLimit
}
