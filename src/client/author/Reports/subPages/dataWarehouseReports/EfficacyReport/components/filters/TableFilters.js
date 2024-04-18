import React from 'react'
import { Row } from 'antd'
import { ControlDropDown } from '../../../../../common/components/widgets/controlDropDown'
import StudentGroupBtn from '../../../common/components/StudentGroupBtn'
import { isAddToStudentGroupEnabled } from '../../../common/utils'
import { tableFilterKeys } from '../../utils'

const TableFilters = ({
  tableFilters,
  setTableFilters,
  handleAddToGroupClick,
  compareByOptions = [],
  analyseByOptions = [],
  isSharedReport = false,
}) => {
  const updateTableFilters = (e, selected, keyName) => {
    setTableFilters({
      ...tableFilters,
      [keyName]: selected,
    })
  }
  const showAddToStudentGroupBtn = isAddToStudentGroupEnabled(
    isSharedReport,
    tableFilters.compareBy?.key
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
        by={tableFilters.compareBy}
        selectCB={(e, selected) =>
          updateTableFilters(e, selected, tableFilterKeys.COMPARE_BY)
        }
        data={compareByOptions}
      />
      <ControlDropDown
        prefix="Analyze By"
        by={tableFilters.analyseBy}
        selectCB={(e, selected) =>
          updateTableFilters(e, selected, tableFilterKeys.ANALYSE_BY)
        }
        data={analyseByOptions}
      />
    </Row>
  )
}

export default TableFilters
