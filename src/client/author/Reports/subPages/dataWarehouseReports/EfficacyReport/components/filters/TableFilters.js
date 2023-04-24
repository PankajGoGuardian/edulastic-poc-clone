import React from 'react'
import { Row } from 'antd'
import { IconPlusCircle } from '@edulastic/icons'
import { EduIf } from '@edulastic/common'
import { ControlDropDown } from '../../../../../common/components/widgets/controlDropDown'
import { StyledEduButton } from '../../../../multipleAssessmentReport/PreVsPost/common/styledComponents'
import { addStudentToGroupFeatureEnabled } from '../../../../multipleAssessmentReport/PreVsPost/utils'

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
  const showAddToGroupButton = addStudentToGroupFeatureEnabled(
    selectedTableFilters.compareBy.key,
    isSharedReport
  )
  return (
    <Row type="flex">
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
