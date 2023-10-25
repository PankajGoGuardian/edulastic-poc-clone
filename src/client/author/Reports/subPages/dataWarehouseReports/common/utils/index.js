import qs from 'qs'
import { isEmpty } from 'lodash'

import {
  compareByKeysToFilterKeys,
  compareByKeys,
  nextCompareByKeys,
} from '@edulastic/constants/reportUtils/dataWarehouseReports'
import { lightGreen12, lightGrey9, lightRed5 } from '@edulastic/colors'

import {
  StyledIconCaretDown,
  StyledIconCaretUp,
} from '../components/styledComponents'
import { DW_WLR_REPORT_URL } from '../../../../common/constants/dataWarehouseReports'

export const getWidgetCellFooterInfo = (value, showReverseTrend) => {
  let color = lightGrey9
  let Icon = null
  if (value > 0) {
    color = showReverseTrend ? lightRed5 : lightGreen12
    Icon = StyledIconCaretUp
  } else if (value < 0) {
    color = showReverseTrend ? lightGreen12 : lightRed5
    Icon = StyledIconCaretDown
  }
  return [color, Icon]
}

export const buildDrillDownUrl = ({
  key,
  selectedCompareBy,
  reportFilters,
  reportUrl,
}) => {
  if (isEmpty(key)) return null
  const filterField = compareByKeysToFilterKeys[selectedCompareBy]

  const _filters = {
    ...reportFilters,
    [filterField]: key,
    selectedCompareBy: nextCompareByKeys[selectedCompareBy],
  }

  if (selectedCompareBy === compareByKeys.STUDENT) {
    delete _filters[filterField]
    Object.assign(_filters, {
      courseIds: _filters.courseId,
      testTypes: _filters.assessmentTypes,
      performanceBandProfileId: _filters.profileId,
    })
    return `${DW_WLR_REPORT_URL}${key}?${qs.stringify(_filters, {
      arrayFormat: 'comma',
    })}`
  }
  return `${reportUrl}?${qs.stringify(_filters, { arrayFormat: 'comma' })}`
}
