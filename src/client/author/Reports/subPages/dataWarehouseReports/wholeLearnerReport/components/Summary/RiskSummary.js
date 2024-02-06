import { lightGrey9 } from '@edulastic/colors'
import React from 'react'

import { EduIf } from '@edulastic/common'
import OverallRisk from './OverallRisk'
import AttendanceRisk from './AttendanceRisk'
import AcademicRisk from './AcademicRisk'

import { DashedLine } from '../../../../../common/styled'
import {
  RiskSummaryWrapper,
  StyledDiv,
  LimitationTextWrapper,
  ExclamationIcon,
  BlurEffect,
} from '../../common/styled'

const RiskSummary = ({ data, isMultiSchoolYear }) => {
  const {
    overallRisk,
    internalAssessmentRisk,
    externalAssessmentRisk,
    attendanceRisk,
  } = data
  return (
    <StyledDiv>
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
      <EduIf condition={isMultiSchoolYear}>
        <BlurEffect />
        <LimitationTextWrapper>
          <span>
            <ExclamationIcon className="fa fa-exclamation-circle" /> Multi-year
            and individual Test filters are not yet supported for this section
          </span>
        </LimitationTextWrapper>
      </EduIf>
    </StyledDiv>
  )
}

export default RiskSummary
