import React from 'react'
import { EduIf } from '@edulastic/common'
import { Link } from 'react-router-dom'
import { QLabelSpan, StyledHeadDiv, FlexWrap } from '../styled'
import Tags from '../../../../../../src/components/common/Tags'

const ColumnTitle = ({ question, questionLinkData }) => {
  const { questionLabel, standards = [], points, questionId } = question
  const { assignmentId, groupId, isQuetionLinkEnabled } = questionLinkData
  const { pathname, search } = window.location
  return (
    <>
      <StyledHeadDiv>
        <EduIf condition={!isQuetionLinkEnabled}>
          <QLabelSpan>{questionLabel}</QLabelSpan>
        </EduIf>
        <EduIf condition={isQuetionLinkEnabled}>
          <Link
            to={{
              pathname: `/author/classboard/${assignmentId}/${groupId}/question-activity/${questionId}`,
              state: {
                from: `${pathname}${search}`,
              },
            }}
          >
            {questionLabel}
          </Link>
        </EduIf>
        <FlexWrap>points {points}</FlexWrap>
        <FlexWrap>
          <Tags placement="topRight" tags={standards} show={1} />
        </FlexWrap>
      </StyledHeadDiv>
    </>
  )
}

export default ColumnTitle
