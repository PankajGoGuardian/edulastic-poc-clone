import {
  MainContentWrapper,
  EduButton,
  FlexContainer,
  notification,
  useRealtimeV2,
} from '@edulastic/common'
import { IconReport } from '@edulastic/icons'
import { Spin } from 'antd'
import { get } from 'lodash'
import PropTypes from 'prop-types'
import { test as testConstants, testActivityStatus } from '@edulastic/constants'
import styled from 'styled-components'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { clearUserWorkAction } from '../../../assessment/actions/userWork'
import {
  getQuestionsArraySelector,
  getQuestionsSelector,
} from '../../../author/sharedDucks/questions'
import { getTestEntitySelector } from '../../../author/TestPage/ducks'
// components
import TestAcivityHeader from '../../sharedComponents/Header'

import {
  getCurrentItemSelector,
  setCurrentItemAction,
  getItemsSelector,
  getFeedbackTransformedSelector,
} from '../../sharedDucks/TestItem'
import MainContainer from '../../styled/mainContainer'
// actions
import { loadTestActivityReportAction } from '../ducks'
import ReportListContent from './Container'
import TestActivitySubHeader from './SubHeader'
import ProgressGraph from '../../../common/components/ProgressGraph'
import OverallFeedback from './OverallFeedback'
import { FilesViewContainer } from '../../../author/StudentView/styled'
import FilesView from '../../../assessment/widgets/UploadFile/components/FilesView'
import TestAttachementsModal from '../../../author/StudentView/Modals/TestAttachementsModal'
import { getUser } from '../../../author/src/selectors/user'

const { ABSENT, NOT_STARTED } = testActivityStatus
const { releaseGradeLabels } = testConstants
const continueBtns = [
  releaseGradeLabels.WITH_ANSWERS,
  releaseGradeLabels.WITH_RESPONSE,
]
const greyBars = [
  releaseGradeLabels.DONT_RELEASE,
  releaseGradeLabels.SCORE_ONLY,
]

const ReportListContainer = ({
  flag,
  match,
  test,
  loadTestActivityReport,
  setCurrentItem,
  currentItem,
  testTitle,
  testFeedback,
  clearUserWork,
  history,
  isCliUser,
  testItems,
  attempts,
  testActivity,
  questionActivities,
  userId,
  studentData,
}) => {
  const [assignmentItemTitle, setAssignmentItemTitle] = useState(null)
  const [showGraph, setShowGraph] = useState(true)
  const { isDocBased, testType } = test
  // const { isDocBased } = test
  // const testType = 'survey'

  const { releaseScore, userWork, _id: testActivityId } = testActivity
  const [showAttachmentsModal, taggleAttachmentModal] = useState(false)
  const [attachmentIndexForPreview, setAttachmentIndex] = useState(null)

  const attachments = userWork?.attachments

  const topics = [`student_assignment:class:${match.params.classId}`]
  useRealtimeV2(topics, {
    'toggle-pause-assignment': (payload) => {
      const { activitiesByUserId, paused } = payload
      const utaId = activitiesByUserId[userId]
      if (match.params.id === utaId && paused) {
        notification({
          type: 'warn',
          messageKey: 'studentAssignmentPaused',
        })
        return history.push(`/home/grades`)
      }
    },
  })
  const setCurrentItemFromGraph = (qIndex) => {
    if (continueBtns.includes(releaseScore)) {
      setCurrentItem(qIndex)
      setShowGraph(false)
    }
  }

  const reviewResponses = () => {
    setCurrentItem(0)
    setShowGraph(false)
  }

  const showSummaryView = () => {
    setCurrentItem(0)
    setShowGraph(true)
  }

  const handleExit = () => {
    history.push('/home/grades')
  }

  useEffect(() => {
    loadTestActivityReport({
      testId: match.params.testId,
      testActivityId: match.params.id,
      groupId: match.params.classId,
    })
    setCurrentItem(0)
    return () => {
      clearUserWork()
    }
  }, [match])

  useEffect(() => {
    if (!testFeedback) {
      return
    }

    if (!showGraph) {
      setAssignmentItemTitle(
        <AssignmentItemTitleView onClick={showSummaryView}>
          {testTitle}
        </AssignmentItemTitleView>
      )
    } else {
      setAssignmentItemTitle(testTitle)
    }
  }, [testFeedback, showGraph])

  const handleToggleAttachmentsModal = (index) => {
    taggleAttachmentModal((prevValue) => !prevValue)
    setAttachmentIndex(index)
  }

  if (!testFeedback) {
    return <Spin />
  }

  const showReviewResponses = continueBtns.includes(releaseScore) && showGraph

  const dontRelease = releaseScore === releaseGradeLabels.DONT_RELEASE

  return (
    <MainContainer flag={flag}>
      <TestAcivityHeader
        isDocBased={isDocBased}
        titleIcon={IconReport}
        titleText={test?.title || ''}
        onExit={handleExit}
        showExit={!isCliUser}
        showReviewResponses={showReviewResponses}
        reviewResponses={reviewResponses}
        hideSideMenu={isCliUser}
        attempts={attempts}
      />
      <MainContentWrapper padding={isDocBased ? '0px' : '20px 30px'}>
        <TestActivitySubHeader
          title={assignmentItemTitle}
          questionLabel={showGraph ? null : `Q${currentItem + 1}`}
          isDocBased={isDocBased}
          isCliUser={isCliUser}
          hideQuestionSelect={showGraph}
        />
        {showGraph && (
          <>
            {testType !== 'survey' && (
              <ProgressGraph
                onClickBar={setCurrentItemFromGraph}
                testActivity={testActivity}
                questionActivities={questionActivities}
                testItems={testItems}
                isGreyBar={greyBars.includes(releaseScore)}
                dontRelease={dontRelease}
                isCliUser={isCliUser}
              />
            )}
            {!isCliUser && <OverallFeedback testType={testType} />}
          </>
        )}
        {attachments && (
          <FilesViewContainer style={{ margin: '22px' }}>
            <AttachmentsTitle>Attachements</AttachmentsTitle>
            <FilesView
              files={attachments}
              openAttachmentViewModal={handleToggleAttachmentsModal}
              disableLink
              hideDelete
            />
          </FilesViewContainer>
        )}
        {showReviewResponses && !dontRelease && !isCliUser && (
          <FlexContainer mt="16px">
            <EduButton onClick={reviewResponses} isBlue isGhost>
              Review Responses
            </EduButton>
          </FlexContainer>
        )}
        {!showGraph && (
          <ReportListContent
            title={assignmentItemTitle}
            reportId={match.params.id}
          />
        )}
        {showAttachmentsModal && (
          <TestAttachementsModal
            toggleAttachmentsModal={handleToggleAttachmentsModal}
            showAttachmentsModal={showAttachmentsModal}
            attachmentsList={attachments}
            title="All Attachments"
            utaId={testActivityId}
            studentData={studentData}
            attachmentIndexForPreview={attachmentIndexForPreview || 0}
          />
        )}
      </MainContentWrapper>
    </MainContainer>
  )
}

const enhance = compose(
  withRouter,
  connect(
    (state) => ({
      flag: state.ui.flag,
      test: getTestEntitySelector(state),
      currentItem: getCurrentItemSelector(state),
      testFeedback: get(state, 'testFeedback', null),
      questions: getQuestionsArraySelector(state),
      questionsById: getQuestionsSelector(state),
      testTitle: get(state, ['tests', 'entity', 'title'], ''),
      isCliUser: get(state, 'user.isCliUser', false),
      testItems: getItemsSelector(state),
      questionActivities: getFeedbackTransformedSelector(state),
      testActivity: get(state, `[studentReport][testActivity]`, {}),
      attempts: get(state, `testActivities`, []).filter(
        ({ status }) => status !== ABSENT && status !== NOT_STARTED
      ),
      userId: get(state, 'user.user._id'),
      studentData: getUser(state),
    }),
    {
      setCurrentItem: setCurrentItemAction,
      loadTestActivityReport: loadTestActivityReportAction,
      clearUserWork: clearUserWorkAction,
    }
  )
)

export default enhance(ReportListContainer)

ReportListContainer.propTypes = {
  flag: PropTypes.bool.isRequired,
  testFeedback: PropTypes.array.isRequired,
  clearUserWork: PropTypes.func.isRequired,
}

const AssignmentItemTitleView = styled.span`
  cursor: pointer;
`
const AttachmentsTitle = styled.p`
  font-size: 16px;
  font-weight: 700;
  margin-left: 10px;
  margin-bottom: 17px;
`
