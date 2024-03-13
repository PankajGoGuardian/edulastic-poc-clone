import React from 'react'
import { withRouter } from 'react-router'
import { compose } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { isEmpty, get } from 'lodash'
import { white } from '@edulastic/colors'
import {
  IconDescription,
  IconAddItems,
  IconReview,
  IconSettings,
} from '@edulastic/icons'
import { test as testConstants, roleuser } from '@edulastic/constants'
import {
  withWindowSizes,
  notification,
  CustomPrompt,
  SpinLoader,
} from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import { docBasedAssessment } from '@edulastic/constants/const/test'
import {
  receiveTestByIdAction,
  getTestEntitySelector,
  getTestsLoadingSelector,
  setTestDataAction,
  publishTestAction,
  getDefaultTestSettingsAction,
  getTestsCreatingSelector,
  updateDocBasedTestAction,
  fetchTestSettingsListAction,
  setCurrentTestSettingsIdAction,
  removeTestEntityAction,
  isTestTypeWithDefaultTestTitleSelector,
} from '../../../TestPage/ducks'
import {
  getQuestionsArraySelector,
  getQuestionsSelector,
  getAuthorQuestionStatus,
} from '../../../sharedDucks/questions'
import { getItemDetailByIdAction } from '../../../src/actions/itemDetail'
import {
  changeViewAction,
  changePreviewAction,
} from '../../../src/actions/view'
import { getViewSelector } from '../../../src/selectors/view'
import Worksheet from '../Worksheet/Worksheet'
import VideoQuizWorkSheet from '../../VideoQuiz/VideoQuizWorksheet'
import Description from '../Description/Description'
import Setting from '../../../TestPage/components/Setting'
import TestPageHeader from '../../../TestPage/components/TestPageHeader/TestPageHeader'
import ShareModal from '../../../src/components/common/ShareModal'
import { validateQuestionsForDocBased } from '../../../../common/utils/helpers'
import { proceedPublishingItemAction } from '../../../ItemDetail/ducks'
import WarningModal from '../../../ItemDetail/components/WarningModal'
import {
  getUserRole,
  getCollectionsSelector,
  isPremiumUserSelector,
} from '../../../src/selectors/user'
import { hasUserGotAccessToPremiumItem } from '../../../dataUtils'
import { isValidVideoUrl } from '../../VideoQuiz/utils/videoPreviewHelpers'
import { checkInvalidTestTitle } from '../../../utils/tests'
import TestNameChangeModal from '../../../TestPage/components/TestNameChangeModal/TestNameChangeModal'

const { statusConstants, passwordPolicy: passwordPolicyValues } = testConstants

const { tabs } = docBasedAssessment

const TEST_ACTIONS = {
  publish: 'PUBLISH',
  assign: 'ASSIGN',
  share: 'SHARE',
  navigation: 'NAVIGATION',
}

const buttons = [
  {
    icon: <IconDescription color={white} width={16} height={16} />,
    value: tabs.DESCRIPTION,
    text: 'Description',
  },
  {
    icon: <IconAddItems color={white} width={16} height={16} />,
    value: tabs.WORKSHEET,
    text: 'Worksheet',
  },
  {
    icon: <IconReview color={white} width={24} height={24} />,
    value: tabs.REVIEW,
    text: 'Review',
  },
  {
    icon: <IconSettings color={white} width={16} height={16} />,
    value: tabs.SETTINGS,
    text: 'Settings',
  },
]

class Container extends React.Component {
  static propTypes = {
    receiveTestById: PropTypes.func.isRequired,
    receiveItemDetailById: PropTypes.func.isRequired,
    assessment: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    match: PropTypes.object.isRequired,
    questions: PropTypes.array.isRequired,
    questionsById: PropTypes.object.isRequired,
    updateDocBasedTest: PropTypes.func.isRequired,
    changeView: PropTypes.func.isRequired,
    currentTab: PropTypes.string.isRequired,
  }

  sebPasswordRef = React.createRef()

  state = {
    editEnable: false,
    showShareModal: false,
    testNameSaving: false,
    showTestNameChangeModal: false,
    toBeResumedTestAction: null,
    toBeNavigatedLocation: null,
  }

  componentDidMount() {
    const {
      match,
      receiveTestById,
      getDefaultTestSettings,

      userRole,
      isPremiumUser,
      fetchTestSettingsList,
      setCurrentTestSettingsId,
      userId,
    } = this.props

    receiveTestById(match.params.assessmentId)
    if (userRole !== roleuser.STUDENT) {
      setCurrentTestSettingsId('')
      if (isPremiumUser) {
        fetchTestSettingsList({
          orgId: userId,
          orgType: roleuser.ORG_TYPE.USER,
        })
      }
    }
    getDefaultTestSettings()
    window.onbeforeunload = () => this.beforeUnload()
  }

  get isEditableTest() {
    const { assessment, match, userId } = this.props
    const { params = {} } = match
    const { editEnable = true } = this.state
    const { authors, status } = assessment
    const owner =
      (authors && authors.some((x) => x._id === userId)) || !params.id
    return owner && (editEnable || status === statusConstants.DRAFT)
  }

  componentWillUnmount() {
    window.onbeforeunload = () => {}
    const { match, removeTestEntity } = this.props
    if (match?.params?.assessmentId) {
      removeTestEntity()
    }
  }

  beforeUnload = () => {
    const { assessment: test, questionsUpdated, updated } = this.props
    const { itemGroups } = test

    if (
      this.isEditableTest &&
      itemGroups[0].items.length > 0 &&
      (updated || questionsUpdated)
    ) {
      return ''
    }
  }

  componentDidUpdate(prevProps) {
    const { receiveItemDetailById, assessment } = this.props
    if (
      assessment._id &&
      !prevProps.assessment._id &&
      assessment._id !== prevProps.assessment._id
    ) {
      const [testItem] = assessment.itemGroups[0].items
      const testItemId = typeof testItem === 'object' ? testItem._id : testItem
      if (testItemId) {
        receiveItemDetailById(testItemId)
      }
    }
  }

  handleChangeCurrentTab = (tab) => () => {
    const {
      changeView,
      currentTab,
      assessment: { title, videoUrl },
      changePreview,
      authorQuestionStatus: newQuestionsAdded,
      updated,
    } = this.props

    if (
      currentTab === tabs.DESCRIPTION &&
      title &&
      title.trim() &&
      (videoUrl === undefined || isValidVideoUrl(videoUrl))
    ) {
      changeView(tab)
      changePreview('clear')
    } else if (currentTab !== tabs.DESCRIPTION) {
      changeView(tab)
      changePreview('clear')
    } else if (videoUrl === '') {
      return notification({ messageKey: 'pleaseEnterVideoUrl' })
    } else if (!isValidVideoUrl(videoUrl)) {
      return notification({ messageKey: 'linkCantPlayed' })
    } else {
      return notification({ messageKey: 'pleaseEnterName' })
    }

    /**
     * save test data on tab switch if test data or items are updated
     * @see https://snapwiz.atlassian.net/browse/EV-25049
     */
    if (this.isEditableTest && (updated || newQuestionsAdded)) {
      this.handleSave()
    }
  }

  handleSave = async (nextLocation, nextAction) => {
    const {
      questions: assessmentQuestions,
      assessment,
      updateDocBasedTest,
    } = this.props

    const { videoUrl } = assessment
    if (!validateQuestionsForDocBased(assessmentQuestions, true, !!videoUrl)) {
      return
    }
    updateDocBasedTest(
      assessment._id,
      { ...assessment, nextLocation, nextAction },
      true
    )
  }

  validateTest = (_test, toBeResumedTestAction) => {
    const {
      title,
      subjects,
      grades,
      passwordPolicy = passwordPolicyValues.REQUIRED_PASSWORD_POLICY_OFF,
      assignmentPassword = '',
      safeBrowser,
      sebPassword,
    } = _test

    const { isTestTypeWithDefaultTestTitle } = this.props

    if (isTestTypeWithDefaultTestTitle && checkInvalidTestTitle(title)) {
      this.setState({
        showTestNameChangeModal: true,
        toBeResumedTestAction,
      })
      return false
    }
    this.setState({
      showTestNameChangeModal: false,
      toBeResumedTestAction: null,
    })
    if (!isTestTypeWithDefaultTestTitle && !title) {
      notification({ messageKey: 'nameShouldNotEmpty' })
      return false
    }
    if (isEmpty(grades)) {
      notification({ messageKey: 'gradeFieldEmpty' })
      return false
    }
    if (isEmpty(subjects)) {
      notification({ messageKey: 'subjectFieldEmpty' })
      return false
    }
    if (
      passwordPolicy === passwordPolicyValues.REQUIRED_PASSWORD_POLICY_STATIC
    ) {
      if (assignmentPassword.length < 6 || assignmentPassword.length > 25) {
        notification({ messageKey: 'enterValidPassword' })
        return false
      }
    }
    if (safeBrowser && !sebPassword) {
      if (this.sebPasswordRef.current && this.sebPasswordRef.current.input) {
        this.sebPasswordRef.current.input.focus()
      }
      notification({ messageKey: 'enterValidPassword' })
      return false
    }

    return true
  }

  handlePublishTest = (assignFlow = false) => {
    const {
      questions: assessmentQuestions,
      publishTest,
      assessment,
      match,
    } = this.props
    const { _id, videoUrl } = assessment
    if (!validateQuestionsForDocBased(assessmentQuestions, false, !!videoUrl)) {
      return
    }
    if (this.validateTest(assessment, TEST_ACTIONS.publish)) {
      publishTest({
        _id,
        oldId: match.params.oldId,
        test: assessment,
        assignFlow,
      })
      this.setState({ editEnable: false })
    }
  }

  handleAssign = () => {
    const {
      questions: assessmentQuestions,
      assessment,
      history,
      match,
      updated,
    } = this.props
    const { status, videoUrl } = assessment
    if (!validateQuestionsForDocBased(assessmentQuestions, false, !!videoUrl)) {
      return
    }
    if (this.validateTest(assessment, TEST_ACTIONS.assign)) {
      if (status !== statusConstants.PUBLISHED || updated) {
        this.handlePublishTest(true)
      } else {
        const { assessmentId } = match.params
        if (assessmentId) {
          history.push({
            pathname: `/author/assignments/${assessmentId}`,
            state: {
              assessmentAssignedFrom: 'Created New',
            },
          })
        }
      }
    }
  }

  saveTestNameSuccess = () => {
    const { showShareModal } = this.state
    this.setState({
      testNameSaving: false,
      showShareModal: !showShareModal,
      showTestNameChangeModal: false,
      toBeResumedTestAction: null,
    })
  }

  onShareModalChange = (titleUpdated) => {
    const { showShareModal } = this.state
    const { isTestTypeWithDefaultTestTitle, assessment = {} } = this.props
    if (
      isTestTypeWithDefaultTestTitle &&
      checkInvalidTestTitle(assessment.title)
    ) {
      this.setState({
        showTestNameChangeModal: true,
        toBeResumedTestAction: TEST_ACTIONS.share,
      })
      return
    }
    if (titleUpdated === true) {
      this.setState({ testNameSaving: true })
      this.handleSave(null, this.saveTestNameSuccess)
    } else {
      this.setState({
        showShareModal: !showShareModal,
      })
    }
  }

  onEnableEdit = () => {
    this.setState({ editEnable: true })
  }

  renderContent() {
    const {
      currentTab,
      assessment,
      questions,
      match,
      questionsById,
      userId,
      setTestData,
      loading,
      creating,
    } = this.props

    const { params = {} } = match
    const { docUrl, annotations, pageStructure, freeFormNotes } = assessment
    const { authors, videoUrl = '' } = assessment
    const owner =
      (authors && authors.some((x) => x._id === userId)) || !params.id

    const props = {
      docUrl,
      viewMode: currentTab,
      annotations,
      questions,
      questionsById,
      pageStructure,
      freeFormNotes,
      isEditable: this.isEditableTest,
    }

    const isVideoQuiz = videoUrl?.length > 0

    switch (currentTab) {
      case tabs.DESCRIPTION:
        return (
          <Description
            setData={setTestData}
            assessment={assessment}
            owner={owner}
          />
        )
      case tabs.WORKSHEET: {
        if ((creating || loading) && !assessment?._id)
          return <SpinLoader position="fixed" height="100%" />
        if (isVideoQuiz) {
          return <VideoQuizWorkSheet key="worksheet" {...props} />
        }
        return <Worksheet key="worksheet" {...props} />
      }

      case tabs.REVIEW: {
        if ((creating || loading) && !assessment?._id)
          return <SpinLoader position="fixed" height="100%" />
        if (isVideoQuiz) {
          return <VideoQuizWorkSheet key="review" review {...props} />
        }
        return <Worksheet key="review" review {...props} />
      }

      case tabs.SETTINGS:
        return (
          <Setting
            current={currentTab}
            isEditable={this.isEditableTest}
            // onShowSource={this.handleNavChange("source")}
            sebPasswordRef={this.sebPasswordRef}
            owner={owner}
          />
        )
      default:
        return null
    }
  }

  handleResumeActivity = () => {
    const { toBeResumedTestAction, toBeNavigatedLocation } = this.state
    switch (toBeResumedTestAction) {
      case TEST_ACTIONS.publish:
        this.handlePublishTest()
        break
      case TEST_ACTIONS.assign:
        this.handleAssign()
        break
      case TEST_ACTIONS.navigation:
        this.handleSave(toBeNavigatedLocation)
        break
      case TEST_ACTIONS.share:
        this.onShareModalChange(true)
        break
      default:
        break
    }
  }

  render() {
    const {
      assessment: {
        _id: testId,
        authors,
        grades,
        subjects,
        itemGroups,
        title,
        status,
        isUsed,
        derivedFromPremiumBankId = false,
      },
      userId,
      windowWidth,
      updated,
      authorQuestionStatus: newQuestionsAdded,
      creating,
      showWarningModal,
      proceedPublish,
      currentTab,
      collections,
      isTestTypeWithDefaultTestTitle,
      t,
    } = this.props

    const {
      editEnable,
      showShareModal,
      testNameSaving,
      showTestNameChangeModal,
      toBeResumedTestAction,
    } = this.state
    const owner = (authors && authors.some((x) => x._id === userId)) || !testId
    const showPublishButton =
      (status && status !== statusConstants.PUBLISHED && testId && owner) ||
      editEnable
    const hasTestId = !!testId
    const showEditButton =
      authors &&
      authors.some((x) => x._id === userId) &&
      status &&
      status === statusConstants.PUBLISHED &&
      !editEnable

    const hasPremiumQuestion = !!itemGroups?.[0].items?.find((i) =>
      hasUserGotAccessToPremiumItem(i.collections, collections)
    )

    const gradeSubject = { grades, subjects }

    return (
      <>
        <CustomPrompt
          when={
            !!updated ||
            !!newQuestionsAdded ||
            (isTestTypeWithDefaultTestTitle &&
              testId &&
              checkInvalidTestTitle(title))
          }
          onUnload
          message={(loc = {}) => {
            const { pathname = '', state } = loc
            const allow =
              pathname.startsWith('/author/tests/') ||
              pathname.startsWith('/author/assignments/') ||
              pathname.startsWith('/author/assessments/')

            if (allow || !!state?.skipTestNameChangeModal) {
              return true
            }

            if (
              isTestTypeWithDefaultTestTitle &&
              testId &&
              checkInvalidTestTitle(title)
            ) {
              this.setState({
                showTestNameChangeModal: true,
                toBeResumedTestAction: TEST_ACTIONS.navigation,
                toBeNavigatedLocation: pathname,
              })
              return false
            }

            return t('component.common.modal.exitPageWarning')
          }}
        />
        {showShareModal && (
          <ShareModal
            shareLabel="TEST URL"
            isVisible={showShareModal}
            testId={testId}
            hasPremiumQuestion={hasPremiumQuestion}
            isPublished={status === statusConstants.PUBLISHED}
            onClose={this.onShareModalChange}
            gradeSubject={gradeSubject}
          />
        )}
        <WarningModal
          visible={showWarningModal}
          proceedPublish={proceedPublish}
        />

        {showTestNameChangeModal && (
          <TestNameChangeModal
            visible={showTestNameChangeModal}
            showSaveTitle={toBeResumedTestAction === TEST_ACTIONS.navigation}
            closeModal={() => {
              this.setState({
                showTestNameChangeModal: false,
                toBeResumedTestAction: null,
              })
            }}
            testNameSaving={testNameSaving || creating}
            handleResponse={this.handleResumeActivity}
          />
        )}

        <TestPageHeader
          onChangeNav={this.handleChangeCurrentTab}
          current={currentTab}
          onSave={() => this.handleSave()}
          onShare={this.onShareModalChange}
          onPublish={this.handlePublishTest}
          title={title}
          buttons={buttons}
          creating={creating}
          showEditButton={showEditButton}
          owner={owner}
          isUsed={isUsed}
          windowWidth={windowWidth}
          showPublishButton={showPublishButton}
          testStatus={status}
          hasTestId={hasTestId}
          editEnable={editEnable}
          onEnableEdit={this.onEnableEdit}
          // onShowSource={this.handleNavChange("source")}
          onAssign={this.handleAssign}
          updated={updated}
          validateTest={this.validateTest}
          derivedFromPremiumBankId={derivedFromPremiumBankId}
          isEditable={isTestTypeWithDefaultTestTitle}
        />
        {this.renderContent()}
      </>
    )
  }
}

const enhance = compose(
  withRouter,
  withWindowSizes,
  withNamespaces('author'),
  connect(
    (state) => ({
      userRole: getUserRole(state),
      assessment: getTestEntitySelector(state),
      userId: get(state, 'user.user._id', ''),
      updated: get(state, 'tests.updated', false),
      showWarningModal: get(state, ['itemDetail', 'showWarningModal'], false),
      questionsUpdated: get(state, 'authorQuestions.updated', false),
      loading: getTestsLoadingSelector(state),
      questions: getQuestionsArraySelector(state),
      creating: getTestsCreatingSelector(state),
      questionsById: getQuestionsSelector(state),
      currentTab: getViewSelector(state),
      collections: getCollectionsSelector(state),
      authorQuestionStatus: getAuthorQuestionStatus(state),
      isPremiumUser: isPremiumUserSelector(state),
      isTestTypeWithDefaultTestTitle: isTestTypeWithDefaultTestTitleSelector(
        state
      ),
    }),
    {
      receiveTestById: receiveTestByIdAction,
      proceedPublish: proceedPublishingItemAction,
      setTestData: setTestDataAction,
      receiveItemDetailById: getItemDetailByIdAction,
      getDefaultTestSettings: getDefaultTestSettingsAction,
      updateDocBasedTest: updateDocBasedTestAction,
      changeView: changeViewAction,
      changePreview: changePreviewAction,
      publishTest: publishTestAction,
      fetchTestSettingsList: fetchTestSettingsListAction,
      setCurrentTestSettingsId: setCurrentTestSettingsIdAction,
      removeTestEntity: removeTestEntityAction,
    }
  )
)

Container.displayName = 'AssessementPageContainer'

export default enhance(Container)
