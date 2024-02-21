import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { Col, Input, Row, Tooltip } from 'antd'
import { withRouter } from 'react-router'
import { compose } from 'redux'
import { questionType, testTypes } from '@edulastic/constants'
import { keyBy, get, isEqual } from 'lodash'
import { withNamespaces } from 'react-i18next'
import {
  EduButton,
  EduElse,
  EduIf,
  EduThen,
  FieldLabel,
  Pagination,
  SpinLoader,
} from '@edulastic/common'
import { themeColor } from '@edulastic/colors'
import { IconClose, IconPresentation } from '@edulastic/icons'
import memoizeOne from 'memoize-one'
import {
  getReportsClassResponse,
  getReportsStudentResponse,
  getReportsStudentResponseLoader,
  receiveStudentReportResponseAction,
} from '../../ducks'
import { StyledFooter } from '../../../../../../StudentView/styled'
import { getUserDetails } from '../../../../../../../student/Login/ducks'
import TestAttachementsModal from '../../../../../../StudentView/Modals/TestAttachementsModal'
import {
  saveOverallFeedbackAction,
  updateOverallFeedbackAction,
} from '../../../../../../src/actions/classBoard'
import TestPreviewModal from '../../../../../../Assignments/components/Container/TestPreviewModal'
import VideoQuizWorksheet from '../../../../../../AssessmentPage/VideoQuiz/VideoQuizWorksheet'
import Worksheet from '../../../../../../AssessmentPage/components/Worksheet/Worksheet'
import {
  LCB_LIMIT_QUESTION_PER_VIEW,
  SCROLL_SHOW_LIMIT,
  getPageNumberSelector,
} from '../../../../../../ClassBoard/ducks'
import { PaginationWrapper } from '../../../../../../TestList/components/Container/styled'
import {
  setPageNumberAction,
  setStudentViewFilterAction,
} from '../../../../../../src/reducers/testActivity'
import { transformTestItems } from '../utils/transformers'
import PreviewItem from './PreviewItem'
import {
  ActivityHeaderLeft,
  ActivityHeaderRight,
  ActivityModalContainer,
  ActivityModalHeader,
  ActivityTitle,
  ContainerStyledModal,
  DocStyledModal,
  FeedbackStyledModal,
  StyledThemeButton,
} from '../styled'
import {
  getAiEvaluationStatus,
  getEvaluationStatus,
  getStudentWorkData,
} from '../utils/utils'
import { ActionBtn } from '../../../../../../CurriculumSequence/components/PlaylistTestDetailsModal/styled'
import StudentGraph from './StudentGraph'
import StudentQuestionFilters from './StudentQuestionFilters'

const getTestItems = memoizeOne(transformTestItems, isEqual)

const MemoizedPreview = React.memo(PreviewItem)

const TestActivityModal = ({
  isModalVisible,
  error,
  closeTestPreviewModal,
  resetOnClose,
  unmountOnClose = false,
  skipPlayer = false,
  receiveStudentRespone,
  testActivityId,
  groupId,
  studentId,
  assignmentId,
  studentResponse,
  history,
  userData,
  activityLoading,
  studentName,
  saveOverallFeedback,
  updateOverallFeedback,
  userWork,
  saveUserWork,
  setUpdatedScratchPad,
  pageNumber,
  setPageNumber,
  testId,
  classResponse,
  filter,
  setFilter,
  t: i18Translate,
}) => {
  const {
    testActivity: studentTestActivity,
    questionActivities,
    itemGroups = {},
  } = studentResponse

  const feedbackRef = useRef(null)
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false)
  const [hideCorrectAnswer, setHideCorrectAnswer] = useState(true)
  const [showAttachmentsModal, setShowAttachmentModal] = useState(false)
  const [showTestletPlayer, setShowTestletPlayer] = useState(false)
  const [selectedTestItem, setSelectedTestItem] = useState([])
  const [showDocBasedPlayer, setShowDocBasedPlayer] = useState(false)
  const [isStudentWorkCollapseOpen, setIsStudentWorkCollapseOpen] = useState(
    false
  )

  const toggleStudentWorkCollapse = () => {
    setIsStudentWorkCollapseOpen(!isStudentWorkCollapseOpen)
  }

  const toggleShowCorrectAnswers = () => {
    setHideCorrectAnswer(!hideCorrectAnswer)
  }

  const toggleAttachmentsModal = () => {
    setShowAttachmentModal(!showAttachmentsModal)
  }

  const handleShowFeedbackPopup = (value) => {
    setShowFeedbackPopup(value)
  }

  useEffect(() => {
    if (error) {
      closeTestPreviewModal()
    }
  }, [error])

  useEffect(() => {
    if (skipPlayer && isModalVisible) {
      receiveStudentRespone({
        testActivityId,
        groupId,
        studentId,
        assignmentId,
        testId,
      })
    }
  }, [])

  useEffect(() => {
    if (pageNumber !== 1) {
      setPageNumber(1)
    }
  }, [filter])

  useEffect(() => {
    return () => {
      if (unmountOnClose) {
        if (resetOnClose) {
          resetOnClose()
        }
      }
    }
  }, [])

  if (!studentTestActivity || activityLoading) {
    return (
      <ContainerStyledModal
        visible={isModalVisible}
        onCancel={closeTestPreviewModal}
        onOk={closeTestPreviewModal}
        width="100%"
        height="100vh"
        destroyOnClose
        footer={null}
        header={null}
        wrapClassName="test-preview-modal"
        closable={false}
        maskClosable={false}
        centered
      >
        <SpinLoader />
      </ContainerStyledModal>
    )
  }

  const handleApply = () => {
    const feedback = feedbackRef.current.state.value
    saveOverallFeedback(testActivityId, groupId, {
      text: feedback,
    })
    updateOverallFeedback({ text: feedback })
    setShowFeedbackPopup(false)
  }

  const showStudentWorkButton = testTypes.TEST_TYPES.TESTLET.includes(
    studentTestActivity.testType
  )
  const { attachments = [] } = studentTestActivity?.userWork || {}
  const testItems = getTestItems({
    testItems: Object.values(itemGroups).flatMap((itemGroup) => itemGroup),
    studentName,
    testActivityId,
    questionActivities,
    passages: classResponse.passages,
    variableSetIds: studentTestActivity.algoVariableSetIds,
    filter,
  })

  const evaluationStatus = getEvaluationStatus(questionActivities)
  const aiEvaluationStatus = getAiEvaluationStatus(questionActivities)

  const navigateToLCB = () => {
    closeTestPreviewModal()
    history.push(
      `/author/classboard/${assignmentId}/${groupId}/test-activity/${testActivityId}`
    )
  }

  const checkUserLCBAccess = () => {
    if (userData.role === 'teacher') {
      if (userData.orgData.classList.find((group) => group._id === groupId)) {
        return true
      }
      return false
    }
    if (userData.role === 'school-admin') {
      if (
        userData.orgData.institutionIds?.includes(
          studentTestActivity?.institutionId
        )
      ) {
        return true
      }
      return false
    }
    return true
  }

  const initFeedbackValue =
    (studentTestActivity &&
      studentTestActivity.feedback &&
      studentTestActivity.feedback.text) ||
    ''
  const { videoUrl = '' } = classResponse
  const isVideoQuiz = videoUrl?.length > 0

  const handleShowStudentWork = (testItem) => {
    const testData = getStudentWorkData(testItem)
    setSelectedTestItem(testData)
  }
  const hideStudentWork = () => {
    setSelectedTestItem([])
    if (showTestletPlayer) {
      setShowTestletPlayer(false)
    }
  }
  const saveScratchPadData = (data) => {
    if (data?.questionId) {
      const { questionId, userWorkData } = data
      const userQuestionActivity = (questionActivities || []).find(
        (qa) => qa?.qid === questionId
      )
      // While in EG, userWork in store has uqa id as keys
      const userWorkId = userQuestionActivity?._id
      if (userWorkId) {
        const scratchpadData = {
          [questionId]: userWorkData,
        }
        setUpdatedScratchPad(true)
        saveUserWork({
          [userWorkId]: { ...scratchpadData },
        })
      }
    }
  }

  let docBasedProps = {}
  if (classResponse.isDocBased) {
    const {
      isDocBased,
      docUrl,
      annotations: teacherAnnotations,
      pageStructure,
      freeFormNotes = {},
    } = classResponse
    const utaId = testActivityId
    const studentAnnotations = get(userWork, [utaId, 'freeNotesStd'], [])
    const questionActivitiesById = keyBy(questionActivities, 'qid')

    const questions = (testItems?.[0]?.data?.questions || []).map((q) => ({
      ...q,
      activity: questionActivitiesById[q.id],
    }))
    const questionsById = keyBy(questions, 'id')
    const studentWorkAnswersById = questionActivities.reduce((acc, cur) => {
      acc[cur.qid] = cur.userResponse
      return acc
    }, {})
    docBasedProps = {
      test: classResponse,
      review: true,
      viewMode: 'report',
      isDocBased,
      docUrl,
      annotations: (teacherAnnotations || []).concat(studentAnnotations),
      pageStructure,
      freeFormNotes,
      questionsById,
      questions,
      studentWorkAnswersById,
      testItemId: testItems?.[0]?._id,
      ...(isVideoQuiz ? { videoUrl } : {}),
    }
  }
  const shouldShowPagination =
    !classResponse.isDocBased && testItems.length > SCROLL_SHOW_LIMIT

  const itemsToRender = shouldShowPagination
    ? testItems.slice(
        LCB_LIMIT_QUESTION_PER_VIEW * (pageNumber - 1),
        LCB_LIMIT_QUESTION_PER_VIEW * pageNumber
      )
    : testItems

  let showPaginationForDocQuestions = false
  let filteredWidgets = []
  if (classResponse.isDocBased) {
    const widgets = testItems?.[0]?.rows?.[0]?.widgets || []
    filteredWidgets = widgets.filter(
      (widget) => widget.type !== questionType.SECTION_LABEL
    )
    showPaginationForDocQuestions = filteredWidgets.length > SCROLL_SHOW_LIMIT
  }

  const test = showTestletPlayer
    ? {
        testType: studentTestActivity.testType,
        title: studentTestActivity.title,
        testletConfig: studentTestActivity.testletConfig,
        testletState: get(studentTestActivity, 'userWork.testletState'),
        itemGroups: [{ items: [selectedTestItem] }],
      }
    : {
        itemGroups: [{ items: [selectedTestItem] }],
        passages: classResponse.passages,
      }
  return (
    <ContainerStyledModal
      visible={isModalVisible}
      onCancel={closeTestPreviewModal}
      onOk={closeTestPreviewModal}
      width="100%"
      destroyOnClose
      footer={null}
      header={null}
      wrapClassName="test-preview-modal"
      closable={false}
      maskClosable={false}
      centered
    >
      <ActivityModalContainer>
        <ActivityModalHeader>
          <ActivityHeaderLeft>
            <span data-cy="backToReport" onClick={closeTestPreviewModal}>
              {'< BACK TO REPORT'}
            </span>
          </ActivityHeaderLeft>
          <ActivityHeaderRight>
            <Tooltip
              title={
                checkUserLCBAccess()
                  ? null
                  : i18Translate('common.teacherAssignmentRestricted')
              }
              placement="bottom"
            >
              <div>
                <ActionBtn
                  onClick={navigateToLCB}
                  disabled={!checkUserLCBAccess()}
                >
                  <IconPresentation height="18.3px" width="18.3px" />
                  <span data-cy="goToLCB">Go to Live Class Board</span>
                </ActionBtn>
              </div>
            </Tooltip>
            <ActionBtn onClick={closeTestPreviewModal}>
              <IconClose color={themeColor} width={16} height={16} /> close
            </ActionBtn>
          </ActivityHeaderRight>
        </ActivityModalHeader>
        {showFeedbackPopup && (
          <FeedbackStyledModal
            centered
            maskClosable={false}
            visible={showFeedbackPopup}
            title="Give Overall Feedback"
            onCancel={() => handleShowFeedbackPopup(false)}
            footer={
              <StyledFooter>
                <EduButton
                  data-cy="cancel"
                  key="back"
                  isGhost
                  onClick={() => handleShowFeedbackPopup(false)}
                >
                  Cancel
                </EduButton>
                <EduButton
                  data-cy="submit"
                  key="submit"
                  type="primary"
                  onClick={handleApply}
                >
                  Save
                </EduButton>
              </StyledFooter>
            }
          >
            <FieldLabel>Student Feedback!</FieldLabel>
            <Input.TextArea
              data-cy="feedbackInput"
              rows={6}
              defaultValue={initFeedbackValue}
              ref={feedbackRef}
              maxlength="2048"
              autoFocus
            />
          </FeedbackStyledModal>
        )}
        <ActivityTitle>
          <span>{`${studentName}'s ${classResponse.title}`}</span>
        </ActivityTitle>
        <StudentGraph
          studentTestActivity={studentTestActivity}
          filter={filter}
          studentId={studentId}
          studentResponse={studentResponse}
          questionActivities={questionActivities}
          studentName={studentName}
        />
        <StudentQuestionFilters
          initFeedbackValue={initFeedbackValue}
          questionActivities={questionActivities}
          filter={filter}
          setFilter={setFilter}
          showStudentWorkButton={showStudentWorkButton}
          setShowTestletPlayer={setShowTestletPlayer}
          attachments={attachments}
          toggleAttachmentsModal={toggleAttachmentsModal}
          checkUserLCBAccess={checkUserLCBAccess}
          toggleShowCorrectAnswers={toggleShowCorrectAnswers}
          setShowFeedbackPopup={setShowFeedbackPopup}
          hideCorrectAnswer={hideCorrectAnswer}
          i18Translate={i18Translate}
        />
        {classResponse.isDocBased ? (
          <DocStyledModal
            visible={showDocBasedPlayer}
            onCancel={() => setShowDocBasedPlayer(false)}
            footer={null}
            destroyOnClose={isVideoQuiz}
          >
            <Row className="exit-btn-row">
              <Col>
                <StyledThemeButton onClick={() => setShowDocBasedPlayer(false)}>
                  Exit
                </StyledThemeButton>
              </Col>
            </Row>
            <EduIf condition={isVideoQuiz}>
              <EduThen>
                <VideoQuizWorksheet {...docBasedProps} studentWork />
              </EduThen>
              <EduElse>
                <Worksheet {...docBasedProps} studentWork />
              </EduElse>
            </EduIf>
          </DocStyledModal>
        ) : null}
        {itemsToRender.map((item, index) => {
          let showStudentWork = null
          let scractchPadUsed = userWork[item._id]
          scractchPadUsed = item.data.questions.some(
            (question) => question?.activity?.scratchPad?.scratchpad
          )
          if (scractchPadUsed) {
            showStudentWork = () => handleShowStudentWork(item)
          }
          if (classResponse.isDocBased) {
            showStudentWork = () => setShowDocBasedPlayer(true)
          }
          const questionActivity = questionActivities.find(
            (activity) => activity.testItemId == item._id
          )
          const questions = item.data.questions

          const questionsWithItemId = questions.map((q) => ({
            ...q,
            testItemId: item._id,
            activity: questionActivity,
          }))

          return (
            <MemoizedPreview
              studentId={studentId}
              ttsUserIds={[]}
              studentName={studentName}
              key={index}
              item={{
                ...item,
                data: { ...item.data, questions: questionsWithItemId },
              }}
              passages={classResponse.passages}
              qIndex={index}
              evaluation={evaluationStatus}
              showStudentWork={showStudentWork}
              isQuestionView={false}
              isExpressGrader={false}
              isLCBView
              questionActivity={questionActivity}
              scractchPadUsed={scractchPadUsed}
              isStudentWorkCollapseOpen={isStudentWorkCollapseOpen}
              toggleStudentWorkCollapse={toggleStudentWorkCollapse}
              userWork={userWork} // used to determine show student work button
              hideCorrectAnswer={hideCorrectAnswer}
              isStudentView
              testActivityId={testActivityId}
              currentStudent={{ userName: studentName }}
              isExpandedView={false}
              saveScratchPadData={saveScratchPadData}
              aiEvaluationStatus={aiEvaluationStatus}
              disableAllInputs={!checkUserLCBAccess()}
            />
          )
        })}

        {(shouldShowPagination || showPaginationForDocQuestions) && (
          <PaginationWrapper>
            <Pagination
              defaultCurrent={1}
              current={pageNumber}
              pageSize={LCB_LIMIT_QUESTION_PER_VIEW}
              total={
                showPaginationForDocQuestions
                  ? filteredWidgets.length
                  : testItems.length
              }
              hideOnSinglePage
              onChange={(page) => {
                setTimeout(() => setPageNumber(page), 1)
              }}
            />
          </PaginationWrapper>
        )}
        {showAttachmentsModal && (
          <TestAttachementsModal
            toggleAttachmentsModal={toggleAttachmentsModal}
            showAttachmentsModal={showAttachmentsModal}
            attachmentsList={attachments}
            title="All Attachments"
            utaId={studentTestActivity?._id}
            studentData={{ userName: studentName }}
            attachmentNameLabel="Attachment"
          />
        )}

        <TestPreviewModal
          isModalVisible={showTestletPlayer}
          closeTestPreviewModal={hideStudentWork}
          test={test}
          isShowStudentWork
          isStudentReport
          LCBPreviewModal
          questionActivities={questionActivities}
          testActivityId={testActivityId}
          isQuestionView={false}
          isLCBView
          isStudentView
        />
      </ActivityModalContainer>
    </ContainerStyledModal>
  )
}

const enhanced = compose(
  withNamespaces('reports'),
  withRouter,
  connect(
    (state) => ({
      testType: state.test.testType,
      studentResponse: getReportsStudentResponse(state),
      classResponse: getReportsClassResponse(state),
      activityLoading: getReportsStudentResponseLoader(state),
      userData: getUserDetails(state),
      pageNumber: getPageNumberSelector(state),
      userWork: get(state, ['userWork', 'present'], {}),
      filter: state?.author_classboard_testActivity?.studentViewFilter,
    }),
    {
      receiveStudentRespone: receiveStudentReportResponseAction,
      saveOverallFeedback: saveOverallFeedbackAction,
      updateOverallFeedback: updateOverallFeedbackAction,
      setPageNumber: setPageNumberAction,
      setFilter: setStudentViewFilterAction,
    }
  )
)

export default enhanced(TestActivityModal)
