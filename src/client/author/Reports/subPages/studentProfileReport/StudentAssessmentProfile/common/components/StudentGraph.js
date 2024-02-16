import React from 'react'
import { isEmpty, round } from 'lodash'
import BarGraph from './BarGraph'
import {
  InfoWrapper,
  ScoreWrapper,
} from '../../../../../../ClassBoard/components/Container/styled'
import { getSubmittedDate } from '../../../../../../ClassBoard/utils'
import {
  GraphWrapper,
  ScoreHeader,
  ScoreTextContainer,
  Seperator,
  StudentGrapContainer,
  StudentNameContainer,
  StyledCard,
  TotalScoreContainer,
  TotalScoreWrapper,
} from '../styled'

const StudentGraph = ({
  studentTestActivity,
  studentResponse,
  studentId,
  filter,
  studentName,
  questionActivities,
}) => {
  const timeSpent = Math.floor(
    ((questionActivities &&
      questionActivities.reduce((acc, qa) => {
        acc += qa.timeSpent || 0
        return acc
      }, 0)) ||
      0) / 1000
  )
  let score = studentTestActivity?.score || 0
  let maxScore = studentTestActivity?.maxScore || 0
  const status = studentTestActivity?.status || 0
  if (
    studentResponse &&
    !isEmpty(studentResponse.questionActivities) &&
    status === 0
  ) {
    studentResponse.questionActivities.forEach((uqa) => {
      score += uqa.score
      maxScore += uqa.maxScore
    })
  }
  return (
    <StudentGrapContainer>
      <StyledCard bordered padding={15}>
        <GraphWrapper>
          <BarGraph
            testActivity={{ ...studentTestActivity, questionActivities }}
            studentId={studentId}
            studentview
            studentViewFilter={filter}
            studentResponse={studentResponse}
            isLoading={!studentTestActivity}
          />
          <InfoWrapper>
            <StudentNameContainer>{studentName}</StudentNameContainer>
            <TotalScoreWrapper>
              <TotalScoreContainer>
                <ScoreHeader>TOTAL SCORE</ScoreHeader>
                <ScoreWrapper data-cy="totalScore">
                  {round(score, 2) || 0}
                </ScoreWrapper>
                <Seperator />
                <ScoreWrapper data-cy="totalMaxScore">
                  {round(maxScore, 2) || 0}
                </ScoreWrapper>
              </TotalScoreContainer>
            </TotalScoreWrapper>
            <ScoreHeader data-cy="totlatTimeSpent" fontSize={12}>
              {' '}
              {`TIME (min) : `}{' '}
              <ScoreTextContainer>
                {`${Math.floor(timeSpent / 60)}:${timeSpent % 60}` || ''}
              </ScoreTextContainer>
            </ScoreHeader>
            <ScoreHeader data-cy="studentStatus" fontSize={12}>
              {' '}
              {`STATUS : `}{' '}
              <ScoreTextContainer>
                {studentTestActivity?.status === 2
                  ? 'Absent'
                  : studentTestActivity?.status === 1
                  ? studentTestActivity?.graded === 'GRADED'
                    ? 'Graded'
                    : 'Submitted'
                  : 'In Progress' || ''}
              </ScoreTextContainer>
            </ScoreHeader>
            <ScoreHeader data-cy="submittedDate" fontSize={12}>
              SUBMITTED ON :
              <ScoreTextContainer>
                {getSubmittedDate(
                  studentTestActivity?.endDate
                  // additionalData.endDate
                )}
              </ScoreTextContainer>
            </ScoreHeader>
          </InfoWrapper>
        </GraphWrapper>
      </StyledCard>
    </StudentGrapContainer>
  )
}

export default StudentGraph
