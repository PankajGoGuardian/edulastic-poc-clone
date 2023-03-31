import React from 'react'
import { ControlDropDown } from '../../../../../../common/components/widgets/controlDropDown'
import { StyledDropDownContainer } from '../../../../../../common/styled'
import { academicSummaryFiltersTypes } from '../../../utils'
import { StyledLabel, StyledRow } from '../../common/styledComponents'

const AcademicSummaryWidgetFilters = ({
  filters,
  setFilters,
  performanceBandsList,
  availableTestTypes,
}) => {
  const updateFilterDropdownCB = (e, selected, comData) => {
    setFilters({
      ...filters,
      [comData]: selected,
    })
  }
  return (
    <StyledRow type="flex" margin="40px 0 0 0">
      <StyledLabel>TEST TYPE:</StyledLabel>
      <StyledDropDownContainer
        maxWidth="180px"
        flex="0 0 150px"
        xs={24}
        sm={8}
        lg={4}
      >
        <ControlDropDown
          height="35px"
          by={filters[academicSummaryFiltersTypes.TEST_TYPE]}
          selectCB={updateFilterDropdownCB}
          data={availableTestTypes}
          comData={academicSummaryFiltersTypes.TEST_TYPE}
          prefix="Test Type"
          showPrefixOnSelected={false}
        />
      </StyledDropDownContainer>
      <StyledLabel>PERFORMANCE BAND:</StyledLabel>
      <StyledDropDownContainer
        maxWidth="180px"
        flex="0 0 150px"
        xs={24}
        sm={8}
        lg={4}
      >
        <ControlDropDown
          height="35px"
          by={filters[academicSummaryFiltersTypes.PERFORMANCE_BAND]}
          selectCB={updateFilterDropdownCB}
          data={performanceBandsList}
          comData={academicSummaryFiltersTypes.PERFORMANCE_BAND}
          prefix="Performance Band"
          showPrefixOnSelected={false}
        />
      </StyledDropDownContainer>
    </StyledRow>
  )
}

export default AcademicSummaryWidgetFilters
