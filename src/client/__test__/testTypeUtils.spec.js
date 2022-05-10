import {
  TEACHER,
  DISTRICT_ADMIN,
  SCHOOL_ADMIN,
  DA_SA_ROLE_ARRAY,
} from '../../../packages/constants/const/roleType'
import {
  TEST_TYPE_LABELS,
  PREMIUM_TEST_TYPES,
  TEST_TYPES,
  TEST_TYPES_VALUES_MAP,
} from '../../../packages/constants/const/testTypes'
import { omit } from 'lodash'
import {
  getTestTypeFullNames,
  getProfileKey,
} from '../common/utils/testTypeUtils'

describe('Testing the TestTypeUtils', () => {
  const allRoles = [TEACHER, SCHOOL_ADMIN, DISTRICT_ADMIN]
  describe('#getTestTypeFullNames()', () => {
    const testTypesForNoPremium = omit(TEST_TYPE_LABELS, PREMIUM_TEST_TYPES)
    const testTypesForNoCommon = omit(TEST_TYPE_LABELS, TEST_TYPES.COMMON)
    const testTypesForNoPremiumNoCommon = omit(TEST_TYPE_LABELS, [
      ...PREMIUM_TEST_TYPES,
      ...TEST_TYPES.COMMON,
    ])

    it(`Verify only free test types are returned when premium is false`, () => {
      const testTypes = getTestTypeFullNames(false)
      expect(testTypes).toStrictEqual(testTypesForNoPremium)
    })

    it(`Verify all test types are returned when premium is true`, () => {
      const testTypes = getTestTypeFullNames(true)
      expect(testTypes).toStrictEqual(TEST_TYPE_LABELS)
    })

    allRoles.forEach((role) => {
      const isAdmin = DA_SA_ROLE_ARRAY.includes(role)
      it(`Verify test types for free ${role}`, () => {
        const testTypes = getTestTypeFullNames(false, role)

        if (isAdmin) {
          expect(testTypes).toStrictEqual(testTypesForNoPremium)
        } else {
          expect(testTypes).toStrictEqual(testTypesForNoPremiumNoCommon)
        }
      })
      it(`Verify test types for premium ${role}`, () => {
        const testTypes = getTestTypeFullNames(true, role)

        if (isAdmin) {
          expect(testTypes).toStrictEqual(TEST_TYPE_LABELS)
        } else {
          expect(testTypes).toStrictEqual(testTypesForNoCommon)
        }
      })

      TEST_TYPES.COMMON.forEach((testType) => {
        it(`Verify test types for free ${role} by passing COMMON test type - ${testType}`, () => {
          const testTypes = getTestTypeFullNames(false, role, testType)
          expect(testTypes).toStrictEqual(testTypesForNoPremium)
        })

        it(`Verify test types for premium ${role} by passing COMMON test type - ${testType}`, () => {
          const testTypes = getTestTypeFullNames(true, role, testType)
          expect(testTypes).toStrictEqual(TEST_TYPE_LABELS)
        })
      })

      it(`Verify test types for free ${role} by passing PRACTICE test type - ${TEST_TYPES_VALUES_MAP.PRACTICE}`, () => {
        const testTypes = getTestTypeFullNames(
          false,
          role,
          TEST_TYPES_VALUES_MAP.PRACTICE
        )
        if (isAdmin) {
          expect(testTypes).toStrictEqual(testTypesForNoPremium)
        } else {
          expect(testTypes).toStrictEqual(testTypesForNoPremiumNoCommon)
        }
      })

      it(`Verify test types for premium ${role} by passing PRACTICE test type - ${TEST_TYPES_VALUES_MAP.PRACTICE}`, () => {
        const testTypes = getTestTypeFullNames(
          true,
          role,
          TEST_TYPES_VALUES_MAP.PRACTICE
        )
        if (isAdmin) {
          expect(testTypes).toStrictEqual(TEST_TYPE_LABELS)
        } else {
          expect(testTypes).toStrictEqual(testTypesForNoCommon)
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
})
