import React from 'react'
import { StyledGrid } from './common/styledComponents'
import AcademicSummary from './widgets/AcademicSummary/AcademicSummary'
import AttendanceSummary from './widgets/AttendanceSummary'
import StandardMastery from './widgets/StandardsMastery/StandardMastery'

const MasonGrid = () => {
  return (
    <StyledGrid>
      <AcademicSummary />
      <StandardMastery />
      <AttendanceSummary />
    </StyledGrid>
  )
}

export default MasonGrid
