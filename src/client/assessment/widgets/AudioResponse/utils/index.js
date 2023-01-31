import { roleuser } from '@edulastic/constants'
import { captureSentryException } from '@edulastic/common'
import { START } from '../constants'

export const getAudioRecordingErrorMessage = (error, errorName, state) => {
  let errorMessage = ''
  switch (errorName) {
    case 'NotAllowedError':
      errorMessage =
        'Microphone access has not been granted to your browser. Allow mic access to proceed!'
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
