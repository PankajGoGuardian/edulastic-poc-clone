import React from 'react'
import { Row } from 'antd'
import { EduButton } from '@edulastic/common'
import { IconPlusCircle } from '@edulastic/icons'
import { ControlDropDown } from '../../../../../common/components/widgets/controlDropDown'

const TableFilters = ({
  setTableFilters,
  handleAddToGroupClick,
  compareByOptions = [],
  analyseByOptions = [],
  selectedTableFilters = {},
}) => {
  return (
    <Row type="flex" justify="end" align="middle">
      {selectedTableFilters.compareBy.key === 'student' && (
        <EduButton
          style={{
            height: '32px',
            padding: '0 15px 0 10px',
            marginRight: '5px',
          }}
          onClick={handleAddToGroupClick}
        >
          <IconPlusCircle /> Add To Student Group
        </EduButton>
      )}
      <ControlDropDown
        style={{ marginRight: '10px' }}
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
