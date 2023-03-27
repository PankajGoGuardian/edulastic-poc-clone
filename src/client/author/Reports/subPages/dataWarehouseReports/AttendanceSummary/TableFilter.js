import React from 'react'
import { Row } from 'antd'
import { ControlDropDown } from '../../../common/components/widgets/controlDropDown'

const TableFilters = ({ setCompareBy, compareByOptions = [], compareBy }) => {
  return (
    <Row type="flex">
      <ControlDropDown
        style={{ marginRight: '10px' }}
        prefix="Compare By"
        by={compareBy}
        selectCB={(e, selected) => setCompareBy(selected.key)}
        data={compareByOptions}
      />
    </Row>
  )
}

export default TableFilters
