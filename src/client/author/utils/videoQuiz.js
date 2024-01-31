import { testCategoryTypes } from '@edulastic/constants/const/test'

export const getIsBuyAiSuiteAlertModalVisible = (
  testCategory = '',
  isRedirectToAddOn = false
) =>
  testCategory &&
  testCategory === testCategoryTypes.VIDEO_BASED &&
  isRedirectToAddOn
