import React, { useState, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { isEqual } from 'lodash'
import { Divider } from 'antd'
import styled from 'styled-components'
import { yellow, greenDark3, red } from '@edulastic/colors'
import { IconCorrect, IconWrong, IconCarets } from '@edulastic/icons'
import { assignmentPolicyOptions } from '@edulastic/constants'
import { redirectPolicySelector } from '../selectors/test'

const {
  STUDENT_RESPONSE_AND_FEEDBACK,
  SCORE_RESPONSE_AND_FEEDBACK,
} = assignmentPolicyOptions.showPreviousAttemptOptions
const TeacherResponseContainer = ({
  correct,
  answerIcon,
  prevScore,
  prevMaxScore,
  prevFeedback,
}) => (
  <TeacherResponse data-cy="teacherResponse">
    <FlexBox>
      <div>
        {correct !== undefined && (
          <>
            <span>
              {answerIcon} {' Prior Attempt'}
            </span>
          </>
        )}
      </div>
    </FlexBox>
    {(prevScore || prevScore === 0) && (
      <FlexBox column>
        <ScoreWrapper data-cy="score">{prevScore}</ScoreWrapper>
        <ScoreDevider />
        <ScoreWrapper data-cy="maxscore">{prevMaxScore}</ScoreWrapper>
      </FlexBox>
    )}
    {!!prevFeedback?.text && (
      <div data-cy="feedBack">{`${prevFeedback.teacherName}: ${prevFeedback.text}`}</div>
    )}
  </TeacherResponse>
)
const FeedBackContainer = ({
  correct,
  prevScore,
  prevMaxScore,
  prevFeedback,
  userAnswers,
  redirectPolicy,
  previousUserResponse,
  qId,
}) => {
  const [feedbackView, setFeedbackView] = useState(false)
  const toggleFeedbackView = () => {
    setFeedbackView(!feedbackView)
  }
  useEffect(() => {
    if (redirectPolicy === STUDENT_RESPONSE_AND_FEEDBACK) {
      setFeedbackView(true)
    } else {
      setFeedbackView(false)
    }
  }, [qId])

  const iconHeight = feedbackView ? 12 : 40
  const iconHeight2 = feedbackView ? 10 : 30
  const { answer, answerIcon } =
    correct === true
      ? prevScore === prevMaxScore
        ? {
            answer: 'Prior Attempt',
            answerIcon: (
              <IconCorrect
                data-cy="correct"
                height={iconHeight}
                width={iconHeight}
                color={greenDark3}
              />
            ),
          }
        : {
            answer: 'Prior Attempt',
            answerIcon: (
              <IconCorrect
                data-cy="partialCorrect"
                height={iconHeight}
                width={iconHeight}
                color={yellow}
              />
            ),
          }
      : {
          answer: 'Prior Attempt',
          answerIcon: (
            <IconWrong
              data-cy="wrong"
              height={iconHeight2}
              width={iconHeight2}
              color={red}
            />
          ),
        }
  const isResponseVisible =
    redirectPolicy === STUDENT_RESPONSE_AND_FEEDBACK ||
    redirectPolicy === SCORE_RESPONSE_AND_FEEDBACK
  const props = {
    correct,
    answerIcon,
    answer,
    prevScore,
    prevMaxScore,
    prevFeedback,
  }
  const currentUserAnswer = userAnswers?.[qId]

  /**
   * TODO: Fixes the current issue [EV-20491], Need to fix for other question types
   * eg: Expression multipart (math input, adds index undefined in current response),
   * Graph adds unique id to every response
   */
  const differenceInResponse = useMemo(() => {
    if (currentUserAnswer === undefined) return false
    return !isEqual(previousUserResponse || '', currentUserAnswer || '')
  }, [previousUserResponse, currentUserAnswer])

  if (differenceInResponse) {
    return null
  }

  if (
    !prevFeedback?.text &&
    correct === undefined &&
    !(prevScore || prevScore === 0)
  ) {
    return null
  }

  if (!isResponseVisible) {
    return (
      <Wrapper visible>
        <TeacherResponseContainer {...props} />
      </Wrapper>
    )
  }
  const showNavArrow = redirectPolicy === SCORE_RESPONSE_AND_FEEDBACK
  return (
    <Wrapper visible>
      {!feedbackView && correct !== undefined && (
        <div style={{ width: '100px' }}>
          <IconWrapper data-cy="answerIcon">{answerIcon}</IconWrapper>
          <div data-cy="answerType" style={{ textAlign: 'center' }}>
            Prior Attempt
          </div>
        </div>
      )}
      {feedbackView && <TeacherResponseContainer {...props} />}
      {showNavArrow && (
        <div
          style={{ textAlign: 'center', cursor: 'pointer' }}
          onClick={toggleFeedbackView}
        >
          <IconCarets.IconCaretRight />
        </div>
      )}
    </Wrapper>
  )
}

FeedBackContainer.propTypes = {
  correct: PropTypes.bool.isRequired,
  prevScore: PropTypes.number.isRequired,
  prevMaxScore: PropTypes.number.isRequired,
}

FeedBackContainer.defaultProps = {}

export default connect(
  (state) => ({
    redirectPolicy: redirectPolicySelector(state),
    userAnswers: state.answers,
  }),
  null
)(FeedBackContainer)

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
`
const Wrapper = styled.div`
  display: ${({ visible }) => (visible ? 'flex' : 'none')};
  flex-direction: column;
  box-shadow: 0 3px 10px 2px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  padding: 20px 15px;
  background-color: white;
`

const TeacherResponse = styled.div`
  width: 120px;
`
const FlexBox = styled.div`
  display: flex;
  justify-content: space-between;
  ${(props) => props.column && 'flex-direction:column;'}
`

const ScoreWrapper = styled.div`
  text-align: center;
  font-size: 20px;
`
const ScoreDevider = styled(Divider)`
  height: 3px;
  width: 50%;
  background-color: black;
  margin: 3px auto;
`
