import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Tooltip } from 'antd'
import { get, round } from 'lodash'
import { FlexContainer } from '@edulastic/common'
import { IconCheck } from '@edulastic/icons'
import { white, textBlackColor } from '@edulastic/colors'
import { releaseGradeLabels } from '@edulastic/constants/const/test'
import { getClasses } from '../../Login/ducks'

const OverallFeedback = ({ testActivity, classList = [], testType }) => {
  const { feedback, groupId, score, maxScore } = testActivity
  const overallFeedbackText = get(feedback, 'text', 'No feedback provided')
  const classOwner = classList.find(({ _id }) => _id === groupId)?.owners?.[0]

  const getUserName = (type) => {
    let userInitials = ''
    const { firstName = '', lastName = '' } = classOwner
    if (type === 'initials') {
      if (firstName) {
        userInitials += firstName[0].toLocaleUpperCase()
      }
      if (lastName) {
        userInitials += lastName[0].toLocaleUpperCase()
      }
    } else {
      if (firstName) {
        userInitials += firstName
      }

      if (lastName) {
        userInitials += ' '
        userInitials += lastName
      }
    }
    return userInitials
  }

  if (testActivity.releaseScore === releaseGradeLabels.DONT_RELEASE) {
    return (
      <FeedbackWrapper>
        <NotifyRelease>
          Your responses are being reviewed by your teacher. Grades and feedback
          will be released shortly.
        </NotifyRelease>
      </FeedbackWrapper>
    )
  }

  return (
    <FeedbackWrapper>
      <FeedbackText>Score &amp; Teacher Feedback</FeedbackText>
      <FlexContainer
        justifyContent="flex-start"
        padding="0px"
        alignItems="flex-start"
      >
        <FeedbackContainer>
          <IconCheckWrapper>
            <IconCheck />
          </IconCheckWrapper>
          {testType !== 'survey' && (
            <ScoreWrapper>
              <Score data-cy="score">{round(score, 2)}</Score>
              <Total data-cy="maxscore">{round(maxScore, 2)}</Total>
            </ScoreWrapper>
          )}

          <Feedback>
            <FeedbackGiven data-cy="feedback">
              {overallFeedbackText}
            </FeedbackGiven>
          </Feedback>
        </FeedbackContainer>
        {classOwner && (
          <Tooltip placement="top" title={getUserName('fullName')}>
            {classOwner.thumbnail ? (
              <UserImg src={classOwner.thumbnail} />
            ) : (
              <UserInitials>{getUserName('initials')}</UserInitials>
            )}
          </Tooltip>
        )}
      </FlexContainer>
    </FeedbackWrapper>
  )
}

export default connect(
  (state) => ({
    classList: getClasses(state),
    testActivity: get(state, `[studentReport][testActivity]`, {}),
  }),
  null
)(OverallFeedback)

const FeedbackWrapper = styled.div`
  margin-top: 20px;
  padding: 0px 20px;
  width: 100%;
  border-radius: 0.5rem;
`

const FeedbackText = styled.div`
  color: #434b5d;
  font-weight: 700;
  font-size: 16px;
  padding-bottom: 1.5rem;
  padding-left: 11px;
  border-bottom: 0.05rem solid #f2f2f2;
`

const FeedbackContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 14px;
  background: #f8f8f8;
  margin-right: 8px;
  padding: 26px 21px;
  position: relative;
  width: 100%;

  &::after {
    content: '';
    top: 32px;
    right: -24px;
    position: absolute;
    border-style: solid;
    border-top-color: transparent;
    border-right-color: transparent;
    border-bottom-color: transparent;
    border-left-color: #f8f8f8;
    border-top-width: 24px;
    border-right-width: 12px;
    border-left-width: 12px;
    border-bottom-width: 24px;
  }
`

const IconCheckWrapper = styled.div`
  width: 22px;
  height: 22px;
  background: #00ad50;
  border-radius: 50%;
  position: absolute;
  top: 5px;
  left: 5px;
  display: flex;
  justify-content: center;
  align-items: center;

  & svg {
    fill: ${white};
  }
`

const ScoreWrapper = styled.div`
  max-width: 80px;
  min-width: 65px;
  padding: 0px 12px;
`

const Feedback = styled.div`
  flex: 1;
`

const FeedbackGiven = styled.div`
  max-height: 400px;
  overflow-y: auto;
  line-height: 2.5;
  padding: 0px 0px 0px 16px;
  color: ${textBlackColor};
  font-size: 16px;
`

const Total = styled.div`
  font-weight: 600;
  font-size: 30px;
  text-align: center;
  color: #434b5d;
`

const Score = styled(Total)`
  border-bottom: 0.2rem solid #434b5d;
`

const UserImg = styled.div`
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  background: url(${(props) => props.src});
  background-position: center center;
  background-size: cover;
  border-radius: 50%;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.07);
  margin-top: 50px;
  margin-left: 16px;
`

const UserInitials = styled(UserImg)`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: 700;
  background: #dddddd;
`

const NotifyRelease = styled.p`
  font-size: 22px;
  text-align: center;
  padding: 100px;
  display: block;
  margin: auto;
  width: 80%;
`
