import React, { useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  themeColor,
  mobileWidthMax,
  lightGreySecondary,
  smallDesktopWidth,
  largeDesktopWidth,
} from '@edulastic/colors'
import { Row, Col } from 'antd'
import { testActivityStatus } from '@edulastic/constants'
import { formatDateAndTime } from '../utils'
import { Tooltip } from '../../common/utils/helpers'
import { ReactComponent as FeedbackIcon } from '../assets/writing.svg'
import OverallFeedbackModal from './OverallFeedbackModal'

const { ABSENT, NOT_STARTED } = testActivityStatus
const Attempt = ({
  data = {},
  activityReview,
  releaseScore,
  releaseGradeLabels,
  classId,
  testTitle,
  assignedBy = {},
}) => {
  const [isOverallFeedback, setOverallFeedback] = useState(false)

  const { maxScore = 0, score = 0, feedback, status } = data
  const percentage = (score / maxScore) * 100 || 0
  const btnWrapperSize =
    releaseScore === releaseGradeLabels.DONT_RELEASE
      ? 18
      : releaseScore === releaseGradeLabels.WITH_ANSWERS
      ? 6
      : 12
  const showReviewButton =
    activityReview && status !== ABSENT && status !== NOT_STARTED
  return (
    <>
      <AttemptsData>
        <RowData data-cy="attempt-rows-expanded">
          <AnswerAndScore sm={6} date>
            <span data-cy="date">{formatDateAndTime(data.createdAt)}</span>
          </AnswerAndScore>
          {releaseScore !== releaseGradeLabels.DONT_RELEASE && (
            <>
              {releaseScore === releaseGradeLabels.WITH_ANSWERS && (
                <AnswerAndScore sm={6}>
                  <span data-cy="score">
                    {Math.round(score * 100) / 100}/
                    {Math.round(maxScore * 100) / 100}
                  </span>
                </AnswerAndScore>
              )}
              <AnswerAndScore sm={6}>
                <span data-cy="percentage">{Math.round(percentage)}%</span>
              </AnswerAndScore>
            </>
          )}
          {feedback && releaseScore !== releaseGradeLabels.DONT_RELEASE && (
            <FeedbackWrapper onClick={() => setOverallFeedback(true)}>
              <Tooltip title="Assignment Feedback">
                <FeedbackIcon />
              </Tooltip>
            </FeedbackWrapper>
          )}
          {showReviewButton && (
            <AnswerAndScoreReview sm={btnWrapperSize}>
              <ReviewBtn
                to={`/home/class/${classId}/test/${data.testId}/testActivityReport/${data._id}`}
              >
                <span data-cy="review">REVIEW</span>
              </ReviewBtn>
            </AnswerAndScoreReview>
          )}
        </RowData>
        <OverallFeedbackModal
          isVisible={isOverallFeedback}
          closeCallback={() => setOverallFeedback(false)}
          testTitle={testTitle}
          feedbackText={feedback?.text}
          authorName={assignedBy.name}
          url={assignedBy.url}
        />
      </AttemptsData>
    </>
  )
}

export default Attempt

Attempt.propTypes = {
  data: PropTypes.object.isRequired,
}

const AttemptsData = styled.div`
  margin-top: 7px;
  display: flex;
  justify-content: flex-end;
  user-select: none;
  @media (max-width: ${mobileWidthMax}) {
    margin: 7px 7px 0px 7px;
  }
`

const AnswerAndScore = styled(Col)`
  display: flex;
  align-items: center;
  flex-direction: column;
  span {
    font-size: ${(props) =>
      props.date
        ? props.theme.assignment.cardResponseBoxLabelsFontSize
        : props.theme.assignment.attemptsReviewRowFontSize};
    font-weight: bold;
    color: ${(props) => props.theme.assignment.cardAnswerAndScoreTextColor};
    ${(props) => props.date && 'text-align:center;'}
    @media (max-width: ${smallDesktopWidth}) {
      font-size: ${(props) => props.theme.smallLinkFontSize};
    }
  }
`

const AnswerAndScoreReview = styled(AnswerAndScore)`
  span {
    cursor: pointer;
    font-size: ${(props) => props.theme.assignment.attemptsRowReviewLinkSize};
    @media (max-width: ${smallDesktopWidth}) {
      font-size: ${(props) => props.theme.smallLinkFontSize};
    }
  }
  @media screen and (max-width: ${mobileWidthMax}) {
    width: 33%;
  }
`

const RowData = styled(Row)`
  min-width: 65%;
  display: flex;
  align-items: center;
  border-radius: 4px;
  height: auto;
  background-color: ${lightGreySecondary};
  padding: 3px;
  @media screen and (max-width: ${mobileWidthMax}) {
    height: auto;
    justify-content: space-between;
  }
  @media only screen and (min-width: ${largeDesktopWidth}) {
    flex: 1;
  }
  @media (max-width: ${largeDesktopWidth}) {
    width: 100%;
  }
  div {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    @media screen and (max-width: ${mobileWidthMax}) {
      justify-content: flex-start;
    }
  }
  span {
    font-weight: 600 !important;
    color: #9ca0a9;
  }
  a {
    span {
      color: ${themeColor};
    }
  }
`

const ReviewBtn = styled(Link)`
  width: 180px;
  margin-left: auto;
  text-align: center;
`

const FeedbackWrapper = styled.div`
  cursor: pointer;
`
