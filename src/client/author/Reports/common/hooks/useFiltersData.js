import { useMemo } from 'react'

import { TEST_TYPES } from '@edulastic/constants/const/testTypes'
import { getArrayOfAllTestTypes } from '../../../../common/utils/testTypeUtils'

const useFiltersData = (filtersData) =>
  useMemo(() => {
    const { demographics = [], testTypes = getArrayOfAllTestTypes() } =
      filtersData?.data?.result || {}

    const availableTestTypes = testTypes.filter(
      ({ key }) => !TEST_TYPES.PRACTICE.includes(key)
    )

    return { demographics, testTypes, availableTestTypes }
  }, [filtersData])

export default useFiltersData
