import React from 'react'
import { Row } from 'antd'
import { ControlDropDown } from '../../../../../common/components/widgets/controlDropDown'
import StudentGroupBtn from '../../../common/components/StudentGroupBtn'
import { isAddToStudentGroupEnabled } from '../../../common/utils'

const TableFilters = ({
  setTableFilters,
  handleAddToGroupClick,
  compareByOptions = [],
  analyseByOptions = [],
  selectedTableFilters = {},
  isSharedReport = false,
}) => {
  const updateTableFilters = (e, selected, keyName) => {
    setTableFilters({
      ...selectedTableFilters,
      [keyName]: selected,
    })
  }
  const showAddToStudentGroupBtn = isAddToStudentGroupEnabled(
    isSharedReport,
    selectedTableFilters.compareBy?.key
  )
  return (
    <Row type="flex">
      <StudentGroupBtn
        showAddToStudentGroupBtn={showAddToStudentGroupBtn}
        handleAddToGroupClick={handleAddToGroupClick}
      />
      <ControlDropDown
        style={{ marginRight: '10px' }}
        prefix="Compare By"
        by={selectedTableFilters.compareBy}
        selectCB={(e, selected) => updateTableFilters(e, selected, 'compareBy')}
        data={compareByOptions}
      />
      <ControlDropDown
        prefix="Analyse By"
        by={selectedTableFilters.analyseBy}
        selectCB={(e, selected) => updateTableFilters(e, selected, 'analyseBy')}
        data={analyseByOptions}
      />
    </Row>
  )
}

export default TableFilters
