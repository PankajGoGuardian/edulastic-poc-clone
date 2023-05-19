import { EduElse, EduIf, EduThen } from '@edulastic/common'
import React from 'react'
import { Tooltip } from 'antd'
import { reportUtils } from '@edulastic/constants'
import HorizontalBar from '../../../../../common/components/HorizontalBar'
import { getHorizontalBarData } from './utils'
import { CustomStyledCell } from '../common/styledComponents'

const { getProficiencyBand, performanceBandKeys } = reportUtils.common

const PerformanceDistribution = ({
  value,
  testType,
  isStudentCompareBy,
  selectedPerformanceBand,
  isExternal,
}) => {
  const avg = value[testType]?.avgScore || 0
  let band = {}
  let barData = []

  const bandKey = isExternal
    ? performanceBandKeys.EXTERNAL
    : performanceBandKeys.INTERNAL

  if (isStudentCompareBy) {
    band = getProficiencyBand(avg, selectedPerformanceBand, bandKey)
  } else {
    barData = getHorizontalBarData(
      value[testType]?.distribution,
      selectedPerformanceBand,
      bandKey
    )
  }

  return (
    <EduIf condition={isStudentCompareBy}>
      <EduThen>
        <Tooltip title={band?.name || ''}>
          <CustomStyledCell color={band?.color} className="styled-cell">
            {band?.name || ''}
          </CustomStyledCell>
        </Tooltip>
      </EduThen>
      <EduElse>
        <HorizontalBar data={barData} />
      </EduElse>
    </EduIf>
  )
}

export default PerformanceDistribution
