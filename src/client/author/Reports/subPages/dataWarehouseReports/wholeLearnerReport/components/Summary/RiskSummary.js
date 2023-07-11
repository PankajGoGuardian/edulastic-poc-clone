import { lightGrey9 } from '@edulastic/colors'
import React from 'react'

import OverallRisk from './OverallRisk'
import AttendanceRisk from './AttendanceRisk'
import AcademicRisk from './AcademicRisk'

import { DashedLine } from '../../../../../common/styled'
import { RiskSummaryWrapper } from '../../common/styled'

const RiskSummary = ({ data }) => {
  const {
    overallRisk,
    internalAssessmentRisk,
    externalAssessmentRisk,
    attendanceRisk,
  } = data
  return (
    <RiskSummaryWrapper padding="20px 5px" flexWrap="nowrap">
      <OverallRisk overallRisk={overallRisk} />
      <DashedLine
        dashWidth="1px"
        height="80px"
        maxWidth="1.5px"
        dashColor={lightGrey9}
        margin="30px 0px"
      />
      <AcademicRisk
        internalAssessmentRisk={internalAssessmentRisk}
        externalAssessmentRisk={externalAssessmentRisk}
      />
      <DashedLine
        dashWidth="1px"
        height="80px"
        maxWidth="1.5px"
        dashColor={lightGrey9}
        margin="30px 0px"
      />
      <AttendanceRisk attendanceRisk={attendanceRisk} />
    </RiskSummaryWrapper>
  )
}

export default RiskSummary
