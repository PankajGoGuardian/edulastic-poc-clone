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
  const { performanceBand, testType } = filters
  const updateFilterDropdownCB = (e, selected, keyName) => {
    setFilters({
      ...filters,
      [keyName]: selected,
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
          by={testType}
          selectCB={(e, selected) =>
            updateFilterDropdownCB(
              e,
              selected,
              academicSummaryFiltersTypes.TEST_TYPE
            )
          }
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
          selectCB={(e, selected) =>
            updateFilterDropdownCB(
              e,
              selected,
              academicSummaryFiltersTypes.PERFORMANCE_BAND
            )
          }
          data={performanceBandsList}
          prefix="Performance Band"
          showPrefixOnSelected={false}
        />
      </StyledDropDownContainer>
    </StyledRow>
  )
}

export default AcademicSummaryWidgetFilters
