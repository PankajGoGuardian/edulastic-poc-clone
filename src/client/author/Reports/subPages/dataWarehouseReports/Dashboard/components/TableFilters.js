import React from 'react'

import { ControlDropDown } from '../../../../common/components/widgets/controlDropDown'
import SectionLabel from '../../../../common/components/SectionLabel'
import { StyledRow } from './common/styledComponents'

import { tableFilterTypes } from '../utils'

const DashboardTableFilters = ({
  tableFilters,
  updateTableFiltersCB,
  compareByOptions,
}) => {
  return (
    <StyledRow type="flex" justifyContent="space-between" margin="-2px 0">
      <SectionLabel>Performance By {tableFilters.compareBy.title}</SectionLabel>
      <ControlDropDown
        height="40px"
        prefix="Compare By"
        by={tableFilters.compareBy}
        selectCB={(e, selected, comData) =>
          updateTableFiltersCB(selected, comData)
        }
        data={compareByOptions}
        comData={tableFilterTypes.COMPARE_BY}
      />
    </StyledRow>
  )
}

export default DashboardTableFilters
