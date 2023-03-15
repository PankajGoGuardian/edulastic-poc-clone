import { EduIf } from '@edulastic/common'
import { roleuser } from '@edulastic/constants'
import { Col, Row } from 'antd'
import React, { useMemo } from 'react'
import { ControlDropDown } from '../../../../common/components/widgets/controlDropDown'
import { StyledH3 } from '../../../../common/styled'
import {
  compareByDropDownData,
  dropDownKeyToLabel,
  sortByOptions,
} from '../constants'
import { StyledCol, StyledDiv, StyledSwitch, StyledSpan } from './styled'

const TableTitleAndFilter = ({
  userRole,
  compareBy,
  assessmentName,
  sortKey,
  handleSort,
  updateCompareByCB,
}) => {
  const selectedCompareByOption = useMemo(
    () =>
      compareByDropDownData.find(({ key }) => key === compareBy) ||
      compareByDropDownData[0],
    [compareBy]
  )
  return (
    <Col className="top-row-container">
      <Row
        type="flex"
        justify="space-between"
        className="top-row"
        align="middle"
      >
        <Col>
          <StyledH3>
            Detailed Performance Analysis{' '}
            {userRole !== roleuser.TEACHER
              ? `By ${dropDownKeyToLabel[compareBy]}`
              : ''}{' '}
            | {assessmentName}
          </StyledH3>
        </Col>
        <StyledCol>
          <StyledDiv fontWeight="600" marginRight="10px" opacity="0.65">
            Sort By (asc.):
          </StyledDiv>
          <StyledDiv>
            <StyledSpan>Performance</StyledSpan>
            <StyledSwitch
              checked={sortKey === sortByOptions.Q_LABEL}
              onChange={handleSort}
            />
            <StyledSpan>Question</StyledSpan>
          </StyledDiv>
          <Col data-cy="compareBy" data-testid="compareBy">
            <EduIf condition={userRole !== roleuser.TEACHER}>
              <ControlDropDown
                prefix="Compare by"
                by={selectedCompareByOption}
                selectCB={updateCompareByCB}
                data={compareByDropDownData}
              />
            </EduIf>
          </Col>
        </StyledCol>
      </Row>
    </Col>
  )
}

export default TableTitleAndFilter
