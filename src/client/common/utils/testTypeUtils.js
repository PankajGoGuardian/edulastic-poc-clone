import { roleuser, testTypes as testTypesConstants } from '@edulastic/constants'
import { omit } from 'lodash'

const { TEST_TYPES, TEST_TYPE_LABELS } = testTypesConstants

export const getTestTypeFullNames = (testType, role) => {
  const isAdmin = roleuser.DA_SA_ROLE_ARRAY.includes(role)
  if (isAdmin || TEST_TYPES.COMMON.includes(testType)) {
    return TEST_TYPE_LABELS
  }
  return omit(TEST_TYPE_LABELS, TEST_TYPES.COMMON)
}

export const getProfileKey = (testType) => {
  for (const [key, value] of Object.entries(TEST_TYPES)) {
    if (value.includes(testType)) {
      return key.toLowerCase()
    }
  }
}
