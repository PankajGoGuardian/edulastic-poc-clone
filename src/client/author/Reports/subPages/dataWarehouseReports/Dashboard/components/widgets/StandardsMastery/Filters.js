import React from 'react'
import { ControlDropDown } from '../../../../../../common/components/widgets/controlDropDown'
import { WidgetFilterDropdown, StyledRow } from '../../common/styledComponents'

const AcademicSummaryWidgetFilters = () => {
  const performanceBandsList = [
    {
      _id: '63296244dfe5d90009174d66',
      name:
        'Karthik Performance Band2 With Both bands selected for Above Standard',
      orgId: '6322e2b799978a000a298466',
      orgType: 'district',
      performanceBand: [
        {
          color: '#7c0a02',
          threshold: 81,
          aboveStandard: 1,
          name: 'Proficient',
        },
        {
          color: '#AFA515',
          threshold: 0,
          aboveStandard: 1,
          name: 'Below Basic',
        },
      ],
    },
    {
      _id: '63296348dfe5d90009174d67',
      name: 'Where We Are Today',
      orgId: '6322e2b799978a000a298466',
      orgType: 'district',
      performanceBand: [
        {
          color: '#576BA9',
          threshold: 82,
          aboveStandard: 1,
          name: 'Proficient Cyber Patriots Midnight Buzz Wonderland',
        },
        {
          color: '#A1C3EA',
          threshold: 45,
          aboveStandard: 1,
          name: 'Basic Western Front American Hustlers',
        },
        {
          color: '#F39300',
          threshold: 0,
          aboveStandard: 0,
          name: 'Below Basic Faster Than The Boys',
        },
      ],
    },
  ]
  const selectedPerformanceBand = {
    _id: '63296244dfe5d90009174d66',
    name:
      'Karthik Performance Band2 With Both bands selected for Above Standard',
    orgId: '6322e2b799978a000a298466',
    orgType: 'district',
    performanceBand: [
      {
        color: '#7c0a02',
        threshold: 81,
        aboveStandard: 1,
        name: 'Proficient',
      },
      {
        color: '#AFA515',
        threshold: 0,
        aboveStandard: 1,
        name: 'Below Basic',
      },
    ],
  }
  return (
    <StyledRow type="flex">
      <WidgetFilterDropdown bold>
        Test Type: <span className="bold">&nbsp;&nbsp;Edulastic</span>
      </WidgetFilterDropdown>
      <WidgetFilterDropdown data-cy="performanceBand">
        <div className="filter-label">PERFORMANCE BAND</div>
        <ControlDropDown
          height="35px"
          by={selectedPerformanceBand}
          selectCB={() => {}}
          data={performanceBandsList}
          prefix="Performance Band"
          showPrefixOnSelected={false}
        />
      </WidgetFilterDropdown>
    </StyledRow>
  )
}

export default AcademicSummaryWidgetFilters
