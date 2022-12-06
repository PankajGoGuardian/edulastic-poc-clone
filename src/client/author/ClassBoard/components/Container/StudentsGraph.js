import { black } from '@edulastic/colors'
import { BackTop } from '@edulastic/common'
import { IconInfo } from '@edulastic/icons'
import { round, isEmpty } from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { Select } from 'antd'
import StudentSelect from '../../../Shared/Components/StudentSelect/StudentSelect'
import StudentContainer from '../../../StudentView'
import BarGraph from '../BarGraph/BarGraph'
import { getSubmittedDate } from '../../utils'
import {
  StudentGrapContainer,
  InfoWrapper,
  GraphWrapper,
  ScoreChangeWrapper,
  ScoreHeader,
  ScoreWrapper,
  StyledCard,
} from './styled'

import { receiveStudentResponseAction } from '../../../src/actions/classBoard'

const StudentsGraph = (props) => {
  const {
    gradebook,
    testActivity,
    classResponse,
    selectedStudentId,
    qActivityByStudent,
    studentsPrevSubmittedUtas,
    match,
    history,
    isPresentationMode,
    isCliUser,
    studentViewFilter,
    additionalData,
    studentResponse,
    isLoading,
    allTestActivitiesForStudent,
    currentTestActivityId,
    testActivityId,
    loadStudentResponses,
    setCurrentTestActivityId,
    timeSpent,
    handleChange,
    MainContentWrapperRef,
    toggleBackTopIcon,
    showScoreImporvement,
  } = props
  const studentTestActivity =
    (studentResponse && studentResponse.testActivity) || {}
  const { assignmentId, classId } = match.params
  const { status } = studentTestActivity
  let { score = 0, maxScore = 0 } = studentTestActivity
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
    <>
      <StudentGrapContainer>
        <StyledCard bordered={false} paddingTop={15}>
          <StudentSelect
            dataCy="dropDownSelect"
            style={{ width: '200px' }}
            students={testActivity}
            selectedStudent={selectedStudentId}
            studentResponse={qActivityByStudent}
            handleChange={handleChange}
            isPresentationMode={isPresentationMode}
            isCliUser={isCliUser}
            studentsPrevSubmittedUtas={studentsPrevSubmittedUtas}
          />
          <GraphWrapper style={{ width: '100%', display: 'flex' }}>
            <BarGraph
              gradebook={gradebook}
              testActivity={testActivity}
              studentId={selectedStudentId}
              studentview
              studentViewFilter={studentViewFilter}
              studentResponse={studentResponse}
              isLoading={isLoading}
            />
            <InfoWrapper>
              {allTestActivitiesForStudent.length > 1 && (
                <Select
                  data-cy="attemptSelect"
                  style={{ width: '200px' }}
                  value={
                    allTestActivitiesForStudent.some(
                      ({ _id }) =>
                        _id === (currentTestActivityId || testActivityId)
                    )
                      ? currentTestActivityId || testActivityId
                      : ''
                  }
                  onChange={(_testActivityId) => {
                    loadStudentResponses({
                      testActivityId: _testActivityId,
                      groupId: classId,
                      studentId: selectedStudentId,
                    })
                    setCurrentTestActivityId(_testActivityId)
                    history.push(
                      `/author/classboard/${assignmentId}/${classId}/test-activity/${_testActivityId}`
                    )
                  }}
                >
                  {[...allTestActivitiesForStudent]
                    .reverse()
                    .map((_testActivity, index) => (
                      <Select.Option
                        key={index}
                        value={_testActivity._id}
                        disabled={_testActivity.status === 2}
                      >
                        {`Attempt ${
                          allTestActivitiesForStudent.length - index
                        } ${_testActivity.status === 2 ? ' (Absent)' : ''}`}
                      </Select.Option>
                    ))}
                </Select>
              )}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '10px',
                    alignItems: 'center',
                  }}
                >
                  <ScoreHeader>TOTAL SCORE</ScoreHeader>
                  <ScoreWrapper data-cy="totalScore">
                    {round(score, 2) || 0}
                  </ScoreWrapper>
                  <div
                    style={{
                      border: 'solid 1px black',
                      width: '50px',
                    }}
                  />
                  <ScoreWrapper data-cy="totalMaxScore">
                    {round(maxScore, 2) || 0}
                  </ScoreWrapper>
                </div>
                {allTestActivitiesForStudent.length > 1 &&
                showScoreImporvement ? (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      padding: '10px',
                      alignItems: 'center',
                    }}
                  >
                    <ScoreHeader>SCORE</ScoreHeader>
                    <ScoreChangeWrapper
                      data-cy="scoreChange"
                      scoreChange={studentTestActivity.scoreChange}
                    >
                      {`${studentTestActivity.scoreChange > 0 ? '+' : ''}${
                        round(studentTestActivity.scoreChange, 2) || 0
                      }`}
                    </ScoreChangeWrapper>
                    <ScoreHeader style={{ fontSize: '10px', display: 'flex' }}>
                      <span>Improvement </span>
                      <span
                        style={{ marginLeft: '2px' }}
                        title="Score increase from previous student attempt. Select an attempt from the dropdown above to view prior student responses"
                      >
                        <IconInfo />
                      </span>
                    </ScoreHeader>
                  </div>
                ) : null}
              </div>
              <ScoreHeader
                data-cy="totlatTimeSpent"
                style={{ fontSize: '12px' }}
              >
                {' '}
                {`TIME (min) : `}{' '}
                <span
                  style={{
                    color: black,
                    textTransform: 'capitalize',
                  }}
                >
                  {`${Math.floor(timeSpent / 60)}:${timeSpent % 60}` || ''}
                </span>
              </ScoreHeader>
              <ScoreHeader data-cy="studentStatus" style={{ fontSize: '12px' }}>
                {' '}
                {`STATUS : `}{' '}
                <span
                  style={{
                    color: black,
                    textTransform: 'capitalize',
                  }}
                >
                  {studentTestActivity.status === 2
                    ? 'Absent'
                    : studentTestActivity.status === 1
                    ? studentTestActivity.graded === 'GRADED'
                      ? 'Graded'
                      : 'Submitted'
                    : 'In Progress' || ''}
                </span>
              </ScoreHeader>
              <ScoreHeader data-cy="submittedDate" style={{ fontSize: '12px' }}>
                SUBMITTED ON :
                <span style={{ color: black }}>
                  {getSubmittedDate(
                    studentTestActivity.endDate,
                    additionalData.endDate
                  )}
                </span>
              </ScoreHeader>
            </InfoWrapper>
          </GraphWrapper>
        </StyledCard>
      </StudentGrapContainer>
      <StudentContainer
        classResponse={classResponse}
        studentItems={testActivity}
        selectedStudent={selectedStudentId}
        isPresentationMode={isPresentationMode}
        isCliUser={isCliUser}
        MainContentWrapperRef={MainContentWrapperRef}
      />
      {toggleBackTopIcon && <BackTop toggleBackTopIcon={toggleBackTopIcon} />}
    </>
  )
}
export default connect(
  (state) => ({
    studentViewFilter: state?.author_classboard_testActivity?.studentViewFilter,
  }),
  {
    loadStudentResponses: receiveStudentResponseAction,
  }
)(StudentsGraph)
