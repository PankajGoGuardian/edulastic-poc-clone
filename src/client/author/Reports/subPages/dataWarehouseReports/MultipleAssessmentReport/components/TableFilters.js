import React from 'react'
import PropTypes from 'prop-types'
import { Row, Icon } from 'antd'
import { FlexContainer } from '@edulastic/common'
import { orange } from '@edulastic/colors'
import { ControlDropDown } from '../../../../common/components/widgets/controlDropDown'
import {
  StyledH3,
  StyledTooltip,
  TableTitleContainer,
} from '../../../../common/styled'
import StudentGroupBtn from '../../common/components/StudentGroupBtn'

const TITLE_TOOLTIP_NOTE =
  'Note: The performance metrics are calculated based on students allocated to the selected school, class, or teacher. You may also see data from tests that were not specifically assigned to the currently displayed class or teacher.'
const TableFilters = ({
  updateFilterDropdownCB,
  compareByOptions = [],
  selectedCompareBy,
  handleAddToGroupClick,
  showAddToStudentGroupBtn,
}) => {
  return (
    <Row
      type="flex"
      justify="space-between"
      align="middle"
      style={{ marginTop: 45 }}
    >
      <TableTitleContainer>
        <StyledH3>
          Performance Deep-dive across Assessments by{' '}
          {selectedCompareBy?.title || '-'}
        </StyledH3>
        <StyledTooltip placement="right" title={TITLE_TOOLTIP_NOTE}>
          <Icon type="warning" theme="filled" style={{ color: orange }} />
        </StyledTooltip>
      </TableTitleContainer>

      <FlexContainer>
        <StudentGroupBtn
          showAddToStudentGroupBtn={showAddToStudentGroupBtn}
          handleAddToGroupClick={handleAddToGroupClick}
        />
        <ControlDropDown
          prefix="Compare By"
          by={selectedCompareBy}
          selectCB={(e, selected) =>
            updateFilterDropdownCB(selected, 'compareBy')
          }
          data={compareByOptions}
        />
      </FlexContainer>
    </Row>
  )
}

const optionsShape = PropTypes.shape({
  key: PropTypes.string,
  title: PropTypes.string,
})

TableFilters.propTypes = {
  updateFilterDropdownCB: PropTypes.func.isRequired,
  selectedCompareBy: optionsShape.isRequired,
}

export default TableFilters
