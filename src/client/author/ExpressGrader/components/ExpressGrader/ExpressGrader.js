import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { isEmpty, size, get } from 'lodash'
import memoizeOne from 'memoize-one'
import { Spin } from 'antd'

// components
import {
  withWindowSizes,
  MainContentWrapper,
  WithResources,
  FlexContainer,
  toggleChatDisplay,
} from '@edulastic/common'
import AppConfig from '../../../../../app-config'
import ScoreTable from '../ScoreTable/ScoreTable'
import ScoreCard from '../ScoreCard/ScoreCard'
import QuestionModal from '../QuestionModal/QuestionModal'
import ClassHeader from '../../../Shared/Components/ClassHeader/ClassHeader'
import PresentationToggleSwitch from '../../../Shared/Components/PresentationToggleSwitch'
import FeaturesSwitch from '../../../../features/components/FeaturesSwitch'
import HooksContainer from '../../../ClassBoard/components/HooksContainer/HooksContainer'
import { StyledFlexContainer } from './styled'
import ClassBreadBrumb from '../../../Shared/Components/ClassBreadCrumb'
import ExpressGraderScoreColors from '../ExpressGraderScoreColors'
import ViewModeSwitch from './ViewModeSwitch'
import DownloadCSV from './DownloadCSV'
import GridEditSwitch from './GridEditSwitch'
import RegradeModal from '../../../Regrade/RegradeModal'
// actions
import {
  receiveTestActivitydAction,
  clearFeedbackResponseAction,
} from '../../../src/actions/classBoard'
import { clearAnswersAction } from '../../../src/actions/answers'

// ducks
import {
  getSortedTestActivitySelector,
  getAdditionalDataSelector,
} from '../../../ClassBoard/ducks'
import { toggleScoreModeAction, disableScoreModeAction } from '../../ducks'
import { getFeedbackResponseSelector } from '../../../src/selectors/feedback'
import {
  isFreeAdminSelector,
  isSAWithoutSchoolsSelector,
} from '../../../src/selectors/user'
import {
  isProxyUser as isProxyUserSelector,
  toggleAdminAlertModalAction,
  toggleVerifyEmailModalAction,
  getEmailVerified,
  getVerificationTS,
  isDefaultDASelector,
} from '../../../../student/Login/ducks'
import { getRegradeModalStateSelector } from '../../../TestPage/ducks'

/**
 *
 * @param {Object[]} activities
 */
const testActivitiesTransform = (activities) =>
  activities
    .map((x, index) => ({ ...x, qIndex: index }))
    .filter((x) => !x.disabled)
    .map((x) => ({
      ...x,
      qids: (x.qids || []).map((id, index) => index + (x.qIndex + 1)),
    }))

const transform = (testActivities) =>
  testActivities.map((x) => ({
    ...x,
    questionActivities: testActivitiesTransform(x.questionActivities),
  }))

const transformMemoized = memoizeOne(transform)

export function getDataForTable(data) {
  let dataSource
  if (data && data.length !== 0) {
    dataSource = data
      .filter((std) => std.status === 'submitted')
      .map((student, index) => {
        const students = []
        const rowIndex = index
        const studentInfo = {
          studentId: student.studentId,
          studentName: student.studentName,
          fakeName: student.fakeName,
          icon: student.icon,
          color: student.color,
        }
        const testActivityId = student.testActivityId
          ? student.testActivityId
          : null

        student.questionActivities.forEach((question, index1) => {
          const key = `Q${index1}`
          question.key = key
          students[key] = question
          question.colIndex = index1
          question.id = question._id
          question.rowIndex = rowIndex
          question.studentId = student.studentId
          question.testActivityId = testActivityId
          question.score = Number.isNaN(question.score) ? 0 : question.score
        })

        students.questions = student.questionActivities.length
        students.students = studentInfo
        students.score = {
          score: Number.isNaN(student.score) ? 0 : student.score,
          maxScore: student.maxScore,
        }
        return students
      })
  } else {
    dataSource = []
  }

  return dataSource
}

class ExpressGrader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      record: null,
      isVisibleModal: false,
      isGridEditOn: false,
    }
  }

  componentDidMount() {
    const {
      loadTestActivity,
      match,
      testActivity,
      additionalData,
      authorClassBoard,
      history,
      isFreeAdmin,
      isSAWithoutSchools,
      toggleAdminAlertModal,
      emailVerified,
      verificationTS,
      isDefaultDA,
      toggleVerifyEmailModal,
      userRole,
    } = this.props
    if (isSAWithoutSchools) {
      history.push('/author/tests')
      return toggleAdminAlertModal()
    }
    if (isFreeAdmin) {
      history.push('/author/reports')
      return toggleAdminAlertModal()
    }
    if (!emailVerified && verificationTS && !isDefaultDA) {
      const existingVerificationTS = new Date(verificationTS)
      const expiryDate = new Date(
        existingVerificationTS.setDate(existingVerificationTS.getDate() + 14)
      ).getTime()
      if (expiryDate < Date.now()) {
        history.push(userRole === 'teacher' ? '/' : '/author/items')
        return toggleVerifyEmailModal(true)
      }
    }
    const { assignmentId, classId } = match.params
    let shouldLoadTestActivity = false
    if (!size(testActivity) || isEmpty(additionalData)) {
      shouldLoadTestActivity = true
    } else if (
      authorClassBoard.classId !== classId ||
      authorClassBoard.assignmentId !== assignmentId
    ) {
      shouldLoadTestActivity = true
    }
    if (shouldLoadTestActivity) {
      loadTestActivity(assignmentId, classId)
    }
  }

  componentWillUnmount() {
    const { clearEgAnswers } = this.props
    clearEgAnswers()
  }

  static getDerivedStateFromProps(props) {
    const { changedFeedback, testActivity } = props

    const columnData = getDataForTable(transformMemoized(testActivity))
    const newState = { changedFeedback: !isEmpty(changedFeedback), columnData }
    return newState
  }

  handleCreate = () => {
    const { history, match } = this.props
    history.push(`${match.url}/create`)
  }

  showQuestionModal = (record) => {
    toggleChatDisplay('hide')
    this.setState({
      record,
      isVisibleModal: true,
    })
  }

  updateRecord = (data) => {
    if (!isEmpty(data)) {
      this.setState({ record: data })
    }
  }

  hideQuestionModal = () => {
    toggleChatDisplay('show')
    const { changedFeedback } = this.state
    if (changedFeedback) {
      const {
        clearFeedbackResponse,
        loadTestActivity,
        match: {
          params: { assignmentId, classId },
        },
      } = this.props

      loadTestActivity(assignmentId, classId)
      clearFeedbackResponse()
    }
    this.setState({
      isVisibleModal: false,
      record: null,
    })
  }

  toggleGridEdit = () => {
    this.setState((prevState) => ({
      isGridEditOn: !prevState.isGridEditOn,
    }))
  }

  isMobile = () => window.innerWidth < 768

  render() {
    const {
      testActivity: _testActivity = [],
      additionalData,
      match,
      isPresentationMode,
      windowWidth,
      toggleScoreMode,
      scoreMode,
      authorClassBoard,
      regradeModalState,
      isProxyUser,
    } = this.props
    const { isVisibleModal, record, isGridEditOn, columnData } = this.state
    const { assignmentId, classId, testActivityId } = match.params
    const isMobile = this.isMobile()
    const testActivity = transformMemoized(_testActivity)

    return (
      <FeaturesSwitch
        inputFeatures="expressGrader"
        actionOnInaccessible="hidden"
        groupId={classId}
      >
        <div>
          <HooksContainer assignmentId={assignmentId} classId={classId} isEG />
          <ClassHeader
            classId={classId}
            active="expressgrader"
            assignmentId={assignmentId}
            onCreate={this.handleCreate}
            additionalData={additionalData || {}}
            testActivityId={testActivityId}
            testActivity={testActivity}
          />
          {authorClassBoard.loading ? (
            <Spin style={{ position: 'fixed' }} />
          ) : (
            <MainContentWrapper padding="20px 30px 0px 30px">
              <WithResources
                resources={[
                  `${AppConfig.katexPath}/katex.min.css`,
                  `${AppConfig.katexPath}/katex.min.js`,
                ]}
                fallBack={<span />}
              >
                <StyledFlexContainer justifyContent="space-between">
                  <ClassBreadBrumb />

                  <FlexContainer justifyContent="space-between">
                    <ViewModeSwitch
                      scoreMode={scoreMode}
                      toggleScoreMode={toggleScoreMode}
                    />
                    <GridEditSwitch
                      isGridEditOn={isGridEditOn}
                      toggleGridEdit={this.toggleGridEdit}
                      scoreMode={scoreMode}
                    />
                    <FlexContainer>
                      <PresentationToggleSwitch groupId={classId} />
                      <DownloadCSV />
                    </FlexContainer>
                  </FlexContainer>
                </StyledFlexContainer>
                {!isMobile && (
                  <>
                    <ScoreTable
                      scoreMode={scoreMode}
                      tableData={columnData}
                      isGridEditOn={isGridEditOn}
                      testActivity={testActivity}
                      showQuestionModal={this.showQuestionModal}
                      isPresentationMode={isPresentationMode}
                      windowWidth={windowWidth}
                      groupId={classId}
                      isDemoProxy={isProxyUser}
                    />
                    <ExpressGraderScoreColors />
                  </>
                )}

                {isMobile && (
                  <ScoreCard
                    scoreMode={scoreMode}
                    testActivity={testActivity}
                  />
                )}

                {isVisibleModal && (
                  <QuestionModal
                    record={record}
                    tableData={columnData}
                    isVisibleModal={isVisibleModal}
                    hideQuestionModal={this.hideQuestionModal}
                    isPresentationMode={isPresentationMode}
                    groupId={classId}
                    windowWidth={windowWidth}
                    scoreMode={scoreMode}
                    updateRecord={this.updateRecord}
                  />
                )}
                {!isEmpty(regradeModalState) && <RegradeModal />}
              </WithResources>
            </MainContentWrapper>
          )}
        </div>
      </FeaturesSwitch>
    )
  }
}

const enhance = compose(
  withWindowSizes,
  connect(
    (state) => ({
      testActivity: getSortedTestActivitySelector(state),
      additionalData: getAdditionalDataSelector(state),
      changedFeedback: getFeedbackResponseSelector(state),
      isPresentationMode: get(
        state,
        ['author_classboard_testActivity', 'presentationMode'],
        false
      ),
      authorClassBoard: get(state, ['author_classboard_testActivity'], {}),
      emailVerified: getEmailVerified(state),
      verificationTS: getVerificationTS(state),
      isDefaultDA: isDefaultDASelector(state),
      userRole: get(state.user, 'user.role', null),
      scoreMode: state?.expressGraderReducer?.scoreMode,
      isFreeAdmin: isFreeAdminSelector(state),
      isSAWithoutSchools: isSAWithoutSchoolsSelector(state),
      regradeModalState: getRegradeModalStateSelector(state),
      isProxyUser: isProxyUserSelector(state),
    }),
    {
      loadTestActivity: receiveTestActivitydAction,
      clearFeedbackResponse: clearFeedbackResponseAction,
      clearEgAnswers: clearAnswersAction,
      toggleScoreMode: toggleScoreModeAction,
      disableScoreMode: disableScoreModeAction,
      toggleAdminAlertModal: toggleAdminAlertModalAction,
      toggleVerifyEmailModal: toggleVerifyEmailModalAction,
    }
  )
)

export default enhance(ExpressGrader)

ExpressGrader.propTypes = {
  history: PropTypes.object,
  match: PropTypes.object,
  testActivity: PropTypes.array,
  additionalData: PropTypes.object,
  loadTestActivity: PropTypes.func,
  clearFeedbackResponse: PropTypes.func,
  isPresentationMode: PropTypes.bool,
}

ExpressGrader.defaultProps = {
  history: {},
  match: {},
  testActivity: [],
  additionalData: {},
  loadTestActivity: () => {},
  clearFeedbackResponse: () => {},
  isPresentationMode: false,
}
