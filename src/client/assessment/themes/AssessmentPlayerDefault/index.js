import PropTypes from 'prop-types'
import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { get, keyBy, isUndefined } from 'lodash'
import { withWindowSizes, ScrollContext, notification } from '@edulastic/common'
import { nonAutoGradableTypes, test } from '@edulastic/constants'

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
import {
  Main,
  Container,
  CalculatorContainer,
  getDefaultCalculatorProvider,
} from '../common'
import TestItemPreview from '../../components/TestItemPreview'
import {
  MAX_MOBILE_WIDTH,
  IPAD_LANDSCAPE_WIDTH,
  LARGE_DESKTOP_WIDTH,
} from '../../constants/others'
import { checkAnswerEvaluation } from '../../actions/checkanswer'
import { changePreviewAction } from '../../../author/src/actions/view'
import { saveUserWorkAction, clearUserWorkAction } from '../../actions/userWork'
import { currentItemAnswerChecksSelector } from '../../selectors/test'
import { getCurrentGroupWithAllClasses } from '../../../student/Login/ducks'
import FeaturesSwitch from '../../../features/components/FeaturesSwitch'
import { setUserAnswerAction } from '../../actions/answers'
import AssessmentPlayerSkinWrapper from '../AssessmentPlayerSkinWrapper'
import { updateTestPlayerAction } from '../../../author/sharedDucks/testPlayer'
import {
  showHintsAction,
  saveHintUsageAction,
} from '../../actions/userInteractions'
import { CLEAR } from '../../constants/constantsForQuestions'
import { showScratchpadInfoNotification } from '../../utils/helpers'

class AssessmentPlayerDefault extends React.Component {
  constructor(props) {
    super(props)
    const { settings } = props
    const calcType = this.calculatorType
    this.state = {
      cloneCurrentItem: props.currentItem,
      testItemState: '',
      isToolbarModalVisible: false,
      isSubmitConfirmationVisible: false,
      isSavePauseModalVisible: false,
      history: 0,
      calculateMode: `${calcType}_${
        settings.calcProvider || getDefaultCalculatorProvider(calcType)
      }`,
      currentToolMode: [0],
      enableCrossAction: false,
      minWidth: 480,
      defaultContentWidth: 900,
      defaultHeaderHeight: 62,
    }
    this.scrollContainer = React.createRef()
  }

  get calculatorType() {
    const {
      settings: { calcType: testCalculatorType } = {},
      assignmentSettings: { calcType: assignmentCalculatorType } = {},
    } = this.props
    let calculatorType = testCalculatorType
    if (
      assignmentCalculatorType &&
      assignmentCalculatorType !== test.calculatorTypes.NONE
    ) {
      calculatorType = assignmentCalculatorType
    }
    return calculatorType
  }

  changeTool = (val) => {
    const { hasDrawingResponse } = this.props
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
            notification({
              type: 'info',
              messageKey: 'scratchpadInfoMultipart',
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
    } = this.props
    if (answerChecksUsedForItem >= settings.maxAnswerChecks)
      return notification({
        type: 'warn',
        messageKey: 'checkAnswerLimitExceededForItem',
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
    saveCurrentAnswer({ shouldClearUserWork: true, pausing: true })
    if (history?.location?.state?.playlistAssignmentFlow) {
      history.push(`/home/playlist/${history?.location?.state?.playlistId}`)
    } else if (navigator.userAgent.includes('SEB')) {
      history.push('/student/seb-quit-confirm')
    } else {
      history.push('/home/assignments')
    }
  }

  handleModeCaculate = (calculateMode) => {
    this.setState({
      calculateMode,
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

  static getDerivedStateFromProps(next, prevState) {
    if (next.currentItem !== prevState.cloneCurrentItem) {
      // coming from a different question
      // initialise/reset state values
      const currentToolMode = []
      if (next.scratchPad && !prevState.currentToolMode) {
        currentToolMode.push(5)
      }

      if (!next.crossAction && !next.scratchPad) {
        currentToolMode.push(0)
      }

      const nextState = {
        currentToolMode,
        cloneCurrentItem: next.currentItem,
        history: 0,
        enableCrossAction: currentToolMode.indexOf(3) !== -1,
        testItemState: '', // start in clear preview mode (attemptable mode)
      }
      return nextState
    }

    return null
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
      currentGroupId,
      previousQuestionActivities,
      LCBPreviewModal,
      preview,
      zoomLevel: _zoomLevel,
      selectedTheme = 'default',
      closeTestPreviewModal,
      isStudentReport,
      passage,
      defaultAP,
      playerSkinType,
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
    } = this.props
    const { settings } = this.props
    const {
      testItemState,
      isToolbarModalVisible,
      isSubmitConfirmationVisible,
      isSavePauseModalVisible,
      calculateMode,
      enableCrossAction,
      minWidth,
      defaultContentWidth,
      defaultHeaderHeight,
      currentToolMode,
    } = this.state
    const calcBrands = ['DESMOS', 'GEOGEBRASCIENTIFIC', 'EDULASTIC']
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
    const availableWidth = windowWidth - 70
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
    if (zoomLevel >= 1.5 && zoomLevel < 1.75) {
      responsiveWidth -= 20
    }
    if (zoomLevel >= 1.75 && zoomLevel < 2.5) {
      responsiveWidth -= 18
    }
    if (zoomLevel >= 2.5) {
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
      isZoomGreator('md', themeToPass?.zoomLevel)
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
          : windowWidth >= LARGE_DESKTOP_WIDTH
          ? '9px 0px'
          : '11px 0px'
      }`,
      justifyContent: 'space-between',
    }

    const isMobile = windowWidth <= MAX_MOBILE_WIDTH

    if (isMobile) {
      headerStyleWidthZoom.padding = 0
    }

    const _settings = {
      ...settings,
      calcType: this.calculatorType,
    }

    const qType = get(items, `[${currentItem}].data.questions[0].type`, null)

    return (
      /**
       * zoom only in student side, otherwise not
       * we need to pass zoomLevel as a theme variable because we should use it in questions
       */
      <ThemeProvider
        theme={{ ...themeToPass, shouldZoom: true, zoomLevel, headerHeight }}
      >
        <Container
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
            disabled={isFirst() || blockNavigationToAnsweredQuestions}
            isLast={isLast()}
            moveToPrev={moveToPrev}
            moveToNext={moveToNext}
            showSettingIcon={showSettingIcon}
            answerChecksUsedForItem={answerChecksUsedForItem}
            settings={_settings}
            items={items}
            isNonAutoGradable={isNonAutoGradable}
            checkAnswer={() => this.changeTabItemState('check')}
            toggleBookmark={() => toggleBookmark(item._id)}
            isBookmarked={isBookmarked}
            handletoggleHints={showHints}
            onClickSetting={() => {
              this.setState({ isToolbarModalVisible: true })
            }}
            calcBrands={calcBrands}
            tool={currentToolMode}
            changeCaculateMode={this.handleModeCaculate}
            changeTool={this.changeTool}
            hasDrawingResponse={hasDrawingResponse}
            qType={qType}
            previewPlayer={previewPlayer}
            headerStyleWidthZoom={headerStyleWidthZoom}
            playerSkinType={playerSkinType}
            defaultAP={defaultAP}
            finishTest={
              previewPlayer
                ? () => closeTestPreviewModal()
                : () => this.openSubmitConfirmation()
            }
            showMagnifier={showMagnifier}
            handleMagnifier={handleMagnifier}
            enableMagnifier={enableMagnifier}
            timedAssignment={timedAssignment}
            utaId={utaId}
            groupId={groupId}
            blockNavigationToAnsweredQuestions={
              blockNavigationToAnsweredQuestions
            }
          >
            <FeaturesSwitch
              inputFeatures="studentSettings"
              actionOnInaccessible="hidden"
              key="studentSettings"
              groupId={currentGroupId}
            >
              <ToolbarModal
                isVisible={isToolbarModalVisible}
                onClose={() => this.closeToolbarModal()}
                checkAnswer={() => this.changeTabItemState('check')}
                windowWidth={windowWidth}
                answerChecksUsedForItem={answerChecksUsedForItem}
                settings={_settings}
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
              />
            </FeaturesSwitch>
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
                settings={_settings}
              />
            )}
            <Main
              skin
              zoomed={isZoomApplied}
              zoomLevel={zoomLevel}
              headerHeight={headerHeight}
              padding="20px 30px"
            >
              <SettingsModal />
              <ScrollContext.Provider
                value={{ getScrollElement: () => this.scrollContainer.current }}
              >
                <MainWrapper
                  responsiveWidth={responsiveWidth}
                  zoomLevel={zoomLevel}
                  ref={this.scrollContainer}
                  hasCollapseButtons={hasCollapseButtons}
                  className="scrollable-main-wrapper"
                  id="assessment-player-default-scroll"
                >
                  {testItemState === '' && (
                    <TestItemPreview
                      LCBPreviewModal={LCBPreviewModal}
                      cols={itemRows}
                      previousQuestionActivity={previousQuestionActivity}
                      questions={
                        passage
                          ? { ...questions, ...keyBy(passage.data, 'id') }
                          : questions
                      }
                      showCollapseBtn
                      highlights={highlights}
                      crossAction={crossAction || {}}
                      viewComponent="studentPlayer"
                      setHighlights={this.saveUserWork('resourceId')}
                      setCrossAction={
                        enableCrossAction
                          ? this.saveUserWork('crossAction')
                          : false
                      } // this needs only for MCQ and MSQ
                      scratchPadMode={scratchPadMode}
                      saveUserWork={this.saveUserWork('scratchpad')}
                      saveAttachments={this.saveUserWork('attachments')}
                      attachments={attachments}
                      userWork={
                        LCBPreviewModal ? scratchpadActivity.data : scratchPad
                      }
                      scratchpadDimensions={
                        LCBPreviewModal ? scratchpadActivity.dimensions : null
                      }
                      preview={preview}
                      evaluation={evaluation}
                      changePreviewTab={changePreview}
                      saveHintUsage={this.saveHintUsage}
                      enableMagnifier={enableMagnifier}
                      updateScratchpadtoStore
                      isPassageWithQuestions={item?.isPassageWithQuestions}
                      isStudentReport={isStudentReport}
                      itemId={item._id}
                      itemLevelScoring={item.itemLevelScoring}
                      studentReportModal={studentReportModal}
                    />
                  )}
                  {testItemState === 'check' && (
                    <TestItemPreview
                      cols={itemRows}
                      previewTab="check"
                      preview={preview}
                      previousQuestionActivity={previousQuestionActivity}
                      evaluation={evaluation}
                      verticalDivider={item.verticalDivider}
                      scrolling={item.scrolling}
                      questions={questions}
                      LCBPreviewModal={LCBPreviewModal}
                      highlights={highlights}
                      crossAction={crossAction || {}}
                      showCollapseBtn
                      viewComponent="studentPlayer"
                      setHighlights={this.saveUserWork('resourceId')} // this needs only for passage type
                      setCrossAction={
                        enableCrossAction
                          ? this.saveUserWork('crossAction')
                          : false
                      } // this needs only for MCQ and MSQ
                      scratchPadMode={scratchPadMode}
                      saveUserWork={this.saveUserWork('scratchpad')}
                      saveAttachments={this.saveUserWork('attachments')}
                      attachments={attachments}
                      userWork={scratchPad}
                      saveHintUsage={this.saveHintUsage}
                      changePreviewTab={this.handleChangePreview}
                      isStudentReport={isStudentReport}
                      enableMagnifier={enableMagnifier}
                      itemId={item._id}
                      itemLevelScoring={item.itemLevelScoring}
                      studentReportModal={studentReportModal}
                    />
                  )}
                </MainWrapper>
              </ScrollContext.Provider>
            </Main>

            <ReportIssuePopover item={item} />

            {currentToolMode.indexOf(2) !== -1 && (
              <CalculatorContainer
                changeTool={this.changeTool}
                calculateMode={calculateMode}
                calcBrands={calcBrands}
              />
            )}
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
}

AssessmentPlayerDefault.defaultProps = {
  theme: themes,
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
    questionActivity.qActId = questionActivity.qActId || questionActivity._id
    const userWorkData = userWork.present[questionActivity.qActId] || {}
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

export default enhance(AssessmentPlayerDefault)
