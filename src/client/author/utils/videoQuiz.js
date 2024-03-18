import { testCategoryTypes } from '@edulastic/constants/const/test'
import { notification } from '@edulastic/common'
import { isValidVideoUrl } from '../AssessmentPage/VideoQuiz/utils/videoPreviewHelpers'

export const getIsBuyAiSuiteAlertModalVisible = (
  testCategory = '',
  isRedirectToVQAddOn = false
) =>
  testCategory &&
  testCategory === testCategoryTypes.VIDEO_BASED &&
  isRedirectToVQAddOn

export const isValidVqVideoURL = (test = {}) => {
  const { videoUrl = '', testCategory } = test

  if (testCategory === testCategoryTypes.VIDEO_BASED) {
    if (videoUrl.trim() === '') {
      notification({ messageKey: 'pleaseEnterVideoUrl' })
      return false
    }
    if (!isValidVideoUrl(videoUrl)) {
      notification({ messageKey: 'linkCantPlayed' })
      return false
    }
  }

  return true
}
