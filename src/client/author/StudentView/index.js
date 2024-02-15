import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { compose } from 'redux'
import PropTypes from 'prop-types'
import { findIndex, isUndefined, get } from 'lodash'
import { setAutoFreeze } from 'immer'
import memoizeOne from 'memoize-one'
import { Input, Tooltip } from 'antd'
import {
  AnswerContext,
  scrollTo,
  EduButton,
  FieldLabel,
  FlexContainer,
} from '@edulastic/common'
import {
  IconFeedback,
  IconExpand,
  IconCollapse,
  IconFolder,
} from '@edulastic/icons'
import {
  testTypes as testTypesConstants,
  questionActivity as questionActivityConst,
} from '@edulastic/constants'
import { white } from '@edulastic/colors'
import {
  StyledStudentTabButton,
  StudentButtonWrapper,
  StudentButtonDiv,
  ScrollToTopButton,
  StyledModal,
  StyledFooter,
} from './styled'

import ClassQuestions from '../ClassResponses/components/Container/ClassQuestions'

// actions
import {
  receiveStudentResponseAction,
  saveOverallFeedbackAction,
  updateOverallFeedbackAction,
} from '../src/actions/classBoard'
import { setStudentViewFilterAction } from '../src/reducers/testActivity'
// selectors
import {
  getStudentResponseSelector,
  getTestItemsOrderSelector,
  getCurrentTestActivityIdSelector,
  getAdditionalDataSelector,
  getAllStudentsList,
} from '../ClassBoard/ducks'

import { getQuestionLabels } from '../ClassBoard/Transformer'
import HooksContainer from '../ClassBoard/components/HooksContainer/HooksContainer'
import {
  FilterSelect,
  FilterSpan,
} from '../ClassBoard/components/Container/styled'
import TestAttachementsModal from './Modals/TestAttachementsModal'
import StudentResponse from '../QuestionView/component/studentResponses/studentResponse'

const _getquestionLabels = memoizeOne(getQuestionLabels)

setAutoFreeze(false)

class StudentViewContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showFeedbackPopup: false,
      showTestletPlayer: false,
      hasStickyHeader: false,
      hideCorrectAnswer: true,
      showAttachmentsModal: false,
    }
  }

  feedbackRef = React.createRef()

  static getDerivedStateFromProps(nextProps, preState) {
    const {
      selectedStudent,
      loadStudentResponses,
      studentItems,
      currentTestActivityId = '',
      match,
    } = nextProps
    const { classId } = match?.params || {}
    const { selectedStudent: _selectedStudent } = preState || {}

    if (selectedStudent !== _selectedStudent) {
      let index = 0
      if (selectedStudent) {
        index = findIndex(
          studentItems,
          (student) => student.studentId === selectedStudent
        )
      }
      const { testActivityId } = studentItems?.[index] || {}
      if (
        !isUndefined(currentTestActivityId || testActivityId) &&
        !isUndefined(classId)
      ) {
        loadStudentResponses({
          testActivityId: currentTestActivityId || testActivityId,
          groupId: classId,
          studentId: selectedStudent,
        })
      }
    }
    return {
      selectedStudent,
      loading: selectedStudent !== _selectedStudent,
    }
  }

  handleShowFeedbackPopup = (value) => {
    this.setState({ showFeedbackPopup: value })
  }

  handleApply = () => {
    const {
      saveOverallFeedback,
      studentResponse,
      updateOverallFeedback,
    } = this.props
    const { _id: testActivityId, groupId } = studentResponse?.testActivity || {}
    const feedback = this.feedbackRef.current.state.value
    saveOverallFeedback(testActivityId, groupId, {
      text: feedback,
    })
    updateOverallFeedback({ text: feedback })
    this.setState({ showFeedbackPopup: false })
  }

  onClickTab = (filter) => {
    const { setFilter } = this.props
    setFilter(filter)
    scrollTo(document.querySelector('body'))
  }

  toggleShowCorrectAnswers = () => {
    this.setState((prevState) => ({
      hideCorrectAnswer: !prevState.hideCorrectAnswer,
    }))
  }

  toggleAttachmentsModal = () => {
    this.setState((prevState) => ({
      showAttachmentsModal: !prevState.showAttachmentsModal,
    }))
  }

  render() {
    const {
      classResponse,
      studentItems,
      studentResponse,
      selectedStudent,
      isPresentationMode,
      testItemsOrder,
      filter,
      isCliUser,
      match,
      additionalData,
      studentsList,
      MainContentWrapperRef,
    } = this.props

    const {
      loading,
      showFeedbackPopup,
      showTestletPlayer,
      hasStickyHeader,
      hideCorrectAnswer,
      showAttachmentsModal,
    } = this.state
    const userId = studentResponse.testActivity
      ? studentResponse.testActivity.userId
      : ''
    const currentStudent = studentItems.find(({ studentId }) => {
      if (selectedStudent) {
        return studentId === selectedStudent
      }
      return studentId === userId
    })

    const { classId, assignmentId } = match?.params || {}

    const showStudentWorkButton = testTypesConstants.TEST_TYPES.TESTLET.includes(
      classResponse.testType
    )

    // show the total count.
    const questionActivities = studentResponse?.questionActivities || []
    const activeQuestions = questionActivities.filter(
      (x) => !(x.disabled || x.scoringDisabled)
    )

    const questionStatusCounts = activeQuestions.reduce(
      (acc, cur) => {
        if (!cur.isPractice && cur.score === cur.maxScore && cur.score > 0) {
          acc.correctNumber += 1
        }
        if (
          !cur.isPractice &&
          cur.score === 0 &&
          cur.maxScore > 0 &&
          cur.graded &&
          !cur.skipped
        ) {
          acc.wrongNumber += 1
        }
        if (!cur.isPractice && cur.score > 0 && cur.score < cur.maxScore) {
          acc.partiallyCorrectNumber += 1
        }
        if (!cur.isPractice && cur.skipped && cur.score === 0) {
          acc.skippedNumber += 1
        }
        if (!cur.isPractice && !cur.skipped && cur.graded === false) {
          acc.notGradedNumber += 1
        }
        if (cur.isPractice) {
          acc.unscoredItems += 1
        }
        return acc
      },
      {
        totalNumber: activeQuestions.length,
        correctNumber: 0,
        wrongNumber: 0,
        partiallyCorrectNumber: 0,
        skippedNumber: 0,
        notGradedNumber: 0,
        unscoredItems: 0,
      }
    )

    const studentTestActivity = studentResponse && studentResponse.testActivity
    const initFeedbackValue =
      (studentTestActivity &&
        studentTestActivity.feedback &&
        studentTestActivity.feedback.text) ||
      ''
    const feedbackButtonToolTip = (
      <div>
        <p>
          <b>Overall feedback</b>
        </p>
        <p>
          {' '}
          {`${initFeedbackValue.slice(0, 250)}${
            initFeedbackValue.length > 250 ? '.....' : ''
          }`}
        </p>
      </div>
    )

    const { attachments = [] } = studentTestActivity?.userWork || {}

    return (
      <>
        {studentsList.length && studentTestActivity?._id && (
          <HooksContainer
            additionalData={additionalData}
            classId={classId}
            assignmentId={assignmentId}
            testActivityId={studentTestActivity?._id}
            studentsList={studentsList}
            selectedTab="Student"
          />
        )}

        {showFeedbackPopup && (
          <StyledModal
            centered
            maskClosable={false}
            visible={showFeedbackPopup}
            title="Give Overall Feedback"
            onCancel={() => this.handleShowFeedbackPopup(false)}
            footer={
              <StyledFooter>
                <EduButton
                  data-cy="cancel"
                  key="back"
                  isGhost
                  onClick={() => this.handleShowFeedbackPopup(false)}
                >
                  Cancel
                </EduButton>
                <EduButton
                  data-cy="submit"
                  key="submit"
                  type="primary"
                  onClick={this.handleApply}
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
              ref={this.feedbackRef}
              maxlength="2048"
              autoFocus
            />
          </StyledModal>
        )}

        <StudentResponse>
          <StudentButtonWrapper>
            <StudentButtonDiv>
              <FilterSpan>FILTER BY STATUS</FilterSpan>
              <FilterSelect
                data-cy="filterByAttemptType"
                className="student-status-filter"
                value={filter}
                dropdownMenuStyle={{ fontSize: 29 }}
                getPopupContainer={(trigger) => trigger.parentElement}
                onChange={this.onClickTab}
                width="170px"
                height="24px"
              >
                {questionActivityConst.questionStatusOptions.map(
                  ({ title, value, countValue }, i) => (
                    <FilterSelect.Option
                      className="student-status-filter-item"
                      key={i}
                      value={value}
                      style={{ fontSize: 11 }}
                    >
                      {title} ({questionStatusCounts[countValue]})
                    </FilterSelect.Option>
                  )
                )}
              </FilterSelect>
              {showStudentWorkButton && (
                <StyledStudentTabButton
                  onClick={() => this.setState({ showTestletPlayer: true })}
                >
                  SHOW STUDENT WORK
                </StyledStudentTabButton>
              )}
            </StudentButtonDiv>

            <FlexContainer alignItems="center">
              {attachments.length > 0 && (
                <EduButton
                  isGhost
                  data-cy="viewAllAttachmentsButton"
                  height="24px"
                  fontSize="9px"
                  mr="10px"
                  ml="0px"
                  onClick={this.toggleAttachmentsModal}
                  title="View all attachments"
                >
                  <IconFolder height="11.3px" width="11.3px" />
                  <span>Attachments</span>
                </EduButton>
              )}
              <EduButton
                isGhost
                height="24px"
                fontSize="9px"
                mr="10px"
                ml="0px"
                onClick={this.toggleShowCorrectAnswers}
                title="Minimizing view hides correct answers, maximize to view them"
              >
                {hideCorrectAnswer ? (
                  <IconExpand height="11.3px" width="11.3px" />
                ) : (
                  <IconCollapse height="11.3px" width="11.3px" />
                )}
                <span
                  data-cy="showCorrectAnswer"
                  data-test={!hideCorrectAnswer}
                >
                  {hideCorrectAnswer ? 'Maximize view' : 'Minimize view'}
                </span>
              </EduButton>
              {!isCliUser && (
                <Tooltip
                  title={
                    initFeedbackValue.length ? feedbackButtonToolTip : null
                  }
                  placement={hasStickyHeader ? 'bottom' : 'top'}
                >
                  <EduButton
                    data-cy="overallFeedback"
                    onClick={() => this.handleShowFeedbackPopup(true)}
                    height="24px"
                    fontSize="9px"
                    isGhost
                  >
                    <IconFeedback color={white} height="13px" width="14px" />
                    {initFeedbackValue.length ? (
                      <span>
                        {`${initFeedbackValue.slice(0, 30)}
                      ${initFeedbackValue.length > 30 ? '.....' : ''}`}
                      </span>
                    ) : (
                      'GIVE OVERALL FEEDBACK'
                    )}
                  </EduButton>
                </Tooltip>
              )}
            </FlexContainer>
          </StudentButtonWrapper>
        </StudentResponse>
        <div>
          {!loading && (
            <AnswerContext.Provider
              value={{
                isAnswerModifiable: false,
                currentScreen: 'live_class_board',
              }}
            >
              <ClassQuestions
                currentStudent={currentStudent || {}}
                questionActivities={studentResponse.questionActivities || []}
                testActivity={studentResponse.testActivity || {}}
                classResponse={classResponse}
                testItemsOrder={testItemsOrder}
                studentViewFilter={filter}
                labels={_getquestionLabels(classResponse.testItems)}
                isPresentationMode={isPresentationMode}
                showTestletPlayer={showTestletPlayer}
                closeTestletPlayer={() =>
                  this.setState({ showTestletPlayer: false })
                }
                testActivityId={studentResponse?.testActivity?._id}
                hideCorrectAnswer={hideCorrectAnswer}
                isLCBView
                isStudentView
                MainContentWrapperRef={MainContentWrapperRef}
              />
            </AnswerContext.Provider>
          )}
        </div>
        <ScrollToTopButton
          type="primary"
          icon="arrow-up"
          shape="circle"
          hasStickyHeader={hasStickyHeader}
          onClick={() => scrollTo(document.querySelector('body'))}
        />
        {showAttachmentsModal && (
          <TestAttachementsModal
            toggleAttachmentsModal={this.toggleAttachmentsModal}
            showAttachmentsModal={showAttachmentsModal}
            attachmentsList={attachments}
            title="All Attachments"
            utaId={studentTestActivity?._id}
            studentData={currentStudent}
            attachmentNameLabel="Attachment"
          />
        )}
      </>
    )
  }
}

const enhance = compose(
  withRouter,
  connect(
    (state) => ({
      studentResponse: getStudentResponseSelector(state),
      testItemsOrder: getTestItemsOrderSelector(state),
      currentTestActivityId: getCurrentTestActivityIdSelector(state),
      isPresentationMode: get(
        state,
        ['author_classboard_testActivity', 'presentationMode'],
        false
      ),
      testItemIds: get(
        state,
        'author_classboard_testActivity.data.test.testItems',
        []
      ),
      entities: get(state, 'author_classboard_testActivity.entities', []),
      filter: state?.author_classboard_testActivity?.studentViewFilter,
      additionalData: getAdditionalDataSelector(state),
      studentsList: getAllStudentsList(state),
    }),
    {
      loadStudentResponses: receiveStudentResponseAction,
      saveOverallFeedback: saveOverallFeedbackAction,
      updateOverallFeedback: updateOverallFeedbackAction,
      setFilter: setStudentViewFilterAction,
    }
  )
)
export default enhance(StudentViewContainer)

StudentViewContainer.propTypes = {
  classResponse: PropTypes.object.isRequired,
  studentItems: PropTypes.array.isRequired,
  studentResponse: PropTypes.object.isRequired,
  selectedStudent: PropTypes.string,
  isPresentationMode: PropTypes.bool,
  saveOverallFeedback: PropTypes.func.isRequired,
  updateOverallFeedback: PropTypes.func.isRequired,
  testItemsOrder: PropTypes.any.isRequired,
}
StudentViewContainer.defaultProps = {
  selectedStudent: '',
  isPresentationMode: false,
}
