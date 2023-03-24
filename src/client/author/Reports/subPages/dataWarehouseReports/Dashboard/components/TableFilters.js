import React from 'react'

import { EduIf } from '@edulastic/common'
import { IconPlusCircle } from '@edulastic/icons'
import { ControlDropDown } from '../../../../common/components/widgets/controlDropDown'
import SectionLabel from '../../../../common/components/SectionLabel'
import { StyledRow, StyledEduButton } from './common/styledComponents'

import { compareByKeys, tableFilterTypes } from '../utils'

const DashboardTableFilters = ({
  tableFilters,
  updateTableFiltersCB,
  handleAddToGroupClick,
  compareByOptions,
  isSharedReport = false,
}) => {
  const showAddToGroupButton =
    !isSharedReport &&
    tableFilters[tableFilterTypes.COMPARE_BY].key === compareByKeys.STUDENT

  return (
    <StyledRow type="flex" justifyContent="space-between" margin="-2px 10px">
      <SectionLabel>
        Performance By {tableFilters[tableFilterTypes.COMPARE_BY].title}
      </SectionLabel>
      <StyledRow type="flex" justifyContent="right" margin="-2px 10px">
        <EduIf condition={showAddToGroupButton}>
          <StyledEduButton onClick={handleAddToGroupClick}>
            <IconPlusCircle /> Add To Student Group
          </StyledEduButton>
        </EduIf>
        <ControlDropDown
          height="35px"
          prefix="Compare By"
          by={tableFilters.compareBy}
          selectCB={(e, selected, comData) =>
            updateTableFiltersCB(selected, comData)
          }
          data={compareByOptions}
          comData={tableFilterTypes.COMPARE_BY}
        />
      </StyledRow>
    </StyledRow>
  )
}

export default DashboardTableFilters
