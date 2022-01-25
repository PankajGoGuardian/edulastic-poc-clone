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
import { test as testConstants } from '@edulastic/constants'
import { withWindowSizes, notification, CustomPrompt } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import {
  receiveTestByIdAction,
  getTestEntitySelector,
  getTestsLoadingSelector,
  setTestDataAction,
  publishTestAction,
  getDefaultTestSettingsAction,
  getTestsCreatingSelector,
  updateDocBasedTestAction,
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
import Description from '../Description/Description'
import Setting from '../../../TestPage/components/Setting'
import TestPageHeader from '../../../TestPage/components/TestPageHeader/TestPageHeader'
import ShareModal from '../../../src/components/common/ShareModal'
import { validateQuestionsForDocBased } from '../../../../common/utils/helpers'
import { proceedPublishingItemAction } from '../../../ItemDetail/ducks'
import WarningModal from '../../../ItemDetail/components/WarningModal'
import {
  getCollectionsSelector,
  isPremiumUserSelector,
} from '../../../src/selectors/user'
import { hasUserGotAccessToPremiumItem } from '../../../dataUtils'

const { statusConstants, passwordPolicy: passwordPolicyValues } = testConstants

const tabs = {
  DESCRIPTION: 'description',
  WORKSHEET: 'edit',
  REVIEW: 'review',
  SETTINGS: 'settings',
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
  }

  componentDidMount() {
    const {
      match,
      receiveTestById,
      getDefaultTestSettings,
      changeView,
    } = this.props
    receiveTestById(match.params.assessmentId)
    getDefaultTestSettings()
    window.onbeforeunload = () => this.beforeUnload()
    changeView(tabs.DESCRIPTION)
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
      assessment: { title },
      changePreview,
      authorQuestionStatus: newQuestionsAdded,
      updated,
    } = this.props

    if (currentTab === tabs.DESCRIPTION && title && title.trim()) {
      changeView(tab)
      changePreview('clear')
    } else if (currentTab !== tabs.DESCRIPTION) {
      changeView(tab)
      changePreview('clear')
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

  handleSave = async () => {
    const {
      questions: assessmentQuestions,
      assessment,
      updateDocBasedTest,
    } = this.props
    if (!validateQuestionsForDocBased(assessmentQuestions, true)) {
      return
    }
    updateDocBasedTest(assessment._id, assessment, true)
  }

  validateTest = (_test) => {
    const {
      title,
      subjects,
      grades,
      passwordPolicy = passwordPolicyValues.REQUIRED_PASSWORD_POLICY_OFF,
      assignmentPassword = '',
      safeBrowser,
      sebPassword,
    } = _test
    if (!title) {
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
    const { _id } = assessment
    if (!validateQuestionsForDocBased(assessmentQuestions, false)) {
      return
    }
    if (this.validateTest(assessment)) {
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
    } = this.prop
    const { status } = assessment
    if (!validateQuestionsForDocBased(assessmentQuestions, false)) {
      return
    }
    if (this.validateTest(assessment)) {
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

  onShareModalChange = () => {
    const { showShareModal } = this.state
    this.setState({
      showShareModal: !showShareModal,
    })
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
    } = this.props

    const { params = {} } = match
    const { docUrl, annotations, pageStructure, freeFormNotes } = assessment
    const { authors } = assessment
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

    switch (currentTab) {
      case tabs.DESCRIPTION:
        return (
          <Description
            setData={setTestData}
            assessment={assessment}
            owner={owner}
          />
        )
      case tabs.WORKSHEET:
        return <Worksheet key="worksheet" {...props} />
      case tabs.REVIEW:
        return <Worksheet key="review" review {...props} />
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
      t,
    } = this.props
    const { editEnable, showShareModal } = this.state
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
          when={!!updated || !!newQuestionsAdded}
          onUnload
          message={(loc = {}) => {
            const { pathname = '' } = loc
            const allow =
              pathname.startsWith('/author/tests/') ||
              pathname.startsWith('/author/assignments/') ||
              pathname.startsWith('/author/assessments/')

            if (allow) {
              return true
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

        <TestPageHeader
          onChangeNav={this.handleChangeCurrentTab}
          current={currentTab}
          onSave={() => this.handleSave('draft')}
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
    }
  )
)

Container.displayName = 'AssessementPageContainer'

export default enhance(Container)
