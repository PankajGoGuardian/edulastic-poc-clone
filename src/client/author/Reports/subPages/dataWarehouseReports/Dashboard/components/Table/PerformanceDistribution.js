import { EduElse, EduIf, EduThen } from '@edulastic/common'
import React from 'react'
import { getProficiencyBand } from '@edulastic/constants/reportUtils/common'
import { Tooltip } from 'antd'
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
  let band = {}
  let barData = []

  if (isStudentCompareBy) {
    band = getProficiencyBand(avg, selectedPerformanceBand)
  } else {
    barData = getHorizontalBarData(
      value[testType]?.distribution,
      selectedPerformanceBand
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
