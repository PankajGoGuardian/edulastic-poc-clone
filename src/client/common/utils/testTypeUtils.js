import { roleuser, testTypes as testTypesConstants } from '@edulastic/constants'
import { omit } from 'lodash'

const { TEST_TYPES, TEST_TYPE_LABELS, PREMIUM_TEST_TYPES } = testTypesConstants

export const getAllTestTypesMap = () => {
  return TEST_TYPE_LABELS
}

export const getNonPremiumTestTypes = () => {
  return omit(TEST_TYPE_LABELS, PREMIUM_TEST_TYPES)
}

export const includeCommonOnTestType = (availableTestTypes, testType) => {
  if (TEST_TYPES.COMMON.includes(testType)) {
    return {
      [`${testType}`]: TEST_TYPE_LABELS[testType],
      ...availableTestTypes,
    }
  }
  return availableTestTypes
}

export const getAvailableTestTypesForUser = (userDetails = {}) => {
  const { isPremium, role } = userDetails
  const availableTestTypes = isPremium
    ? getAllTestTypesMap()
    : getNonPremiumTestTypes()
  if (role) {
    const isAdmin = roleuser.DA_SA_ROLE_ARRAY.includes(role)
    return isAdmin
      ? availableTestTypes
      : omit(availableTestTypes, TEST_TYPES.COMMON)
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

export const getArrayOfAllTestTypes = () => {
  const availableTestTypes = getAllTestTypesMap()
  return Object.entries(availableTestTypes).map(([key, title]) => ({
    key,
    title,
  }))
}

export const getArrayOfNonPremiumTestTypes = () => {
  const availableTestTypes = getNonPremiumTestTypes()
  return Object.entries(availableTestTypes).map(([key, title]) => ({
    key,
    title,
  }))
}
