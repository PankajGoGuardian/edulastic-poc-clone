import { useMemo } from 'react'

import {
  NON_ACADEMIC_DATA_TYPES,
  TEST_TYPES,
} from '@edulastic/constants/const/testTypes'
import { getArrayOfAllTestTypes } from '../../../../common/utils/testTypeUtils'

const internalTestTypes = getArrayOfAllTestTypes()

const externalNonAcademicFeedTypes = Object.entries(
  NON_ACADEMIC_DATA_TYPES
).map(([key, title]) => ({ key, title }))

const useFiltersData = (filtersData) =>
  useMemo(() => {
    const { demographics = [], testTypes = internalTestTypes } =
      filtersData?.data?.result || {}

    const availableTestTypes = testTypes.filter(
      ({ key }) => !TEST_TYPES.PRACTICE.includes(key)
    )

    const externalAcademicFeedTypes = availableTestTypes.filter(
      ({ key }) => !internalTestTypes.find((t) => t.key === key)
    )
    // available feed types are required to generate labels or filter data for specific feed types that the district can access
    // non-academic feed types may or may not be used as the content for the same has static placement in reports
    // academic feed types can be dynamically shown/hidden in reports based on the data available
    const availableFeedTypes = [
      ...externalNonAcademicFeedTypes,
      ...externalAcademicFeedTypes,
    ]

    return { demographics, testTypes, availableTestTypes, availableFeedTypes }
  }, [filtersData])

export default useFiltersData
