import React from 'react'
import { Row } from 'antd'

import { EduIf, FlexContainer } from '@edulastic/common'
import { isAddToStudentGroupEnabled } from '@edulastic/constants/reportUtils/dataWarehouseReports'

import SectionLabel from '../../../../../common/components/SectionLabel'
import { tableFilterTypes } from '../../utils'
import { StyledDropDownContainer } from '../../../../../common/styled'
import { ControlDropDown } from '../../../../../common/components/widgets/controlDropDown'
import StudentGroupBtn from '../../../common/components/StudentGroupBtn'
import RiskFilter from './RiskFilter'

const TableFilters = ({
  tableFilters,
  setTableFilters,
  compareByOptions = [],
  handleAddToGroupClick,
  isSharedReport,
}) => {
  const updateFilterDropdownCB = (e, selected, comData) => {
    setTableFilters((prevState) => ({
      ...prevState,
      [comData]: selected,
      [tableFilterTypes.PAGE]: 1,
    }))
  }

  const showAddToStudentGroupBtn = isAddToStudentGroupEnabled(
    isSharedReport,
    tableFilters[tableFilterTypes.COMPARE_BY]?.key
  )

  return (
    <Row type="flex" justify="space-between">
      <SectionLabel margin="0" width="40%" style={{ fontSize: '18px' }}>
        Risk distribution by {tableFilters[tableFilterTypes.COMPARE_BY].title}
      </SectionLabel>
      <FlexContainer mt="30px">
        <EduIf condition={showAddToStudentGroupBtn}>
          <RiskFilter
            tableFilters={tableFilters}
            setTableFilters={setTableFilters}
          />
        </EduIf>
        <StudentGroupBtn
          showAddToStudentGroupBtn={showAddToStudentGroupBtn}
          handleAddToGroupClick={handleAddToGroupClick}
        />
      </FlexContainer>
      <StyledDropDownContainer
        flex="0 0 230px"
        xs={24}
        sm={12}
        lg={6}
        padding="25px 0"
      >
        <ControlDropDown
          prefix="Compare By"
          height="40px"
          by={tableFilters[tableFilterTypes.COMPARE_BY]}
          selectCB={updateFilterDropdownCB}
          data={compareByOptions}
          comData={tableFilterTypes.COMPARE_BY}
        />
      </StyledDropDownContainer>
    </Row>
  )
}

export default TableFilters
