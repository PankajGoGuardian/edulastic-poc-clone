import { roleuser, testTypes as testTypesConstants } from '@edulastic/constants'
import { omit } from 'lodash'

const { TEST_TYPES, TEST_TYPE_LABELS, PREMIUM_TEST_TYPES } = testTypesConstants

export const getTestTypeFullNames = (isPremium, role, testType) => {
  const availableTestTypes = isPremium
    ? TEST_TYPE_LABELS
    : omit(TEST_TYPE_LABELS, PREMIUM_TEST_TYPES)
  const isAdmin = roleuser.DA_SA_ROLE_ARRAY.includes(role)
  if (role && !isAdmin && !TEST_TYPES.COMMON.includes(testType)) {
    return omit(availableTestTypes, TEST_TYPES.COMMON)
  }
  return availableTestTypes
}

export const getProfileKey = (testType) => {
  for (const [key, value] of Object.entries(TEST_TYPES)) {
    if (value.includes(testType)) {
      return key.toLowerCase()
    }
  }
}
