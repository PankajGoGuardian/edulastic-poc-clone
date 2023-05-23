import React from 'react'
import { Row, Typography } from 'antd'
import { darkGrey } from '@edulastic/colors'
import { ControlDropDown } from '../../../common/components/widgets/controlDropDown'
import { StyledRow } from '../../multipleAssessmentReport/PreVsPost/common/styledComponents'
import { DashedLine } from '../../../common/styled'
import { compareByToPluralName } from './utils/constants'
import { isAddToStudentGroupEnabled } from '../common/utils'
import StudentGroupBtn from '../common/components/StudentGroupBtn'

const TableFilters = ({
  setCompareBy,
  compareByOptions = [],
  compareBy,
  handleAddToGroup,
  isSharedReport = false,
}) => {
  const showAddToStudentGroupBtn = isAddToStudentGroupEnabled(
    isSharedReport,
    compareBy
  )
  return (
    <StyledRow type="flex" justify="space-between" margin="20px">
      <Typography.Title style={{ margin: 0, fontSize: '18px' }} level={4}>
        Performance By {compareByToPluralName[compareBy]}
      </Typography.Title>
      <DashedLine margin="15px 24px" dashColor={darkGrey} />
      <Row type="flex">
        <StudentGroupBtn
          showAddToStudentGroupBtn={showAddToStudentGroupBtn}
          handleAddToGroupClick={handleAddToGroup}
        />
        <ControlDropDown
          style={{ marginRight: '10px' }}
          prefix="Compare By"
          by={compareBy}
          selectCB={(e, selected) => setCompareBy(selected.key)}
          data={compareByOptions}
        />
      </Row>
    </StyledRow>
  )
}

export default TableFilters
