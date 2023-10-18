import React from 'react'
import { withRouter } from 'react-router-dom'
import { Row, Col, Tooltip } from 'antd'
import { cardTitleColor } from '@edulastic/colors'
import { FlexContainer } from '@edulastic/common'
import { compose } from 'redux'
import { connect } from 'react-redux'
import {
  CardText,
  Image,
  RowWrapper1,
  LeftCol,
  CenterCol,
  AssignmentStatusText,
  AssignmentTitle,
  Label,
} from './styled'
import { TextWrapper } from '../../../../../styledComponents'
import { getUserOrgId } from '../../../../../../../src/selectors/user'
import { assignmentStatus } from '../../../../../../../Assignments/utils'

export const CardTextContent = ({ data, history }) => {
  const {
    asgnStatus,
    asgnTitle,
    asgnId,
    _id,
    asgnThumbnail,
    isPaused,
    asgnStartDate,
  } = data

  const gotoAssignedAssessment = () => {
    if (asgnId) history.push(`/author/classboard/${asgnId}/${_id}`)
  }

  return (
    <CardText>
      <RowWrapper1 onClick={() => gotoAssignedAssessment()}>
        <Label>RECENT</Label>
        {asgnTitle ? (
          <FlexContainer
            justifyContent="flex-start"
            alignItems="flex-start"
            width="99%"
          >
            <LeftCol width="auto">
              <Image src={asgnThumbnail} />
            </LeftCol>
            <CenterCol>
              <Tooltip title={asgnTitle} placement="topLeft">
                <AssignmentTitle data-cy="assignmentTitle">
                  {asgnTitle}
                </AssignmentTitle>
              </Tooltip>
              <AssignmentStatusText data-cy="assignmentStatus">
                {assignmentStatus(asgnStatus, isPaused, asgnStartDate)}
              </AssignmentStatusText>
            </CenterCol>
          </FlexContainer>
        ) : (
          <Col span={16} style={{ cursor: 'default' }}>
            <Row>
              <TextWrapper
                data-cy="assignmentTitle"
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
