import React from 'react'
import PropTypes from 'prop-types'
import { Row, Icon } from 'antd'
import { EduIf, FlexContainer } from '@edulastic/common'
import { orange } from '@edulastic/colors'
import { ControlDropDown } from '../../../../common/components/widgets/controlDropDown'
import {
  StyledH3,
  StyledTooltip,
  TableTitleContainer,
} from '../../../../common/styled'
import StudentGroupBtn from '../../common/components/StudentGroupBtn'

const TITLE_TOOLTIP_NOTE =
  'Note: Metrics are based on student enrolment in the displayed school, class, or teacher. Data may include tests taken by these students that were not assigned to the displayed class or teacher.'
const TableFilters = ({
  isDistrictGroupAdmin,
  updateFilterDropdownCB,
  compareByOptions = [],
  selectedCompareBy,
  handleAddToGroupClick,
  showAddToStudentGroupBtn,
  isMultiSchoolYear,
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
        <EduIf condition={isMultiSchoolYear}>
          <StyledTooltip placement="right" title={TITLE_TOOLTIP_NOTE}>
            <Icon type="warning" theme="filled" style={{ color: orange }} />
          </StyledTooltip>
        </EduIf>
      </TableTitleContainer>

      <FlexContainer>
        <EduIf condition={!isDistrictGroupAdmin}>
          <StudentGroupBtn
            showAddToStudentGroupBtn={showAddToStudentGroupBtn}
            handleAddToGroupClick={handleAddToGroupClick}
          />
        </EduIf>
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
