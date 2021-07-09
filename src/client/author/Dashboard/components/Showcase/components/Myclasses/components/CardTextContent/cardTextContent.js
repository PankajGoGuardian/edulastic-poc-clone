import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Row, Col, Tooltip, Popover } from 'antd'
import { IconPlusCircle } from '@edulastic/icons'
import { themeColorLight, cardTitleColor } from '@edulastic/colors'
import { FlexContainer } from '@edulastic/common'
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
  StyledPopoverContainer,
} from './styled'
import { TextWrapper } from '../../../../../styledComponents'
import infoLogo from './info.png'

export const CardTextContent = ({ data, history, userId }) => {
  const {
    totalAssignment,
    asgnStatus,
    asgnTitle,
    asgnId,
    _id,
    asgnThumbnail,
    notOpenAssignments = 0,
    inProgressAssignments = 0,
    inGradingAssignments = 0,
    doneAssignments = 0,
  } = data

  const gotoAssignedAssessment = () => {
    if (asgnId) history.push(`/author/classboard/${asgnId}/${_id}`)
  }

  const applyClassFilter = (_filter = {}) => {
    const filter = {
      classId: _id,
      testType: '',
      termId: '',
      ..._filter,
    }
    sessionStorage.setItem(
      `assignments_filter_${userId}`,
      JSON.stringify(filter)
    )
  }

  const content = (
    <>
      <Link
        to="/author/assignments"
        onClick={() => applyClassFilter({ status: 'NOT OPEN' })}
      >
        <span>NOT OPEN</span>
        <span>{notOpenAssignments}</span>
      </Link>
      <Link
        to="/author/assignments"
        onClick={() => applyClassFilter({ status: 'IN PROGRESS' })}
      >
        <span>IN PROGRESS</span>
        <span>{inProgressAssignments}</span>
      </Link>
      <Link
        to="/author/assignments"
        onClick={() => applyClassFilter({ status: 'IN GRADING' })}
      >
        <span>IN GRADING</span>
        <span>{inGradingAssignments}</span>
      </Link>
      <Link
        to="/author/assignments"
        onClick={() => applyClassFilter({ status: 'DONE' })}
      >
        <span>DONE</span>
        <span>{doneAssignments}</span>
      </Link>
    </>
  )

  return (
    <CardText>
      <RowWrapper>
        <LeftCol width="auto">
          <Link to="/author/assignments" onClick={applyClassFilter}>
            <IconWrapper>
              <OverlayText data-cy="totalAssignment">
                {totalAssignment || 0}
              </OverlayText>
            </IconWrapper>
          </Link>
        </LeftCol>

        <CenterCol>
          <Link to="/author/assignments" onClick={applyClassFilter}>
            <AssignmentCount>
              {totalAssignment > 1 ? 'Assignments' : 'Assignment'}
            </AssignmentCount>
          </Link>
        </CenterCol>

        <RightCol>
          {!totalAssignment || totalAssignment === 0 ? (
            <Tooltip title="Create New Assignment" placement="topLeft">
              <Link to="/author/assignments/select">
                <IconPlusCircle
                  color={themeColorLight}
                  width={25}
                  height={25}
                />
              </Link>
            </Tooltip>
          ) : (
            <StyledPopoverContainer>
              <Popover
                content={content}
                title="Assignment Counts"
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
              >
                <img src={infoLogo} alt="Info" height="22px" width="22px" />
              </Popover>
            </StyledPopoverContainer>
          )}
        </RightCol>
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
              <Image src={asgnThumbnail} />
            </LeftCol>
            <CenterCol>
              <Tooltip title={asgnTitle} placement="topLeft">
                <AssignmentTitle data-cy="assignmentTitle">
                  {asgnTitle}
                </AssignmentTitle>
              </Tooltip>
              <AssignmentStatusText data-cy="assignmentStatus">
                {asgnStatus}
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

export default withRouter(CardTextContent)
