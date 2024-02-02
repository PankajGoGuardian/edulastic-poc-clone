import { testCategoryTypes } from '@edulastic/constants/const/test'

export const getIsBuyAiSuiteAlertModalVisible = (
  testCategory = '',
  isRedirectToVQAddOn = false
) =>
  testCategory &&
  testCategory === testCategoryTypes.VIDEO_BASED &&
  isRedirectToVQAddOn
