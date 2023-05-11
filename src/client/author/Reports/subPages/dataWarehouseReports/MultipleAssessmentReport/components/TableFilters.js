import React from 'react'
import PropTypes from 'prop-types'
import { Row } from 'antd'
import { FlexContainer } from '@edulastic/common'
import { ControlDropDown } from '../../../../common/components/widgets/controlDropDown'
import { StyledH3 } from '../../../../common/styled'
import { isAddToStudentGroupEnabled } from '../../common/utils'
import StudentGroupBtn from '../../common/components/StudentGroupBtn'

const TableFilters = ({
  updateFilterDropdownCB,
  compareByOptions = [],
  selectedCompareBy,
  isSharedReport,
}) => {
  const showAddToStudentGroupBtn = isAddToStudentGroupEnabled(
    isSharedReport,
    selectedCompareBy?.key
  )
  return (
    <Row
      type="flex"
      justify="space-between"
      align="middle"
      style={{ marginTop: 45 }}
    >
      <StyledH3>
        Performance Deep-dive across Assessments by{' '}
        {selectedCompareBy?.title || '-'}
      </StyledH3>
      <FlexContainer>
        <StudentGroupBtn
          showAddToStudentGroupBtn={showAddToStudentGroupBtn}
          handleAddToGroupClick={() => {}}
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
