import React from 'react'
import { Row } from 'antd'
import { IconPlusCircle } from '@edulastic/icons'
import { ControlDropDown } from '../../../../../common/components/widgets/controlDropDown'
import { compareByKeys } from '../../utils'
import { StyledEduButton } from '../../common/styledComponents'

const TableFilters = ({
  setTableFilters,
  handleAddToGroupClick,
  compareByOptions = [],
  analyseByOptions = [],
  selectedTableFilters = {},
}) => {
  const updateTableFilters = (e, selected) => {
    setTableFilters({
      ...selectedTableFilters,
      compareBy: selected,
    })
  }
  return (
    <Row type="flex" justify="end" align="middle">
      {selectedTableFilters.compareBy.key === compareByKeys.STUDENT && (
        <StyledEduButton onClick={handleAddToGroupClick}>
          <IconPlusCircle /> Add To Student Group
        </StyledEduButton>
      )}
      <ControlDropDown
        style={{ marginRight: '10px' }}
        prefix="Compare By"
        by={selectedTableFilters.compareBy}
        selectCB={updateTableFilters}
        data={compareByOptions}
      />
      <ControlDropDown
        prefix="Analyse By"
        by={selectedTableFilters.analyseBy}
        selectCB={updateTableFilters}
        data={analyseByOptions}
      />
    </Row>
  )
}

export default TableFilters
