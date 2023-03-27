import React from 'react'
import { Row } from 'antd'
import { ControlDropDown } from '../../../common/components/widgets/controlDropDown'

const TableFilters = ({
  setTableFilters,
  compareByOptions = [],
  selectedTableFilters = {},
}) => {
  const updateTableFilters = (e, selected, keyName) => {
    setTableFilters({
      ...selectedTableFilters,
      [keyName]: selected,
    })
  }
  return (
    <Row type="flex">
      <ControlDropDown
        style={{ marginRight: '10px' }}
        prefix="Compare By"
        by={selectedTableFilters.compareBy}
        selectCB={(e, selected) => updateTableFilters(e, selected, 'compareBy')}
        data={compareByOptions}
      />
    </Row>
  )
}

export default TableFilters
