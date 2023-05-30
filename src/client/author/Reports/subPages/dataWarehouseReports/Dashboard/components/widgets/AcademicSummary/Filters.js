import { FlexContainer } from '@edulastic/common'
import React from 'react'
import { ControlDropDown } from '../../../../../../common/components/widgets/controlDropDown'
import { StyledText } from '../../../../common/components/styledComponents'
import { academicSummaryFiltersTypes } from '../../../utils'

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
    <FlexContainer
      padding="50px 40px"
      mr="30px"
      justifyContent="space-between"
      alignItems="center"
    >
      <FlexContainer alignItems="center">
        <StyledText margin="0 10px 0 0" fontSize="11px">
          TEST TYPE:
        </StyledText>
        <ControlDropDown
          height="36px"
          buttonWidth="160px"
          by={filters[academicSummaryFiltersTypes.TEST_TYPE]}
          selectCB={updateFilterDropdownCB}
          data={availableTestTypes}
          comData={academicSummaryFiltersTypes.TEST_TYPE}
          prefix="Test Type"
          showPrefixOnSelected={false}
        />
      </FlexContainer>
      <FlexContainer alignItems="center" flexWrap="nowrap">
        <StyledText margin="0 10px 0 0" fontSize="11px">
          PERFORMANCE BAND:
        </StyledText>
        <ControlDropDown
          height="36px"
          buttonWidth="160px"
          by={filters[academicSummaryFiltersTypes.PERFORMANCE_BAND]}
          selectCB={updateFilterDropdownCB}
          data={performanceBandsList}
          comData={academicSummaryFiltersTypes.PERFORMANCE_BAND}
          prefix="Performance Band"
          showPrefixOnSelected={false}
        />
      </FlexContainer>
    </FlexContainer>
  )
}

export default AcademicSummaryWidgetFilters
