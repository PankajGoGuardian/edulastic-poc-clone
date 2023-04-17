import { FlexContainer } from '@edulastic/common'
import React, { useEffect } from 'react'
import { ControlDropDown } from '../../../../../../common/components/widgets/controlDropDown'
import { StyledDropDownContainer } from '../../../../../../common/styled'
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

  useEffect(() => {
    const [defaultTestType] = availableTestTypes
    const selectedTestType = availableTestTypes.find(
      ({ key }) => filters[academicSummaryFiltersTypes.TEST_TYPE]?.key === key
    )
    setFilters({
      ...filters,
      [academicSummaryFiltersTypes.TEST_TYPE]:
        selectedTestType || defaultTestType,
    })
  }, [availableTestTypes])

  return (
    <FlexContainer
      padding="50px 40px"
      mr="40px"
      justifyContent="space-between"
      alignItems="center"
    >
      <FlexContainer alignItems="center">
        <StyledText margin="0 10px 0 0" fontSize="11px">
          TEST TYPE:
        </StyledText>
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
      </FlexContainer>
      <FlexContainer alignItems="center" flexWrap="nowrap">
        <StyledText margin="0 10px 0 0" fontSize="11px">
          PERFORMANCE BAND:
        </StyledText>
        <StyledDropDownContainer
          maxWidth="150px"
          flex="0 0 180px"
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
      </FlexContainer>
    </FlexContainer>
  )
}

export default AcademicSummaryWidgetFilters
