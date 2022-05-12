import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Row, Col, Tooltip } from 'antd'
import { IconPlusCircle } from '@edulastic/icons'
import { themeColorLight, cardTitleColor } from '@edulastic/colors'
import { FlexContainer } from '@edulastic/common'
import { compose } from 'redux'
import { connect } from 'react-redux'
import {
  CardText,
  Image,
  IconWrapper,
  OverlayText,
  RowWrapper,
  RowWrapper1,
  LeftCol,
  CenterCol,
  RightCol,
  AssignmentStatusText,
  AssignmentTitle,
  AssignmentCount,
  Label,
} from './styled'
import { TextWrapper } from '../../../../../styledComponents'
import { getUserOrgId } from '../../../../../../../src/selectors/user'
import { setFilterInSession } from '../../../../../../../../common/utils/helpers'

export const CardTextContent = ({ data, history, userId, districtId }) => {
  const {
    totalAssignment,
    asgnStatus,
    asgnTitle,
    asgnId,
    _id,
    asgnThumbnail,
  } = data

  const gotoAssignedAssessment = () => {
    if (asgnId) history.push(`/author/classboard/${asgnId}/${_id}`)
  }

  const applyClassFilter = () => {
    const filter = {
      classId: _id,
      testType: '',
      termId: '',
    }
    setFilterInSession({
      key: 'assignments_filter',
      userId,
      districtId,
      filter,
    })
  }

  return (
    <CardText>
      <RowWrapper>
        <LeftCol width="auto">
          <Link to="/author/assignments" onClick={applyClassFilter}>
            <IconWrapper>
              <OverlayText
                data-cy="totalAssignment"
                data-testid="totalAssignment"
              >
                {totalAssignment || 0}
              </OverlayText>
            </IconWrapper>
          </Link>
        </LeftCol>

        <CenterCol>
          <Link to="/author/assignments" onClick={applyClassFilter}>
            <AssignmentCount data-testid="assignmentsText">
              {totalAssignment > 1 ? 'Assignments' : 'Assignment'}
            </AssignmentCount>
          </Link>
        </CenterCol>

        {(!totalAssignment || totalAssignment === 0) && (
          <RightCol>
            <Tooltip title="Create New Assignment" placement="topLeft">
              <Link to="/author/assignments/select">
                <IconPlusCircle
                  color={themeColorLight}
                  width={25}
                  height={25}
                />
              </Link>
            </Tooltip>
          </RightCol>
        )}
      </RowWrapper>
      <RowWrapper1 onClick={() => gotoAssignedAssessment()}>
        <Label>RECENT</Label>
        {asgnTitle ? (
          <FlexContainer
            justifyContent="flex-start"
            alignItems="flex-start"
            width="100%"
          >
            <LeftCol width="auto">
              <Image data-testid="asgnThumbnail" src={asgnThumbnail} />
            </LeftCol>
            <CenterCol>
              <Tooltip title={asgnTitle} placement="topLeft">
                <AssignmentTitle
                  data-cy="assignmentTitle"
                  data-testid="assignmentTitle"
                >
                  {asgnTitle}
                </AssignmentTitle>
              </Tooltip>
              <AssignmentStatusText
                data-testid="assignmentStatus"
                data-cy="assignmentStatus"
              >
                {asgnStatus}
              </AssignmentStatusText>
            </CenterCol>
          </FlexContainer>
        ) : (
          <Col span={16} style={{ cursor: 'default' }}>
            <Row>
              <TextWrapper
                data-cy="assignmentTitle"
                data-testid="assignmentTitle"
                color={cardTitleColor}
                rfs="12px"
                size="12px"
                mb="22px"
              >
                No Recent Assignments
              </TextWrapper>
            </Row>
          </Col>
        )}
      </RowWrapper1>
    </CardText>
  )
}

const enhance = compose(
  withRouter,
  connect((state) => ({
    districtId: getUserOrgId(state),
  }))
)
export default enhance(CardTextContent)
