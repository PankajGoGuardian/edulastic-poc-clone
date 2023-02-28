import React from 'react'
import { ControlDropDown } from '../../../../../../common/components/widgets/controlDropDown'
import { StyledDropDownContainer } from '../../../../../../common/styled'
import { StyledLabel, StyledRow } from '../../common/styledComponents'

const AcademicSummaryWidgetFilters = ({
  filters,
  // setFilters,
  performanceBandsList,
  availableTestTypes,
}) => {
  const { performanceBand, testType } = filters
  return (
    <StyledRow type="flex" margin="30px 0 0 0">
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
          by={testType}
          selectCB={() => {}}
          data={availableTestTypes}
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
          by={performanceBand}
          selectCB={() => {}}
          data={performanceBandsList}
          prefix="Performance Band"
          showPrefixOnSelected={false}
        />
      </StyledDropDownContainer>
    </StyledRow>
  )
}

export default AcademicSummaryWidgetFilters
