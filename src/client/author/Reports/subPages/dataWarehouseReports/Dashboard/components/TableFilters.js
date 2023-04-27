import React from 'react'

import { EduIf } from '@edulastic/common'
import { IconPlusCircle } from '@edulastic/icons'
import { ControlDropDown } from '../../../../common/components/widgets/controlDropDown'
import SectionLabel from '../../../../common/components/SectionLabel'
import { StyledRow, StyledEduButton } from './common/styledComponents'

import { tableFilterTypes } from '../utils'

const DashboardTableFilters = ({
  tableFilters,
  updateTableFiltersCB,
  handleAddToGroupClick,
  addToStudentGroupEnabled,
  compareByOptions,
}) => {
  return (
    <StyledRow
      type="flex"
      justifyContent="space-between"
      margin="0"
      style={{ padding: 0 }}
    >
      <SectionLabel style={{ fontSize: '18px' }}>
        Performance By {tableFilters[tableFilterTypes.COMPARE_BY].title}
      </SectionLabel>
      <StyledRow
        type="flex"
        justifyContent="right"
        margin="0"
        style={{ padding: 0 }}
      >
        <EduIf condition={addToStudentGroupEnabled}>
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
