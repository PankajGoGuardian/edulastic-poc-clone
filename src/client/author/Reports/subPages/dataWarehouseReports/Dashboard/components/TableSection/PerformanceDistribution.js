import { EduElse, EduIf, EduThen } from '@edulastic/common'
import React from 'react'
import { Tooltip } from 'antd'
import { reportUtils } from '@edulastic/constants'
import HorizontalBar from '../../../../../common/components/HorizontalBar'
import { getHorizontalBarData } from './utils'
import { CustomStyledCell } from '../common/styledComponents'

const { performanceBandKeys } = reportUtils.common

const PerformanceDistribution = ({
  value,
  testType,
  isStudentCompareBy,
  isDistrictAvgDimension,
  selectedPerformanceBand,
  isExternal,
}) => {
  let band = {}
  let barData = []

  const bandKey = isExternal
    ? performanceBandKeys.EXTERNAL
    : performanceBandKeys.INTERNAL

  const showDistribution = !isStudentCompareBy || isDistrictAvgDimension
  const distribution = value[testType]?.distribution || []

  if (showDistribution) {
    barData = getHorizontalBarData(
      distribution,
      selectedPerformanceBand,
      bandKey
    )
  } else {
    band =
      selectedPerformanceBand.find(
        (pb) => pb[bandKey] === distribution[0]?.bandScore
      ) || {}
  }

  return (
    <EduIf condition={showDistribution}>
      <EduThen>
        <HorizontalBar data={barData} dynamicColor />
      </EduThen>
      <EduElse>
        <Tooltip title={band.name || ''}>
          <CustomStyledCell color={band.color} className="styled-cell">
            {band.name || ''}
          </CustomStyledCell>
        </Tooltip>
      </EduElse>
    </EduIf>
  )
}

export default PerformanceDistribution
