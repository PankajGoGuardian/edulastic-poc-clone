import React from 'react'
import { Row } from 'antd'
import { ControlDropDown } from '../../../../../common/components/widgets/controlDropDown'

const TableFilters = ({
  setTableFilters,
  compareByOptions = [],
  analyseByOptions = [],
  selectedTableFilters = {},
}) => {
  return (
    <Row type="flex" justify="end" align="middle">
      <ControlDropDown
        prefix="Compare By"
        by={selectedTableFilters.compareBy}
        selectCB={(e, selected) => {
          setTableFilters({
            ...selectedTableFilters,
            compareBy: selected,
          })
        }}
        data={compareByOptions}
      />
      <ControlDropDown
        prefix="Analyse By"
        by={selectedTableFilters.analyseBy}
        selectCB={(e, selected) => {
          setTableFilters({
            ...selectedTableFilters,
            analyseBy: selected,
          })
        }}
        data={analyseByOptions}
      />
    </Row>
  )
}

export default TableFilters
