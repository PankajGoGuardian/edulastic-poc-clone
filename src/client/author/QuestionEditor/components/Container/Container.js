import { get, debounce } from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { withNamespaces } from '@edulastic/localization'
import {
  withWindowSizes,
  EduButton,
  getFormattedAttrId,
  ItemLevelContext as HideScoringBlackContext,
  CustomPrompt,
  LanguageContext,
} from '@edulastic/common'
import styled from 'styled-components'
import { IconClose } from '@edulastic/icons'
import { desktopWidth } from '@edulastic/colors'
import { questionType as constantsQuestionType } from '@edulastic/constants'
import SourceModal from '../SourceModal/SourceModal'
import {
  changeViewAction,
  changePreviewAction,
} from '../../../src/actions/view'
import {
  getViewSelector,
  getPreviewSelector,
} from '../../../src/selectors/view'
import {
  ButtonBar,
  SecondHeadBar,
  ButtonAction,
} from '../../../src/components/common'
import QuestionWrapper from '../../../../assessment/components/QuestionWrapper'
import QuestionMetadata from '../../../../assessment/containers/QuestionMetadata'
import QuestionAuditTrailLogs from '../../../../assessment/containers/QuestionAuditTrailLogs'
import { ButtonClose } from '../../../ItemDetail/components/Container/styled'

import ItemHeader from '../ItemHeader/ItemHeader'
import {
  saveQuestionAction,
  setQuestionDataAction,
  getCalculatingSelector,
  getQuestionDataSelector,
} from '../../ducks'
import {
  getItemIdSelector,
  getItemSelector,
  proceedPublishingItemAction,
  savePassageAction,
  saveAndPublishItemAction,
} from '../../../ItemDetail/ducks'
import { changeUpdatedFlagAction } from '../../../sharedDucks/questions'
import {
  checkAnswerAction,
  showAnswerAction,
  toggleCreateItemModalAction,
} from '../../../src/actions/testItem'
import { saveScrollTop } from '../../../src/actions/pickUpQuestion'
import { removeUserAnswerAction } from '../../../../assessment/actions/answers'
import { BackLink, QuestionContentWrapper } from './styled'
import WarningModal from '../../../ItemDetail/components/WarningModal'
import { clearAnswersAction } from '../../../src/actions/answers'
import LanguageSelector from '../../../../common/components/LanguageSelector'
import { getCurrentLanguage } from '../../../../common/components/LanguageSelector/duck'
import { allowedToSelectMultiLanguageInTest } from '../../../src/selectors/user'

const { useLanguageFeatureQn } = constantsQuestionType

const shouldHideScoringBlock = (item, currentQuestionId) => {
  const questions = get(item, 'data.questions', [])
  const newQuestionTobeAdded = !questions.find(
    (x) => x.id === currentQuestionId
  )
  const itemLevelScoring = get(item, 'itemLevelScoring', true)
  let canHideScoringBlock = true
  if (questions.length === 0) {
    canHideScoringBlock = false
  } else if (questions.length === 1 && !newQuestionTobeAdded) {
    canHideScoringBlock = false
  }
  const hideScoringBlock = canHideScoringBlock ? itemLevelScoring : false
  return hideScoringBlock
}

class Container extends Component {
  static displayName = 'QuestionEditorContainer'

  constructor(props) {
    super(props)

    this.state = {
      showModal: false,
      saveClicked: false,
      clearClicked: false,
      showHints: false,
      showStickyHeader: false,
    }

    this.innerDiv = React.createRef()
    this.scrollContainer = React.createRef()
  }

  componentDidMount() {
    window.removeEventListener('scroll', this.handleStickyHeader)
    window.addEventListener('scroll', this.handleStickyHeader)
  }

  componentWillUnmount() {
    // evaluation mode: check/show/clear
    const { clearAnswers, previewMode, changePreview } = this.props
    if (['check', 'show'].includes(previewMode)) {
      changePreview('clear')
      clearAnswers()
    }
    window.removeEventListener('scroll', this.handleStickyHeader)
  }

  componentDidUpdate = () => {
    const { view, savedWindowScrollTop, onSaveScrollTop } = this.props

    const { current: innerDiv } = this.innerDiv

    if (
      savedWindowScrollTop !== 0 &&
      view.toString() === 'edit' &&
      innerDiv.clientHeight + window.outerHeight >= savedWindowScrollTop
    ) {
      window.scrollTo(0, savedWindowScrollTop)
      onSaveScrollTop(0)
    }
  }

  handleStickyHeader = () => {
    const { showStickyHeader } = this.state
    // 100 is the height of header plus how to author button area
    if (window.scrollY >= 100 && showStickyHeader === false) {
      this.setState({ showStickyHeader: true })
    }
    if (window.scrollY < 100 && showStickyHeader === true) {
      this.setState({ showStickyHeader: false })
    }
  }

  handleChangeView = (view) => {
    const { changeView } = this.props
    this.setState({
      showHints: false,
    })
    changeView(view)
  }

  handleShowSource = () => {
    this.setState({ showModal: true })
  }

  handleShowSettings = () => {}

  handleHideSource = () => {
    this.setState({ showModal: false })
  }

  handleApplySource = (json) => {
    try {
      const state = JSON.parse(json)
      const { setQuestionData } = this.props

      setQuestionData(state)
      this.handleHideSource()
    } catch (err) {
      console.error(err)
    }
  }

  cancelEdit = () => {
    const { changeQuestionUpdateFlag, match, history } = this.props
    const { testId } = match.params
    changeQuestionUpdateFlag(false)
    const testPath = `/author/tests/tab/review/id/${testId || 'create'}`
    // above dispatched action needs to flip the flag, hence setTimeout to get around it
    setTimeout(() => {
      history.push(testPath)
    }, 0)
  }

  handleSaveQuestion = () => {
    const {
      saveQuestion,
      savePassage,
      removeAnswers,
      setAuthoredByMeFilter,
      match,
      history,
      isEditFlow,
      isTestFlow,
    } = this.props
    const { testId } = match.params

    const isPassageWithQuestions = get(
      history,
      'location.state.isPassageWithQuestions',
      false
    )
    if (isPassageWithQuestions) {
      return savePassage({
        isTestFlow,
        isEditFlow,
        testId: testId || history?.location?.state?.testId,
      })
    }

    saveQuestion(testId, isTestFlow, isEditFlow)
    removeAnswers()
    if (setAuthoredByMeFilter) setAuthoredByMeFilter()
  }

  handleSave = debounce(this.handleSaveQuestion, 1000)

  handleSaveAndPublish = () => {
    const { saveAndPublishItem } = this.props
    if (typeof saveAndPublishItem === 'function') {
      saveAndPublishItem()
    }
  }

  handleChangePreviewTab = (previewTab) => {
    const { checkAnswer, showAnswer, changePreview, preview } = this.props

    // call the actions only if the new view is different from the previous view
    if (preview !== previewTab) {
      if (previewTab === 'check') {
        checkAnswer('question')
      }
      if (previewTab === 'show') {
        showAnswer('edit')
      }
      changePreview(previewTab)
    }

    // need to use this approach becasue some question type does not know
    // user is clicked clear button in author preview
    if (previewTab === 'clear') {
      this.setState({ clearClicked: true }, () =>
        this.setState({ clearClicked: false })
      )
    }
  }

  renderQuestion = () => {
    const {
      view,
      question,
      preview,
      itemFromState,
      showCalculatingSpinner,
    } = this.props
    const { saveClicked, clearClicked } = this.state
    const questionType = question && question.type
    if (view === 'metadata') {
      return <QuestionMetadata />
    }

    if (view === 'auditTrail') {
      return <QuestionAuditTrailLogs />
    }

    if (questionType) {
      const hidingScoringBlock = shouldHideScoringBlock(
        itemFromState,
        question.id
      )
      return (
        <HideScoringBlackContext.Provider value={hidingScoringBlock}>
          <QuestionWrapper
            type={questionType}
            view={view}
            previewTab={preview}
            viewComponent="editQuestion"
            changePreviewTab={this.handleChangePreviewTab}
            key={questionType && view && saveClicked}
            data={question}
            questionId={question.id}
            saveClicked={saveClicked}
            clearClicked={clearClicked}
            scrollContainer={this.scrollContainer}
            showCalculatingSpinner={showCalculatingSpinner}
          />
          {/* we may need to bring hint button back */}
          {/* {showHints && <Hints questions={[question]} />} */}
        </HideScoringBlackContext.Provider>
      )
    }
  }

  get breadcrumb() {
    const {
      question,
      testItemId,
      location,
      toggleModalAction,
      isItem,
      itemFromState,
      match,
    } = this.props
    const { testId } = match.params
    const questionTitle =
      question.type !== constantsQuestionType.PASSAGE
        ? question.title
        : itemFromState?.isPassageWithQuestions ||
          location?.state?.canAddMultipleItems
        ? 'Passage with Questions'
        : 'Passage With Multipart'
    // TODO: remove dependency on using path for this!!
    if (
      location.pathname.includes('author/tests') ||
      location?.state?.isTestFlow
    ) {
      const testPath = `/author/tests/tab/review/id/${testId || 'create'}`
      let crumbs = [
        {
          title: 'Back to Create Test',
          to: testPath,
          onClick: toggleModalAction,
          state: { persistStore: true },
        },
        {
          title: `Edit Item ( ${questionTitle} )`,
          to: '',
        },
      ]
      if (
        itemFromState?.isPassageWithQuestions ||
        itemFromState?.multipartItem
      ) {
        const title = 'MULTIPART ITEM'
        // crumbs[3] not required?
        // links have changed maybe  (EV-10862)
        crumbs = [
          ...crumbs.slice(0, 3),
          { title, to: `${testPath}/createItem/${itemFromState._id}` },
        ]
      }
      return crumbs
    }

    const crumbs = [
      {
        title: 'ITEM BANK',
        to: '/author/items',
      },
      {
        title: 'SELECT A QUESTION OR RESOURCE',
        to: `/author/items/${testItemId}/item-detail`,
      },
      {
        title: questionTitle,
        to: '',
      },
    ]
    if (isItem) crumbs.splice(1, 1)
    return crumbs
  }

  toggleHints = () => {
    this.setState((prevState) => ({
      showHints: !prevState.showHints,
    }))
  }

  renderButtons = () => {
    const { view, question, preview, itemFromState = {} } = this.props
    const { showHints } = this.state
    const { checkAnswerButton = false, checkAttempts = 1 } =
      question.validation || {}
    const { multipartItem = false, itemLevelScoring = false } =
      itemFromState || {}
    const hideScoreBlock = multipartItem && itemLevelScoring
    const isShowAnswerVisible =
      question &&
      !constantsQuestionType.manuallyGradableQn.includes(question.type)

    return (
      <ButtonAction
        onShowSource={this.handleShowSource}
        onShowSettings={this.handleShowSettings}
        onChangeView={this.handleChangeView}
        changePreviewTab={this.handleChangePreviewTab}
        onSave={this.handleSave}
        handleShowHints={this.toggleHints}
        showHints={showHints}
        view={view}
        showCheckButton={isShowAnswerVisible || checkAnswerButton}
        allowedAttempts={checkAttempts}
        previewTab={preview}
        showSettingsButton={false}
        isShowAnswerVisible={isShowAnswerVisible}
        hideScoreBlock={hideScoreBlock}
      />
    )
  }

  renderRightSideButtons = () => {
    const {
      item,
      updating,
      testItemStatus,
      changePreview,
      preview,
      view,
      isTestFlow,
      isEditable,
      setShowSettings,
    } = this.props

    let showPublishButton = false

    if (item) {
      const { _id: testItemId } = item
      showPublishButton =
        isTestFlow &&
        ((testItemId && testItemStatus && testItemStatus !== 'published') ||
          isEditable)
    }

    return (
      <ButtonAction
        onShowSource={this.handleShowSource}
        onShowSettings={() => setShowSettings(true)}
        onChangeView={this.handleChangeView}
        changePreview={changePreview}
        changePreviewTab={this.handleChangePreviewTab}
        onSave={this.handleSave}
        saving={updating}
        view={view}
        previewTab={preview}
        showPublishButton={showPublishButton}
        showSettingsButton={false}
      />
    )
  }

  get showSaveAndPublishButton() {
    const { itemFromState, isTestFlow } = this.props
    const { multipartItem, passageId, _id = 'new' } = itemFromState
    if (
      !isTestFlow &&
      _id === 'new' &&
      !itemFromState.item &&
      !multipartItem &&
      !passageId
    ) {
      return true
    }
    return false
  }

  header = () => {
    const {
      view,
      modalItemId,
      onModalClose,
      isItem,
      showPublishButton,
      isTestFlow = false,
      item,
      setEditable,
      publishTestItem,
      hasAuthorPermission,
      onSaveScrollTop,
      savedWindowScrollTop,
      setShowSettings,
      saveItem,
      preview,
      question,
    } = this.props

    const commonProps = {
      onChangeView: this.handleChangeView,
      onShowSource: this.handleShowSource,
      changePreviewTab: this.handleChangePreviewTab,
      view,
      preview,
      isTestFlow,
      showMetaData: question.type !== 'passage',
      withLabels: true,
    }

    return isItem ? (
      <ButtonBar
        onSave={saveItem}
        onCancel={this.cancelEdit}
        {...commonProps}
        showPublishButton={showPublishButton}
        onPublishTestItem={publishTestItem}
        onEnableEdit={() => setEditable(true)}
        onSaveScrollTop={onSaveScrollTop}
        hasAuthorPermission={hasAuthorPermission}
        itemStatus={item && item.status}
        renderRightSide={
          view === 'edit' ? this.renderRightSideButtons : () => {}
        }
        onShowSettings={() => setShowSettings(true)}
        showAuditTrail={!!item}
      />
    ) : (
      <ButtonBar
        {...commonProps}
        onCancel={this.cancelEdit}
        onSave={this.handleSave}
        showSaveAndPublishButton={this.showSaveAndPublishButton}
        onSaveAndPublish={this.handleSaveAndPublish}
        renderRightSide={view === 'edit' ? this.renderButtons : () => {}}
        withLabels
        onSaveScrollTop={onSaveScrollTop}
        savedWindowScrollTop={savedWindowScrollTop}
        showAuditTrail={!!item}
        renderExtra={() =>
          modalItemId && (
            <ButtonClose onClick={onModalClose}>
              <IconClose />
            </ButtonClose>
          )
        }
      />
    )
  }

  render() {
    const {
      view,
      question,
      history,
      windowWidth,
      showWarningModal,
      proceedSave,
      hasUnsavedChanges,
      currentLanguage,
      allowedToSelectMultiLanguage,
    } = this.props

    if (!question) {
      const backUrl = get(history, 'location.state.backUrl', '')
      if (backUrl.includes('pickup-questiontype')) {
        const itemId = backUrl.split('/')[3]

        if (itemId && backUrl.includes('/author/items')) {
          // while creating new item
          history.push(`/author/items/${itemId}/item-detail`)
        } else {
          // while creating new test
          history.push(`/author/tests/create/description`)
        }
      } else {
        history.push('/author/items')
      }

      return <div />
    }

    const { showModal, showStickyHeader } = this.state
    const itemId = question === null ? '' : question._id
    const questionType = question && question.type

    return (
      <EditorContainer ref={this.innerDiv}>
        {/* TODO: message can be seen only when react-router-dom detects changes */}
        <CustomPrompt
          when={!!hasUnsavedChanges}
          onUnload
          message={(loc) => {
            console.log('path: ', loc.pathname) // TODO: keep this comment for now, then remove
            return 'There are unsaved changes. Are you sure you want to leave?'
          }}
        />
        {showModal && (
          <SourceModal
            onClose={this.handleHideSource}
            onApply={this.handleApplySource}
          >
            {JSON.stringify(question, null, 4)}
          </SourceModal>
        )}
        <ItemHeader title={question.title} reference={itemId}>
          {this.header()}
        </ItemHeader>

        <BreadCrumbBar className={showStickyHeader ? 'sticky-header' : ''}>
          {windowWidth > desktopWidth.replace('px', '') ? (
            <SecondHeadBar breadcrumb={this.breadcrumb} />
          ) : (
            <BackLink onClick={history.goBack}>Back to Item List</BackLink>
          )}
          <RightActionButtons xs={{ span: 16 }} lg={{ span: 12 }}>
            {allowedToSelectMultiLanguage &&
              useLanguageFeatureQn.includes(questionType) && (
                <LanguageSelector />
              )}
            {view !== 'preview' && view !== 'auditTrail' && (
              <EduButton
                isGhost
                height="30px"
                id={getFormattedAttrId(`${question?.title}-how-to-author`)}
                style={{ float: 'right' }}
              >
                How to author
              </EduButton>
            )}
            <div>{view === 'preview' && this.renderButtons()}</div>
          </RightActionButtons>
        </BreadCrumbBar>
        <QuestionContentWrapper
          data-cy="question-editor-container"
          ref={this.scrollContainer}
          zIndex="1"
        >
          <LanguageContext.Provider value={{ currentLanguage }}>
            {this.renderQuestion()}
          </LanguageContext.Provider>
        </QuestionContentWrapper>
        <WarningModal visible={showWarningModal} proceedPublish={proceedSave} />
      </EditorContainer>
    )
  }
}

Container.propTypes = {
  view: PropTypes.string.isRequired,
  preview: PropTypes.string.isRequired,
  checkAnswer: PropTypes.func.isRequired,
  changePreview: PropTypes.func.isRequired,
  showAnswer: PropTypes.func.isRequired,
  changeView: PropTypes.func.isRequired,
  question: PropTypes.object,
  saveQuestion: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  testItemId: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  modalItemId: PropTypes.string,
  onModalClose: PropTypes.func,
  navigateToPickupQuestionType: PropTypes.func,
  navigateToItemDetail: PropTypes.func,
  onCompleteItemCreation: PropTypes.func,
  windowWidth: PropTypes.number.isRequired,
  location: PropTypes.object.isRequired,
  testName: PropTypes.string,
  toggleModalAction: PropTypes.func.isRequired,
  onSaveScrollTop: PropTypes.func.isRequired,
  savedWindowScrollTop: PropTypes.number,
  testId: PropTypes.string,
}

Container.defaultProps = {
  question: null,
  modalItemId: undefined,
  navigateToPickupQuestionType: () => {},
  navigateToItemDetail: () => {},
  onCompleteItemCreation: () => {},
  onModalClose: () => {},
  savedWindowScrollTop: 0,
  testId: '',
  testName: '',
}

const enhance = compose(
  withRouter,
  withWindowSizes,
  withNamespaces('author'),
  connect(
    (state) => ({
      view: getViewSelector(state),
      preview: getPreviewSelector(state),
      question: getQuestionDataSelector(state),
      testItemId: getItemIdSelector(state),
      itemFromState: getItemSelector(state),
      testName: state.tests.entity.title,
      testId: state.tests.entity._id,
      savedWindowScrollTop: state.pickUpQuestion.savedWindowScrollTop,
      hasUnsavedChanges: state?.authorQuestions?.updated || false,
      showWarningModal: get(state, ['itemDetail', 'showWarningModal'], false),
      showCalculatingSpinner: getCalculatingSelector(state),
      previewMode: getPreviewSelector(state),
      currentLanguage: getCurrentLanguage(state),
      allowedToSelectMultiLanguage: allowedToSelectMultiLanguageInTest(state),
    }),
    {
      changeView: changeViewAction,
      saveQuestion: saveQuestionAction,
      proceedSave: proceedPublishingItemAction,
      saveAndPublishItem: saveAndPublishItemAction,
      setQuestionData: setQuestionDataAction,
      checkAnswer: checkAnswerAction,
      showAnswer: showAnswerAction,
      changePreview: changePreviewAction,
      removeAnswers: removeUserAnswerAction,
      toggleModalAction: toggleCreateItemModalAction,
      onSaveScrollTop: saveScrollTop,
      savePassage: savePassageAction,
      changeQuestionUpdateFlag: changeUpdatedFlagAction,
      clearAnswers: clearAnswersAction,
    }
  )
)

export default enhance(Container)

const BreadCrumbBar = styled.div`
  padding: 10px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &.sticky-header {
    position: fixed;
    left: 70px;
    right: 0;
    background: #fff;
    z-index: 999;
  }
`

const RightActionButtons = styled.div`
  display: flex;
  align-items: center;
`

const EditorContainer = styled.div`
  min-height: 100vh;
  overflow: hidden;
`
