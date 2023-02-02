import React from 'react'
import { Row } from 'antd'
import { IconPlusCircle } from '@edulastic/icons'
import { EduIf } from '@edulastic/common'
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
  const updateTableFilters = (e, selected, keyName) => {
    setTableFilters({
      ...selectedTableFilters,
      [keyName]: selected,
    })
  }
  const showAddToGroupButton =
    selectedTableFilters.compareBy.key === compareByKeys.STUDENT
  return (
    <Row type="flex" justify="end" align="middle">
      <EduIf condition={showAddToGroupButton}>
        <StyledEduButton onClick={handleAddToGroupClick}>
          <IconPlusCircle /> Add To Student Group
        </StyledEduButton>
      </EduIf>
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
