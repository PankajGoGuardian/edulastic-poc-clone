import PropTypes from 'prop-types'
import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { get, isUndefined, last } from 'lodash'
import {
  withWindowSizes,
  notification,
  AssessmentPlayerContext,
} from '@edulastic/common'
import {
  nonAutoGradableTypes,
  collections as collectionConst,
} from '@edulastic/constants'

import { playerSkinValues } from '@edulastic/constants/const/test'
import {
  homePlaylistPath,
  homeStudentAssignmentsPath,
  studentSebQuitConfirmpath,
} from '../../constants/assessmentPlayer'
import { themes } from '../../../theme'
import MainWrapper from './MainWrapper'
import ToolbarModal from '../common/ToolbarModal'
import SavePauseModalMobile from '../common/SavePauseModalMobile'
import SubmitConfirmation from '../common/SubmitConfirmation'
import {
  toggleBookmarkAction,
  bookmarksByIndexSelector,
} from '../../sharedDucks/bookmark'
import {
  assignmentLevelSettingsSelector,
  getSkippedAnswerSelector,
} from '../../selectors/answers'
import ReportIssuePopover from '../common/ReportIssuePopover'
import { isZoomGreator } from '../../../common/utils/helpers'
import SettingsModal from '../../../student/sharedComponents/SettingsModal'
import { Main, Container, CalculatorContainer } from '../common'
import TestItemPreview from '../../components/TestItemPreview'
import {
  MAX_MOBILE_WIDTH,
  IPAD_LANDSCAPE_WIDTH,
  LARGE_DESKTOP_WIDTH,
  MEDIUM_DESKTOP_WIDTH,
} from '../../constants/others'
import { checkAnswerEvaluation } from '../../actions/checkanswer'
import { changePreviewAction } from '../../../author/src/actions/view'
import { saveUserWorkAction, clearUserWorkAction } from '../../actions/userWork'
import {
  currentItemAnswerChecksSelector,
  getCalcTypeSelector,
} from '../../selectors/test'
import { getCurrentGroupWithAllClasses } from '../../../student/Login/ducks'
import { setUserAnswerAction } from '../../actions/answers'
import AssessmentPlayerSkinWrapper from '../AssessmentPlayerSkinWrapper'
import { updateTestPlayerAction } from '../../../author/sharedDucks/testPlayer'
import {
  showHintsAction,
  saveHintUsageAction,
} from '../../actions/userInteractions'
import { CLEAR } from '../../constants/constantsForQuestions'
import { showScratchpadInfoNotification } from '../../utils/helpers'
import UserWorkUploadModal from '../../components/UserWorkUploadModal'
import ReferenceDocModal from '../common/ReferenceDocModal'

class AssessmentPlayerDefault extends React.Component {
  constructor(props) {
    super(props)
    const { attachments = [] } = props
    const lastUploadedFileNameExploded =
      last(attachments)?.name?.split('_') || []
    const cameraImageIndex = last(lastUploadedFileNameExploded)
      ? parseInt(last(lastUploadedFileNameExploded), 10) + 1
      : 1

    this.state = {
      cloneCurrentItem: props.currentItem,
      testItemState: '',
      isToolbarModalVisible: false,
      isSubmitConfirmationVisible: false,
      isSavePauseModalVisible: false,
      history: 0,
      currentToolMode: [0],
      enableCrossAction: false,
      minWidth: 480,
      defaultContentWidth: 900,
      defaultHeaderHeight: 62,
      isUserWorkUploadModalVisible: false,
      cameraImageIndex,
    }
    this.scrollContainer = React.createRef()
  }

  get getGoToUrlPath() {
    const { history } = this.props
    let path = ''
    if (history?.location?.state?.playlistAssignmentFlow) {
      path = `${homePlaylistPath}/${history?.location?.state?.playlistId}`
    } else if (navigator.userAgent.includes('SEB')) {
      path = studentSebQuitConfirmpath
    } else {
      path = homeStudentAssignmentsPath
    }
    return path
  }

  changeTool = (val) => {
    const { hasDrawingResponse, playerSkinType } = this.props
    let { currentToolMode, enableCrossAction } = this.state
    if (val === 3 || val === 5) {
      const index = currentToolMode.indexOf(val)
      if (index !== -1) {
        currentToolMode.splice(index, 1)
      } else {
        currentToolMode.push(val)
      }
      currentToolMode = currentToolMode.filter((m) => m === 3 || m === 5)
      if (currentToolMode.includes(5)) {
        const { items, currentItem } = this.props
        if (!isUndefined(currentItem) && Array.isArray(items)) {
          if (
            !hasDrawingResponse &&
            showScratchpadInfoNotification(items[currentItem])
          ) {
            const config =
              playerSkinType === playerSkinValues.quester ||
              playerSkinType === playerSkinValues.drc
                ? { bottom: '64px' }
                : {}
            notification({
              type: 'info',
              messageKey: 'scratchpadInfoMultipart',
              ...config,
            })
          }
        }
      }
    } else {
      currentToolMode = [val]
    }
    if (val === 3) {
      enableCrossAction = !enableCrossAction
      this.setState({ currentToolMode, enableCrossAction })
    } else {
      this.setState({ currentToolMode })
    }
  }

  changeTabItemState = (value) => {
    const {
      checkAnswer,
      answerChecksUsedForItem,
      settings,
      groupId,
      playerSkinType,
    } = this.props
    const config =
      playerSkinType === playerSkinValues.quester ||
      playerSkinType === playerSkinValues.drc
        ? { bottom: '64px' }
        : {}
    if (answerChecksUsedForItem >= settings.maxAnswerChecks)
      return notification({
        type: 'warn',
        messageKey: 'checkAnswerLimitExceededForItem',
        ...config,
      })
    checkAnswer(groupId)
    this.setState({ testItemState: value })
  }

  closeToolbarModal = () => {
    this.setState({ isToolbarModalVisible: false })
  }

  closeSavePauseModal = () => {
    this.setState({ isSavePauseModalVisible: false })
  }

  openSubmitConfirmation = () => {
    const { previewPlayer, updateTestPlayer } = this.props
    updateTestPlayer({ enableMagnifier: false })
    if (previewPlayer) {
      return
    }
    this.setState({ isSubmitConfirmationVisible: true })
  }

  closeSubmitConfirmation = () => {
    this.setState({ isSubmitConfirmationVisible: false })
  }

  finishTest = () => {
    const { history, saveCurrentAnswer } = this.props
    saveCurrentAnswer({
      shouldClearUserWork: true,
      pausing: true,
      urlToGo: this.getGoToUrlPath,
      locState: history?.location?.state,
    })
  }

  // will dispatch user work to store on here for scratchpad, passage highlight, or cross answer
  // sourceId will be one of 'scratchpad', 'resourceId', and 'crossAction'
  saveUserWork = (sourceId) => (data) => {
    const { saveUserWork, items, currentItem, userWork, passage } = this.props
    this.setState(({ history }) => ({ history: history + 1 }))

    // resourceId(passage) will use passage._id
    // @see https://snapwiz.atlassian.net/browse/EV-14181
    let userWorkId = items[currentItem]?._id
    if (sourceId === 'resourceId') {
      userWorkId = passage._id
    }
    const scratchpadData = {}
    if (sourceId === 'scratchpad' && data.questionId) {
      const { questionId, userWorkData } = data
      // keep all other question data in scratchpad
      scratchpadData[sourceId] = {
        ...(userWork[sourceId] || {}),
        [questionId]: userWorkData,
      }
    } else {
      scratchpadData[sourceId] = data
    }

    saveUserWork({
      [userWorkId]: { ...(userWork || {}), ...scratchpadData },
    })
  }

  saveHintUsage = (hintUsage) => {
    const { saveHintUsageData, currentItem, items } = this.props
    saveHintUsageData({
      itemId: items[currentItem]?._id,
      hintUsage,
    })
  }

  toggleUserWorkUploadModal = () =>
    this.setState(({ isUserWorkUploadModalVisible }) => ({
      isUserWorkUploadModalVisible: !isUserWorkUploadModalVisible,
    }))

  closeUserWorkUploadModal = () => {
    window.sessionStorage.removeItem('isRequestingCameraAccess')
    this.setState({ isUserWorkUploadModalVisible: false })
  }

  saveUserWorkAttachments = (files) => {
    const { attachments } = this.props
    const newAttachments = files.map(({ name, type, size, source }) => ({
      name,
      type,
      size,
      source,
    }))
    this.saveUserWork('attachments')([
      ...(attachments || []),
      ...newAttachments,
    ])
    this.setState(({ cameraImageIndex }) => ({
      cameraImageIndex: cameraImageIndex + 1,
    }))

    this.closeUserWorkUploadModal()
  }

  static getDerivedStateFromProps(next, prevState) {
    if (next.currentItem !== prevState.cloneCurrentItem) {
      // coming from a different question
      // initialize/reset state values
      const currentToolMode = []
      if (next.scratchPad && !prevState.currentToolMode) {
        currentToolMode.push(5)
      }

      if (!next.crossAction && !next.scratchPad) {
        currentToolMode.push(0)
      }

      const { attachments = [] } = next
      const lastUploadedFileNameExploded =
        last(attachments)?.name?.split('_') || []
      const cameraImageIndex = last(lastUploadedFileNameExploded)
        ? parseInt(last(lastUploadedFileNameExploded), 10) + 1
        : 1

      const nextState = {
        currentToolMode,
        cloneCurrentItem: next.currentItem,
        cameraImageIndex,
        history: 0,
        enableCrossAction: currentToolMode.indexOf(3) !== -1,
        testItemState: '', // start in clear preview mode (attemptable mode)
      }
      return nextState
    }

    return null
  }

  componentDidMount() {
    const { updateTestPlayer } = this.props
    updateTestPlayer({ currentCalculatorType: '' })
  }

  componentDidUpdate(previousProps) {
    const { currentItem } = this.props
    if (
      currentItem !== previousProps.currentItem &&
      this.scrollContainer.current
    ) {
      this.scrollContainer.current.scrollTop = 0
    }
  }

  handleChangePreview = () => {
    const { changePreview = () => {} } = this.props
    // change the player state to clear mode (attemptable mode)
    this.setState({ testItemState: '' }, () => changePreview(CLEAR))
  }

  render() {
    const {
      theme,
      items,
      isFirst,
      isLast,
      currentItem,
      itemRows,
      evaluation,
      windowWidth,
      questions,
      moveToNext,
      moveToPrev,
      gotoQuestion,
      previewPlayer,
      scratchPad,
      attachments,
      highlights,
      crossAction,
      toggleBookmark,
      isBookmarked,
      answerChecksUsedForItem,
      bookmarksInOrder,
      skippedInOrder,
      previousQuestionActivities,
      LCBPreviewModal,
      preview,
      zoomLevel: _zoomLevel,
      selectedTheme = 'default',
      closeTestPreviewModal,
      isStudentReport,
      defaultAP,
      playerSkinType,
      originalSkinName,
      title,
      changePreview,
      showMagnifier,
      handleMagnifier,
      enableMagnifier,
      scratchpadActivity,
      showHints,
      timedAssignment = false,
      groupId,
      utaId,
      hasDrawingResponse,
      studentReportModal,
      hidePause,
      blockNavigationToAnsweredQuestions,
      uploadToS3,
      user = {},
      gotoSummary,
      isShowStudentWork,
      handleReviewOrSubmit,
      openReferenceModal,
      isShowReferenceModal,
      referenceDocAttributes,
      isTestDemoPlayer,
      canShowPlaybackOptionTTS,
      passage,
      canShowReferenceMaterial,
      classLevelSettings,
      viewAsStudent,
      calcTypes,
    } = this.props
    const { firstName = '', lastName = '' } = user
    const { settings } = this.props
    const {
      testItemState,
      isToolbarModalVisible,
      isSubmitConfirmationVisible,
      isSavePauseModalVisible,
      enableCrossAction,
      minWidth,
      defaultContentWidth,
      defaultHeaderHeight,
      currentToolMode,
      isUserWorkUploadModalVisible,
      cameraImageIndex,
    } = this.state
    const { firstItemInSectionAndRestrictNav } = this.context // To diable back navigation for prevent section navigation
    const dropdownOptions = Array.isArray(items)
      ? items.map((item, index) => index)
      : []

    const item = items[currentItem]
    if (!item) {
      return <div />
    }
    const previousQuestionActivity = previousQuestionActivities[item?._id]
    let isNonAutoGradable = false

    if (item.data && item.data.questions) {
      item.data.questions.forEach((question) => {
        if (nonAutoGradableTypes.includes(question.type)) {
          isNonAutoGradable = true
        }
      })
    }

    const scratchPadMode = currentToolMode.indexOf(5) !== -1 || isStudentReport

    // calculate width of question area
    const isQuester =
      playerSkinType === playerSkinValues.quester ||
      playerSkinType === playerSkinValues.drc
    const reduceOriginalMarginWidth = isQuester ? 0 : 70
    const availableWidth = windowWidth - reduceOriginalMarginWidth
    let responsiveWidth = availableWidth
    let zoomLevel = _zoomLevel

    if (defaultContentWidth * zoomLevel > availableWidth) {
      if (availableWidth / zoomLevel < minWidth) {
        zoomLevel = availableWidth / minWidth
        responsiveWidth = minWidth
      } else {
        responsiveWidth = availableWidth / zoomLevel
      }
    } else if (
      availableWidth / zoomLevel > defaultContentWidth &&
      zoomLevel > '1'
    ) {
      responsiveWidth = availableWidth / zoomLevel
    }
    // 20, 18 and 12 are right margin for right nave on zooming
    if (zoomLevel >= 1.5 && zoomLevel < 1.75 && !isQuester) {
      responsiveWidth -= 20
    }
    if (zoomLevel >= 1.75 && zoomLevel < 2.5 && !isQuester) {
      responsiveWidth -= 18
    }
    if (zoomLevel >= 2.5 && !isQuester) {
      responsiveWidth -= 12
    }

    const hasCollapseButtons =
      itemRows?.length > 1 &&
      itemRows
        ?.flatMap((_item) => _item?.widgets)
        ?.find((_item) => _item?.widgetType === 'resource')

    const themeToPass = theme[selectedTheme] || theme.default
    // themeToPass = getZoomedTheme(themeToPass, zoomLevel);
    // themeToPass = playersZoomTheme(themeToPass);

    const navZoomStyle = { zoom: themeToPass?.header?.navZoom }
    const isZoomApplied = zoomLevel > '1'
    const showSettingIcon =
      windowWidth < IPAD_LANDSCAPE_WIDTH ||
      isZoomGreator('md', themeToPass?.zoomLevel) ||
      (zoomLevel >= '1.5' && windowWidth < MEDIUM_DESKTOP_WIDTH) ||
      (zoomLevel >= '1.5' &&
        windowWidth < LARGE_DESKTOP_WIDTH &&
        settings.maxAnswerChecks > 0)
    let headerZoom = 1
    if (isZoomApplied) {
      headerZoom = zoomLevel >= '1.75' ? '1.35' : '1.25'
    }

    // calculate height of questiin area
    const headerHeight = defaultHeaderHeight * headerZoom

    const headerStyleWidthZoom = {
      transform: `scale(${headerZoom})`, // maxScale of 1.5 to header
      transformOrigin: '0px 0px',
      width: isZoomApplied && `${zoomLevel >= '1.75' ? '76' : '80'}%`,
      padding: `${
        isZoomApplied
          ? zoomLevel >= '1.75'
            ? '11px'
            : '11px 5px'
          : windowWidth >= MEDIUM_DESKTOP_WIDTH
          ? '11px 0px'
          : '12px 0px'
      }`,
      justifyContent: 'space-between',
    }

    const isMobile = windowWidth <= MAX_MOBILE_WIDTH

    if (isMobile) {
      headerStyleWidthZoom.padding = 0
    }

    const qType = get(items, `[${currentItem}].data.questions[0].type`, null)
    const cameraImageName = `${firstName}_${lastName}_${
      currentItem + 1
    }_${cameraImageIndex}.png`

    const premiumCollectionWithoutAccess =
      item?.premiumContentRestriction &&
      item?.collections
        ?.filter(({ type = '' }) => type === collectionConst.types.PREMIUM)
        .map(({ name }) => name)

    const extraTestItemProps =
      testItemState === 'check'
        ? {
            previewTab: 'check',
            verticalDivider: item.verticalDivider,
            scrolling: item.scrolling,
            changePreviewTab: this.handleChangePreview,
            userWork: scratchPad,
          }
        : {
            isPassageWithQuestions: item?.isPassageWithQuestions,
            multipartItem: item?.multipartItem,
            scratchpadDimensions: LCBPreviewModal
              ? scratchpadActivity.dimensions
              : null,
            userWork: LCBPreviewModal ? scratchpadActivity.data : scratchPad,
            changePreviewTab: changePreview,
          }
    const { isStudentAttempt } = this.context
    return (
      /**
       * zoom only in student side, otherwise not
       * we need to pass zoomLevel as a theme variable because we should use it in questions
       */
      <ThemeProvider
        theme={{
          ...themeToPass,
          shouldZoom: true,
          zoomLevel,
          headerHeight,
          playerSkinType,
        }}
      >
        <Container
          id="assessment-player-wrapper"
          scratchPadMode={scratchPadMode}
          data-cy="assessment-player-default-wrapper"
        >
          <AssessmentPlayerSkinWrapper
            hidePause={hidePause}
            title={title}
            LCBPreviewModal={LCBPreviewModal}
            headerHeight={headerHeight}
            isMobile={isMobile}
            // key={currentItem}
            currentItem={currentItem}
            gotoQuestion={gotoQuestion}
            options={dropdownOptions}
            bookmarks={bookmarksInOrder}
            skipped={skippedInOrder}
            dropdownStyle={navZoomStyle}
            zoomLevel={headerZoom}
            overlayStyle={navZoomStyle}
            disabled={
              isFirst() ||
              blockNavigationToAnsweredQuestions ||
              firstItemInSectionAndRestrictNav
            }
            isLast={isLast()}
            moveToPrev={moveToPrev}
            moveToNext={moveToNext}
            showSettingIcon={showSettingIcon}
            answerChecksUsedForItem={answerChecksUsedForItem}
            settings={settings}
            items={items}
            isNonAutoGradable={isNonAutoGradable}
            checkAnswer={() => this.changeTabItemState('check')}
            toggleBookmark={() => toggleBookmark(item._id)}
            isBookmarked={isBookmarked}
            handletoggleHints={showHints}
            onClickSetting={() => {
              this.setState({ isToolbarModalVisible: true })
            }}
            tool={currentToolMode}
            openReferenceModal={openReferenceModal}
            isShowReferenceModal={isShowReferenceModal}
            canShowReferenceMaterial={canShowReferenceMaterial}
            changeTool={this.changeTool}
            hasDrawingResponse={hasDrawingResponse}
            qType={qType}
            previewPlayer={previewPlayer}
            headerStyleWidthZoom={headerStyleWidthZoom}
            playerSkinType={playerSkinType}
            originalSkinName={originalSkinName}
            defaultAP={defaultAP}
            finishTest={
              previewPlayer
                ? () => closeTestPreviewModal()
                : () => this.openSubmitConfirmation()
            }
            showMagnifier={showMagnifier}
            handleMagnifier={handleMagnifier}
            enableMagnifier={enableMagnifier}
            toggleUserWorkUploadModal={this.toggleUserWorkUploadModal}
            timedAssignment={timedAssignment}
            utaId={utaId}
            groupId={groupId}
            blockNavigationToAnsweredQuestions={
              blockNavigationToAnsweredQuestions
            }
            gotoSummary={gotoSummary}
            isShowStudentWork={isShowStudentWork}
            handleReviewOrSubmit={handleReviewOrSubmit}
            isPremiumContentWithoutAccess={!!premiumCollectionWithoutAccess}
            themeForHeader={{
              ...theme.default,
              shouldZoom: true,
              zoomLevel,
              headerHeight,
              playerSkinType,
            }}
            passage={passage}
            canShowPlaybackOptionTTS={canShowPlaybackOptionTTS}
            calcTypes={calcTypes}
          >
            <ToolbarModal
              isVisible={isToolbarModalVisible}
              onClose={() => this.closeToolbarModal()}
              checkAnswer={() => this.changeTabItemState('check')}
              windowWidth={windowWidth}
              answerChecksUsedForItem={answerChecksUsedForItem}
              settings={settings}
              items={items}
              currentItem={currentItem}
              isNonAutoGradable={isNonAutoGradable}
              toggleBookmark={() => toggleBookmark(item._id)}
              isBookmarked={isBookmarked}
              handletoggleHints={showHints}
              changeTool={this.changeTool}
              handleMagnifier={handleMagnifier}
              qType={qType}
              blockNavigationToAnsweredQuestions={
                blockNavigationToAnsweredQuestions
              }
              isPremiumContentWithoutAccess={!!premiumCollectionWithoutAccess}
              toggleUserWorkUploadModal={this.toggleUserWorkUploadModal}
              openReferenceModal={openReferenceModal}
              isShowReferenceModal={isShowReferenceModal}
              canShowReferenceMaterial={canShowReferenceMaterial}
            />
            {!previewPlayer && (
              <SavePauseModalMobile
                isVisible={isSavePauseModalVisible}
                onClose={this.closeSavePauseModal}
                onExitClick={this.openSubmitConfirmation}
              />
            )}
            {!previewPlayer && (
              <SubmitConfirmation
                isVisible={isSubmitConfirmationVisible}
                onClose={() => this.closeSubmitConfirmation()}
                finishTest={this.finishTest}
                settings={settings}
              />
            )}
            <Main skin headerHeight={headerHeight} padding="20px 30px">
              <SettingsModal
                isPremiumContentWithoutAccess={!!premiumCollectionWithoutAccess}
                canShowPlaybackOptionTTS={canShowPlaybackOptionTTS}
              />
              <MainWrapper
                ref={this.scrollContainer}
                hasCollapseButtons={hasCollapseButtons}
                isStudentAttempt={isStudentAttempt}
              >
                <TestItemPreview
                  showCollapseBtn
                  isExpandedView
                  cols={itemRows}
                  preview={preview}
                  previousQuestionActivity={previousQuestionActivity}
                  evaluation={evaluation}
                  LCBPreviewModal={LCBPreviewModal}
                  questions={questions}
                  viewComponent="studentPlayer"
                  highlights={highlights}
                  crossAction={crossAction || {}}
                  setHighlights={this.saveUserWork('resourceId')} // this needs only for passage type
                  setCrossAction={
                    enableCrossAction ? this.saveUserWork('crossAction') : false
                  } // this needs only for MCQ, MSQ, Matching Table.
                  scratchPadMode={scratchPadMode}
                  saveUserWork={this.saveUserWork('scratchpad')}
                  saveAttachments={this.saveUserWork('attachments')}
                  attachments={attachments}
                  saveHintUsage={this.saveHintUsage}
                  enableMagnifier={enableMagnifier}
                  isStudentReport={isStudentReport}
                  itemId={item._id}
                  itemLevelScoring={item.itemLevelScoring}
                  studentReportModal={studentReportModal}
                  tool={currentToolMode}
                  isShowStudentWork={isShowStudentWork}
                  zoomLevel={zoomLevel}
                  responsiveWidth={responsiveWidth}
                  isTestDemoPlayer={isTestDemoPlayer}
                  isPremiumContentWithoutAccess={
                    !!premiumCollectionWithoutAccess
                  }
                  premiumCollectionWithoutAccess={
                    premiumCollectionWithoutAccess
                  }
                  classLevelSettings={classLevelSettings}
                  multipartItem={item?.multipartItem}
                  {...extraTestItemProps}
                  viewAsStudent={viewAsStudent}
                />
              </MainWrapper>
              {isShowReferenceModal && referenceDocAttributes && (
                <ReferenceDocModal
                  attributes={referenceDocAttributes}
                  playerSkinType={playerSkinType}
                  zoomLevel={zoomLevel}
                />
              )}
            </Main>

            <ReportIssuePopover item={item} playerSkinType={playerSkinType} />

            {currentToolMode.indexOf(2) !== -1 && (
              <CalculatorContainer
                changeTool={this.changeTool}
                calcTypes={calcTypes}
                calcProvider={settings.calcProvider}
              />
            )}
            <UserWorkUploadModal
              isModalVisible={isUserWorkUploadModalVisible}
              onCancel={this.closeUserWorkUploadModal}
              uploadFile={uploadToS3}
              onUploadFinished={this.saveUserWorkAttachments}
              cameraImageName={cameraImageName}
            />
          </AssessmentPlayerSkinWrapper>
        </Container>
      </ThemeProvider>
    )
  }

  componentWillUnmount() {
    const { previewPlayer, clearUserWork, isStudentReport } = this.props
    if (previewPlayer && !isStudentReport) {
      clearUserWork()
    }
  }
}

AssessmentPlayerDefault.propTypes = {
  theme: PropTypes.object,
  scratchPad: PropTypes.any.isRequired,
  highlights: PropTypes.any.isRequired,
  isFirst: PropTypes.func.isRequired,
  moveToNext: PropTypes.func.isRequired,
  moveToPrev: PropTypes.func.isRequired,
  currentItem: PropTypes.any.isRequired,
  items: PropTypes.any.isRequired,
  gotoQuestion: PropTypes.any.isRequired,
  itemRows: PropTypes.array.isRequired,
  evaluation: PropTypes.any.isRequired,
  showHints: PropTypes.func.isRequired,
  checkAnswer: PropTypes.func.isRequired,
  history: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
  questions: PropTypes.object.isRequired,
  userWork: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
  answerChecksUsedForItem: PropTypes.number.isRequired,
  previewPlayer: PropTypes.bool.isRequired,
  saveUserWork: PropTypes.func.isRequired,
  LCBPreviewModal: PropTypes.any.isRequired,
  isTestDemoPlayer: PropTypes.bool,
  canShowPlaybackOptionTTS: PropTypes.string,
}

AssessmentPlayerDefault.defaultProps = {
  theme: themes,
  isTestDemoPlayer: false,
  canShowPlaybackOptionTTS: false,
}

function getScratchpadWork(questions = [], userWorkData = {}, target) {
  return questions.reduce(
    (acc, curr) => {
      const { activity: { qActId, _id } = {} } = curr
      const key = target === 'qActId' ? qActId : _id
      if (key && userWorkData?.[key]) {
        acc.data[key] = userWorkData?.[key]
      }
      return acc
    },
    { data: {} }
  )
}

function getScratchpadWorkForStudentReport({ userWork, uqas }) {
  const data = (uqas?.[0] || []).reduce(
    (acc, curr) => {
      if (userWork[curr._id]) {
        acc.data[curr._id] = userWork[curr._id]
      }
      return acc
    },
    { data: {} }
  )
  if (Array.isArray(uqas) && uqas.length > 0) {
    data.dimensions = { ...uqas[0].scratchPad?.dimensions }
  }
  return data
}

function getScratchPadfromActivity(state, props) {
  const {
    LCBPreviewModal = false,
    studentReportModal = false,
    questionActivities = [],
    testActivityId = '',
    hasDrawingResponse,
    isStudentView,
  } = props

  let acts = questionActivities
  if (LCBPreviewModal || studentReportModal) {
    const { userWork, studentTestItems } = state
    let items
    let currentItem
    if (studentReportModal) {
      items = studentTestItems.items
      currentItem = studentTestItems.current
      acts = acts[0]
    } else {
      items = props.items
      currentItem = props.currentItem
    }
    const itemId = items[currentItem]._id
    const questionActivity =
      acts.find(
        (act) =>
          act.testItemId === itemId && act.testActivityId === testActivityId
      ) || {}
    const { scratchPad: { dimensions } = {} } = questionActivity
    if (hasDrawingResponse) {
      if (studentReportModal) {
        return getScratchpadWorkForStudentReport({
          userWork: get(state, ['userWork', 'present']),
          uqas: questionActivities,
          item: items?.[currentItem] || {},
          hasDrawingResponse,
        })
      }
      const target = isStudentView ? 'qActId' : '_id'
      const data = getScratchpadWork(
        get(items, [currentItem, 'data', 'questions'], []),
        get(state, ['userWork', 'present']),
        target
      )
      data.dimensions = dimensions
      return data
    }
    let uqaIdList = []
    if (items?.[currentItem]?.itemLevelScoring) {
      uqaIdList = (items[currentItem]?.data?.questions || []).map((q) => {
        const { activity } = q
        const { qActId, _id } = activity || {}
        return qActId || _id
      })
    }
    questionActivity.qActId = questionActivity.qActId || questionActivity._id
    let userWorkData = {}
    if (uqaIdList.length) {
      const currentIdInStore = uqaIdList.find((id) => userWork.present[id])
      if (currentIdInStore) {
        userWorkData = userWork.present[currentIdInStore] || {}
      }
    } else {
      userWorkData = userWork.present[questionActivity.qActId] || {}
    }
    const scratchPadData = { data: userWorkData, dimensions }

    return scratchPadData
  }
  return {}
}

function getHighlightsFromUserwork(state, props) {
  const {
    LCBPreviewModal = false,
    testActivityId = '',
    items,
    currentItem,
  } = props
  const passageId = get(items, `[${currentItem}].passageId`)
  const {
    userWork: { present },
  } = state

  // student attempt
  let highlights = get(present, `[${passageId}].resourceId`, null)

  // LCB at show userWork
  if (LCBPreviewModal && testActivityId) {
    highlights = get(
      present,
      `[${passageId}][${testActivityId}].resourceId`,
      null
    )
  }
  return highlights
}

const enhance = compose(
  withRouter,
  withWindowSizes,
  connect(
    (state, ownProps) => ({
      user: get(state, 'user.user'),
      evaluation: state.evaluation,
      preview: state.view.preview,
      scratchPad: get(
        state,
        `userWork.present[${
          ownProps.items[ownProps.currentItem]?._id
        }].scratchpad`,
        null
      ),
      attachments: get(
        state,
        `userWork.present[${
          ownProps.items[ownProps.currentItem]?._id
        }].attachments`,
        null
      ),
      highlights: getHighlightsFromUserwork(state, ownProps),
      crossAction: get(
        state,
        `userWork.present[${
          ownProps.items[ownProps.currentItem]?._id
        }].crossAction`,
        null
      ),
      userWork: get(
        state,
        `userWork.present[${ownProps.items[ownProps.currentItem]?._id}]`,
        {}
      ),
      settings: state.test.settings,
      calcTypes: getCalcTypeSelector(state),
      answerChecksUsedForItem: currentItemAnswerChecksSelector(state),
      isBookmarked: !!get(
        state,
        ['assessmentBookmarks', ownProps.items[ownProps.currentItem]?._id],
        false
      ),
      bookmarksInOrder: bookmarksByIndexSelector(state),
      skippedInOrder: getSkippedAnswerSelector(state),
      currentGroupId: getCurrentGroupWithAllClasses(state),
      userAnswers: state.answers,
      zoomLevel: state.ui.zoomLevel,
      selectedTheme: state.ui.selectedTheme,
      previousQuestionActivities: get(state, 'previousQuestionActivity', {}),
      scratchpadData: state.scratchpad,
      scratchpadActivity: getScratchPadfromActivity(state, ownProps),
      timedAssignment: state.test?.settings?.timedAssignment,
      currentAssignmentTime: state.test?.currentAssignmentTime,
      stopTimerFlag: state.test?.stopTimerFlag,
      assignmentSettings: assignmentLevelSettingsSelector(state),
    }),
    {
      changePreview: changePreviewAction,
      saveUserWork: saveUserWorkAction,
      toggleBookmark: toggleBookmarkAction,
      checkAnswer: checkAnswerEvaluation,
      setUserAnswer: setUserAnswerAction,
      clearUserWork: clearUserWorkAction,
      updateTestPlayer: updateTestPlayerAction,
      saveHintUsageData: saveHintUsageAction,
      showHints: showHintsAction,
    }
  )
)
AssessmentPlayerDefault.contextType = AssessmentPlayerContext
export default enhance(AssessmentPlayerDefault)
