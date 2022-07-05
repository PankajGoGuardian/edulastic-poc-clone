import {
  TEACHER,
  DISTRICT_ADMIN,
  SCHOOL_ADMIN,
  DA_SA_ROLE_ARRAY,
} from '@edulastic/constants/const/roleType'
import {
  TEST_TYPE_LABELS,
  PREMIUM_TEST_TYPES,
  TEST_TYPES,
  TEST_TYPES_VALUES_MAP,
} from '@edulastic/constants/const/testTypes'
import { omit } from 'lodash'
import {
  getAvailableTestTypesForUser,
  getProfileKey,
  includeCommonOnTestType,
  getArrayOfAllTestTypes,
  getArrayOfNonPremiumTestTypes,
} from '../testTypeUtils'

describe('Testing the TestTypeUtils', () => {
  const allRoles = [TEACHER, SCHOOL_ADMIN, DISTRICT_ADMIN]
  const testTypesForNoPremium = omit(TEST_TYPE_LABELS, PREMIUM_TEST_TYPES)
  const testTypesForNoCommon = omit(TEST_TYPE_LABELS, TEST_TYPES.COMMON)
  const testTypesForNoPremiumNoCommon = omit(TEST_TYPE_LABELS, [
    ...PREMIUM_TEST_TYPES,
    ...TEST_TYPES.COMMON,
  ])
  const common = TEST_TYPES_VALUES_MAP.COMMON_ASSESSMENT
  const practice = TEST_TYPES_VALUES_MAP.PRACTICE

  describe(`#getAvailableTestTypesForUser()`, () => {
    allRoles.forEach((role) => {
      const isAdmin = DA_SA_ROLE_ARRAY.includes(role)
      it(`Verify test types for free ${role}`, () => {
        const actualTestTypes = getAvailableTestTypesForUser({
          isPremium: false,
          role,
        })

        if (isAdmin) {
          expect(actualTestTypes).toStrictEqual(testTypesForNoPremium)
        } else {
          expect(actualTestTypes).toStrictEqual(testTypesForNoPremiumNoCommon)
        }
      })
      it(`Verify test types for premium ${role}`, () => {
        const actualTestTypes = getAvailableTestTypesForUser({
          isPremium: true,
          role,
        })
        if (isAdmin) {
          expect(actualTestTypes).toStrictEqual(TEST_TYPE_LABELS)
        } else {
          expect(actualTestTypes).toStrictEqual(testTypesForNoCommon)
        }
      })
    })
    it('Verify testtypes when no user details is provided', () => {
      const actualTestTypes = getAvailableTestTypesForUser()
      expect(actualTestTypes).toStrictEqual(testTypesForNoPremium)
    })
  })

  describe(`#includeCommonOnTestType()`, () => {
    allRoles.forEach((role) => {
      const isAdmin = DA_SA_ROLE_ARRAY.includes(role)
      it(`Verify test types for free ${role} by passing COMMON test type - ${common}`, () => {
        const availableTestTypes = getAvailableTestTypesForUser({
          isPremium: false,
          role,
        })
        const expectedTestTypes = includeCommonOnTestType(
          availableTestTypes,
          common
        )
        expect(expectedTestTypes).toStrictEqual(testTypesForNoPremium)
      })

      it(`Verify test types for premium ${role} by passing COMMON test type - ${common}`, () => {
        const availableTestTypes = getAvailableTestTypesForUser({
          isPremium: true,
          role,
        })
        const expectedTestTypes = includeCommonOnTestType(
          availableTestTypes,
          common
        )
        expect(expectedTestTypes).toStrictEqual(TEST_TYPE_LABELS)
      })

      it(`Verify test types for free ${role} by passing PRACTICE test type - ${practice}`, () => {
        const availableTestTypes = getAvailableTestTypesForUser({
          isPremium: false,
          role,
        })
        const expectedTestTypes = includeCommonOnTestType(
          availableTestTypes,
          practice
        )

        if (isAdmin) {
          expect(expectedTestTypes).toStrictEqual(testTypesForNoPremium)
        } else {
          expect(expectedTestTypes).toStrictEqual(testTypesForNoPremiumNoCommon)
        }
      })

      it(`Verify test types for premium ${role} by passing PRACTICE test type - ${practice}`, () => {
        const availableTestTypes = getAvailableTestTypesForUser({
          isPremium: true,
          role,
        })
        const expectedTestTypes = includeCommonOnTestType(
          availableTestTypes,
          practice
        )
        if (isAdmin) {
          expect(expectedTestTypes).toStrictEqual(TEST_TYPE_LABELS)
        } else {
          expect(expectedTestTypes).toStrictEqual(testTypesForNoCommon)
        }
      })
    })
  })

  describe('#getProfileKey()', () => {
    for (const [key, value] of Object.entries(TEST_TYPES)) {
      value.forEach((testType) => {
        it(`Verify getProfileKey for ${testType} - ${key}`, () => {
          const result = getProfileKey(testType)
          expect(result).toBe(key.toLowerCase())
        })
      })
    }
  })

  describe('#getArrayOfAllTestTypes() and #getArrayOfNonPremiumTestTypes', () => {
    it('Verify test type for free user in Report filter', () => {
      const expected = Object.entries(testTypesForNoPremium).map(
        ([key, title]) => ({
          key,
          title,
        })
      )
      const availableTestTypes = getArrayOfNonPremiumTestTypes()
      expect(availableTestTypes).toStrictEqual(expected)
    })
    it('Verify test type for premium user in Report filter', () => {
      const expected = Object.entries(TEST_TYPE_LABELS).map(([key, title]) => ({
        key,
        title,
      }))
      const availableTestTypes = getArrayOfAllTestTypes()
      expect(availableTestTypes).toStrictEqual(expected)
    })
  })
})
