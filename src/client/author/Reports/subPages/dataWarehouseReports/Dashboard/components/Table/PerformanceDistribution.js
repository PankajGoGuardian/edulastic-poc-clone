import { EduElse, EduIf, EduThen } from '@edulastic/common'
import React from 'react'
import { getProficiencyBand } from '@edulastic/constants/reportUtils/common'
import HorizontalBar from '../../../../../common/components/HorizontalBar'
import { getHorizontalBarData } from './utils'
import { CustomStyledCell } from '../common/styledComponents'

const PerformanceDistribution = ({
  value,
  testType,
  isStudentCompareBy,
  selectedPerformanceBand,
}) => {
  const avg = value[testType]?.avg || 0
  let cellColor = ''
  let barData = []

  if (isStudentCompareBy) {
    cellColor = getProficiencyBand(avg, selectedPerformanceBand)?.color
  } else {
    barData = getHorizontalBarData(
      value[testType]?.distribution,
      selectedPerformanceBand
    )
  }

  return (
    <EduIf condition={isStudentCompareBy}>
      <EduThen>
        <CustomStyledCell color={cellColor}>{avg}%</CustomStyledCell>
      </EduThen>
      <EduElse>
        <HorizontalBar data={barData} />
      </EduElse>
    </EduIf>
  )
}

export default PerformanceDistribution
