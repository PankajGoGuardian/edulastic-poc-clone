import React from 'react'
import { ControlDropDown } from '../../../../../common/components/widgets/controlDropDown'
import SectionLabel from '../../../../../common/components/SectionLabel'
import { compareByOptions } from '../../../../multipleAssessmentReport/PreVsPost/utils'
import { StyledRow } from '../common/styledComponents'

const DashboardTableFilters = ({ selectedCompareBy, setCompareBy }) => {
  const updateTableFilter = (e, selected) => {
    setCompareBy(selected)
  }
  return (
    <StyledRow type="flex" justifyContent="space-between">
      <SectionLabel>Performance By {selectedCompareBy.title}</SectionLabel>
      <ControlDropDown
        height="40px"
        prefix="Compare By"
        by={selectedCompareBy}
        selectCB={updateTableFilter}
        data={compareByOptions}
      />
    </StyledRow>
  )
}

export default DashboardTableFilters
