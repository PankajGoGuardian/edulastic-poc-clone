import React from 'react'
import { ControlDropDown } from '../../../../../../common/components/widgets/controlDropDown'
import { StyledDropDownContainer } from '../../../../../../common/styled'
import { StyledRow, StyledLabel } from '../../common/styledComponents'

const AcademicSummaryWidgetFilters = () => {
  const performanceBandsList = [
    {
      key: '63296244dfe5d90009174d66',
      title:
        'Karthik Performance Band2 With Both bands selected for Above Standard',
    },
    {
      key: '63296348dfe5d90009174d67',
      title: 'Where We Are Today',
    },
    {
      key: '6322e2b799978a000a298469',
      title: 'Standard Performance Band',
    },
    {
      key: '63ca12988de9410008ae349e',
      title: 'Large Performance Band',
    },
    {
      key: '63d34ec0ac9778000898f1ab',
      title: '7 Levels PB',
    },
    {
      key: '63d34fa13e9cf600086b2acc',
      title: '5 levels PB',
    },
  ]
  const selectedPerformanceBand = {
    key: '63296244dfe5d90009174d66',
    title:
      'Karthik Performance Band2 With Both bands selected for Above Standard',
  }
  return (
    <StyledRow type="flex">
      <StyledLabel>PERFORMANCE BAND:</StyledLabel>
      <StyledDropDownContainer
        maxWidth="180px"
        flex="0 0 200px"
        xs={24}
        sm={8}
        lg={4}
      >
        <ControlDropDown
          height="35px"
          by={selectedPerformanceBand}
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
