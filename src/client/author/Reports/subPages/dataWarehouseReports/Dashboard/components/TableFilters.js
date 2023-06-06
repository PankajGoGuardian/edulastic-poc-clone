import React from 'react'

import { ControlDropDown } from '../../../../common/components/widgets/controlDropDown'
import SectionLabel from '../../../../common/components/SectionLabel'
import { StyledRow } from './common/styledComponents'

import { tableFilterTypes } from '../utils'
import StudentGroupBtn from '../../common/components/StudentGroupBtn'

const DashboardTableFilters = ({
  tableFilters,
  updateTableFiltersCB,
  handleAddToGroupClick,
  showAddToStudentGroupBtn,
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
        <StudentGroupBtn
          showAddToStudentGroupBtn={showAddToStudentGroupBtn}
          handleAddToGroupClick={handleAddToGroupClick}
        />
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
