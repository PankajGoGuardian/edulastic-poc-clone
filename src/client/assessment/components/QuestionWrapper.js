import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled, { ThemeProvider, withTheme } from 'styled-components'
import { questionType, test, roleuser } from '@edulastic/constants'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { get, isEqual, isEmpty } from 'lodash'
import { Tooltip } from 'antd'
import { withNamespaces } from '@edulastic/localization'
import {
  mobileWidthMax,
  smallDesktopWidth,
  borderGrey2,
} from '@edulastic/colors'
import {
  withWindowSizes,
  ItemDetailContext,
  COMPACT,
  FieldLabel,
  FlexContainer,
  PremiumItemBanner,
} from '@edulastic/common'
import { themes } from '../../theme'
import QuestionMenu, { AdvancedOptionsLink } from './QuestionMenu'

import { OrderList } from '../widgets/OrderList'
import { SortList } from '../widgets/SortList'
import { MatchList } from '../widgets/MatchList'
import { Classification } from '../widgets/Classification'
import { MultipleChoice } from '../widgets/MultipleChoice'
import { ClozeDragDrop } from '../widgets/ClozeDragDrop'
import { ClozeImageDragDrop } from '../widgets/ClozeImageDragDrop'
import { ClozeImageDropDown } from '../widgets/ClozeImageDropDown'
import { ClozeImageText } from '../widgets/ClozeImageText'
import { ClozeEditingTask } from '../widgets/ClozeEditingTask'
import { Graph } from './Graph'
import { ClozeDropDown } from '../widgets/ClozeDropDown'
import { ClozeText } from '../widgets/ClozeText'
import { ShortText } from '../widgets/ShortText'
import { TokenHighlight } from '../widgets/TokenHighlight'
import { Shading } from '../widgets/Shading'
import { Hotspot } from '../widgets/Hotspot'
import { HighlightImage } from '../widgets/HighlightImage'
import { Drawing } from './Drawing'
import { EssayPlainText } from '../widgets/EssayPlainText'
import { EssayRichText } from '../widgets/EssayRichText'
import FractionEditor from '../widgets/FractionEditor'
import UploadFile from '../widgets/UploadFile'

import withAnswerSave from './HOC/withAnswerSave'
import { MatrixChoice } from '../widgets/MatrixChoice'
import { Protractor } from '../widgets/Protractor'
import { Passage } from '../widgets/Passage'
import { Video } from '../widgets/Video'
import { Text } from '../widgets/Text'
import { MathFormula } from '../widgets/MathFormula'
import { FormulaEssay } from '../widgets/FormulaEssay'
import ClozeMath from '../widgets/ClozeMath'
import { requestScratchPadAction } from '../../author/ExpressGrader/ducks'
import { setPassageCurrentPageAction } from '../actions/userInteractions'
import { Chart } from '../widgets/Charts'
import { getUserRole, getUserFeatures } from '../../author/src/selectors/user'
import AudioControls from '../AudioControls'

import PreviewRubricTable from '../../author/GradingRubric/Components/common/PreviewRubricTable'
// import { Coding } from '../widgets/Coding'

import Hints from './Hints'
import { EDIT } from '../constants/constantsForQuestions'
import BottomAction from './Common/QuestionBottomAction'
import {
  getIsPreviewModalVisibleSelector,
  playerSkinTypeSelector,
} from '../selectors/test'
import { assignmentLevelSettingsSelector } from '../selectors/answers'
import {
  isItemVisibiltySelector,
  ttsUserIdSelector,
} from '../../author/ClassBoard/ducks'
import ItemInvisible from '../../author/ExpressGrader/components/Question/ItemInvisible'
import { canUseAllOptionsByDefault } from '../../common/utils/helpers'
import { getFontSize } from '../utils/helpers'
import { changeDataToPreferredLanguage } from '../utils/question'
import {
  languagePreferenceSelector,
  getCurrentLanguage,
} from '../../common/components/LanguageSelector/duck'
import { StyledPaperWrapper } from '../styled/Widget'
import Pictograph from '../widgets/Pictorgraph'
import { setQuestionScoreAction } from '../../author/sharedDucks/questions'
import { setItemLevelScoreAction } from '../../author/ItemDetail/ducks'

const DummyQuestion = () => <></>

const getQuestion = (type) => {
  switch (type) {
    case questionType.LINE_PLOT:
    case questionType.DOT_PLOT:
    case questionType.HISTOGRAM:
    case questionType.LINE_CHART:
    case questionType.BAR_CHART:
      return Chart
    case questionType.DRAWING:
      return Drawing
    case questionType.HIGHLIGHT_IMAGE:
      return HighlightImage
    case questionType.SHADING:
      return Shading
    case questionType.HOTSPOT:
      return Hotspot
    case questionType.TOKEN_HIGHLIGHT:
      return TokenHighlight
    case questionType.SHORT_TEXT:
      return ShortText
    case questionType.ESSAY_PLAIN_TEXT:
      return EssayPlainText
    case questionType.ESSAY_RICH_TEXT:
      return EssayRichText
    case questionType.MULTIPLE_CHOICE:
      return MultipleChoice
    case questionType.CHOICE_MATRIX:
      return MatrixChoice
    case questionType.SORT_LIST:
      return SortList
    case questionType.CLASSIFICATION:
      return Classification
    case questionType.MATCH_LIST:
      return MatchList
    case questionType.ORDER_LIST:
      return OrderList
    case questionType.CLOZE_DRAG_DROP:
      return ClozeDragDrop
    case questionType.CLOZE_IMAGE_DRAG_DROP:
      return ClozeImageDragDrop
    case questionType.PROTRACTOR:
      return Protractor
    case questionType.CLOZE_IMAGE_DROP_DOWN:
      return ClozeImageDropDown
    case questionType.CLOZE_IMAGE_TEXT:
      return ClozeImageText
    case questionType.CLOZE_DROP_DOWN:
      return ClozeDropDown
    case questionType.CLOZE_TEXT:
      return ClozeText
    case questionType.EDITING_TASK:
      return ClozeEditingTask
    case questionType.PASSAGE:
      return Passage
    case questionType.VIDEO:
      return Video
    case questionType.TEXT:
      return Text
    case questionType.MATH:
      return MathFormula
    case questionType.FORMULA_ESSAY:
      return FormulaEssay
    case questionType.CLOZE_MATH:
    case questionType.EXPRESSION_MULTIPART:
      return ClozeMath
    case questionType.GRAPH:
      return Graph
    case questionType.FRACTION_EDITOR:
      return FractionEditor
    case questionType.SECTION_LABEL:
      return DummyQuestion
    // case questionType.CODING:
    //   return Coding
    case questionType.UPLOAD_FILE:
      return UploadFile
    case questionType.PICTOGRAPH:
      return Pictograph
    default:
      return () => null
  }
}

const { TEACHER, SCHOOL_ADMIN, DISTRICT_ADMIN } = roleuser

class QuestionWrapper extends Component {
  constructor(props) {
    super(props)
    this.state = {
      main: [],
      advanced: [],
      extras: [],
      activeTab: 0,
      shuffledOptsOrder: [],
    }
  }

  /**
   * @see https://snapwiz.atlassian.net/browse/EV-34955
   * page data is required in ItemAudioControl component. Thus storing the page data in redux store
   */
  setPage = (page) => {
    const { setPassageCurrentPage, data: { id, type } = {} } = this.props
    if (id && type === questionType.PASSAGE) {
      setPassageCurrentPage({ passageId: id, page })
    }
  }

  handleShuffledOptions = (shuffledOptsOrder) => {
    this.setState({ shuffledOptsOrder })
  }

  fillSections = (section, label, el, sectionId) => {
    if (typeof el !== 'object') return
    this.setState((state) => {
      const sectionState = state[section]
      const found = sectionState.filter((block) => block.label === label)

      if (found.length) {
        // update of section offset in array
        return {
          [section]: sectionState.filter((block) => {
            if (block.label === label) {
              block.el = el
            }
            return block
          }),
        }
      }

      // push of section to array
      return {
        [section]: sectionState.concat({ section, label, el, sectionId }),
      }
    })
  }

  cleanSections = (sectionId) => {
    if (!sectionId) return
    this.setState(({ main }) => ({
      main: main.filter((item) => item.sectionId !== sectionId),
    }))
  }

  static getDerivedStateFromProps(props) {
    if (props.view !== EDIT) {
      return { main: [], advanced: [], extras: [], activeTab: 0 }
    }
    return null
  }

  /**
   * given a student id and a list ids which are tts users
   * @returns {boolean} whether current student is a tts user
   */
  get ttsVisibilityAuthorSide() {
    const {
      studentId,
      ttsUserIds = [],
      userRole,
      data,
      isTestPreviewModalVisible,
    } = this.props
    const key = data?.activity?.userId || studentId
    return (
      userRole !== roleuser.STUDENT &&
      (ttsUserIds.includes(key) || isTestPreviewModalVisible)
    )
  }

  shouldComponentUpdate(prevProps) {
    const {
      data: prevData,
      windowWidth: prevWindowWidth,
      windowHeight: prevWindowHeight,
      userWork: prevUserWork,
      hideCorrectAnswer: prevHideCorrectAnswer,
    } = prevProps
    const {
      data,
      isLCBView,
      isExpressGrader,
      windowWidth,
      windowHeight,
      userWork,
      hideCorrectAnswer,
    } = this.props

    if (
      isLCBView &&
      !isExpressGrader &&
      data?.activity &&
      isEqual(prevUserWork, userWork) &&
      isEqual(prevData, data) &&
      prevWindowHeight === windowHeight &&
      prevWindowWidth === windowWidth &&
      hideCorrectAnswer === prevHideCorrectAnswer
    ) {
      return false
    }
    return true
  }

  componentDidMount() {
    this.setPage(1)

    const {
      data: question,
      testItemDetail,
      testItemsInTest,
      setQuestionLevelScore,
      setItemLevelScore,
      match,
    } = this.props
    const {
      params: { testId, itemId },
      path,
    } = match

    if (!(testId && itemId && path.includes('/author/tests'))) return

    if (testItemsInTest.length && testItemDetail && question) {
      const matchingTestItem = testItemsInTest.find(
        ({ _id }) => _id === testItemDetail._id
      )

      if (!matchingTestItem) return

      const questions = matchingTestItem.data.questions || []

      const matchingQuestion = questions.find(({ id }) => id === question.id)

      if (matchingQuestion) {
        const score = matchingQuestion.validation.validResponse.score
        setQuestionLevelScore({ qid: question.id, score })
      }

      if (matchingTestItem.itemLevelScore) {
        setItemLevelScore(matchingTestItem.itemLevelScore)
      }
    }
  }

  openStudentWork = () => {
    const { data, loadScratchPad, showStudentWork } = this.props
    // load the data from server and then show
    loadScratchPad({
      testActivityId: data?.activity?.testActivityId,
      testItemId: data?.activity?.testItemId,
      qActId: data?.activity?.qActId || data?.activity?._id,
      callback: () => showStudentWork(),
    })
  }

  get advancedAreOpen() {
    const {
      userRole,
      features,
      isPremiumUser,
      isPowerTeacher,
      permissions,
    } = this.props

    const isDistrictAdmin =
      (userRole === TEACHER &&
        !features.isPublisherAuthor &&
        !features.isCurator) ||
      [DISTRICT_ADMIN, SCHOOL_ADMIN].includes(userRole)

    return (
      (isDistrictAdmin && isPowerTeacher && isPremiumUser) ||
      canUseAllOptionsByDefault(permissions, userRole)
    )
  }

  // we will use this method only for LCB and student report
  get renderData() {
    const { data, studentLanguagePreference } = this.props
    return changeDataToPreferredLanguage(data, studentLanguagePreference)
  }

  get answerScore() {
    const {
      previewScore,
      previewMaxScore,
      testPreviewScore,
      data,
      questions = {},
      multipartItem = false,
      itemLevelScoring = false,
    } = this.props
    let score = previewScore
    let maxScore = previewMaxScore
    let isGradedExternally = false
    if (data?.activity) {
      score = data?.activity?.score
      maxScore = data?.activity.maxScore
      isGradedExternally = data?.activity?.isGradedExternally
      /**
       * @see https://snapwiz.atlassian.net/browse/EV-28499
       * If itemLevelScoring is true score for other questions score is 0
       * Thus awarding a non-zero score to all other questions
       * so that correct responses are not marked wrong, if graded externally
       */
      if (
        isGradedExternally &&
        !isEmpty(questions) &&
        multipartItem &&
        itemLevelScoring
      ) {
        Object.values(questions).forEach((question) => {
          if (question?.activity?.maxScore) {
            score = Math.max(score, question?.activity?.score || 0)
            maxScore = Math.max(maxScore, question?.activity?.maxScore || 0)
          }
        })
      }
    }

    // testPreviewScore is from view as student
    //  {
    //    score: 1,
    //    maxScore: 2,
    //    isGradedExternally: false,
    //  }
    if (testPreviewScore && 'score' in testPreviewScore) {
      score = testPreviewScore.score
      maxScore = testPreviewScore.maxScore
      isGradedExternally = testPreviewScore.isGradedExternally
    }

    return {
      score: (score || 0) / (maxScore || 1),
      isGradedExternally,
      multipartItem,
      itemLevelScoring,
    }
  }

  // @see EV-25152 | need to display show rubric button in student attempt and test review modal
  get showRubricToStudentsButton() {
    const {
      assignmentLevelSettings: { showRubricToStudents = false } = {},
      isTestPreviewModalVisible = false,
      isTestDemoPlayer = false,
      userRole,
      view,
      testLevelSettings: {
        showRubricToStudents: testLevelShowRubricToStudents = false,
      } = {},
      data: { rubrics } = {},
      isPremiumUser,
    } = this.props

    // return if rubric is not attached to the question
    if (isEmpty(rubrics)) {
      return false
    }

    // if test is being viewed in 'view as student' or public test view
    if (
      (userRole === roleuser.TEACHER ||
        roleuser.DA_SA_ROLE_ARRAY.includes(userRole)) &&
      (isTestPreviewModalVisible || isTestDemoPlayer) &&
      isPremiumUser
    ) {
      return testLevelShowRubricToStudents
    }

    // if its a student attempt
    return (
      userRole === roleuser.STUDENT &&
      view === 'preview' &&
      showRubricToStudents
    )
  }

  get passageCurrentPage() {
    const {
      userInteractionsPassageData: passageInfo = {},
      data: { id } = {},
    } = this.props
    return passageInfo[id]?.currentPage || 1
  }

  render() {
    const {
      noPadding,
      isFlex,
      type,
      timespent,
      data: _originalData,
      showFeedback,
      multiple,
      view,
      changePreviewTab,
      qIndex,
      itemIndex,
      windowWidth,
      flowLayout,
      isPresentationMode,
      userRole,
      disableResponse,
      showStudentWork,
      showUserTTS,
      selectedTheme = 'default',
      isPrintPreview = false,
      evaluation,
      loadScratchPad,
      saveHintUsage,
      theme,
      isGrade,
      enableMagnifier,
      playerSkinType = test.playerSkinValues.edulastic,
      isPowerTeacher = false,
      isPremiumUser = false,
      features,
      isItemsVisible,
      permissions,
      questionNumber,
      isPremiumContentWithoutAccess,
      premiumCollectionWithoutAccess,
      showStacked,
      isExpandedView,
      t,
      ...restProps
    } = this.props

    const data = this.renderData

    const _isPowerTeacher =
      isPowerTeacher || canUseAllOptionsByDefault(permissions, userRole)
    const {
      isExpressGrader,
      isStudentReport,
      isLCBView,
      LCBPreviewModal,
      calculatedHeight,
      fullHeight,
      showBorder,
      borderRadius,
      hasDrawingResponse,
      previewTab,
      studentId,
      isQuestionView,
      isShowStudentWork,
      hideCorrectAnswer,
      isReviewTab,
      page: viewPage,
      assignmentLevelSettings: {
        showHintsToStudents = true,
        penaltyOnUsingHints = 0,
      },
    } = restProps

    const userAnswer = get(data, 'activity.userResponse', null)
    const isSkipped = get(data, 'activity.skipped', false)
    const timeSpent = get(data, 'activity.timeSpent', false)
    const { main, advanced, extras, activeTab } = this.state
    const page = this.passageCurrentPage

    const disabled =
      get(data, 'activity.disabled', false) || data.scoringDisabled
    const { layoutType } = this.context
    const isPassageOrVideoType = [
      questionType.PASSAGE,
      questionType.VIDEO,
      questionType.TEXT,
    ].includes(data.type)
    const Question =
      isExpressGrader && !isItemsVisible
        ? () => (
            <ItemInvisible
              qLabel={data.qLabel}
              showQuestionNumber={!isPassageOrVideoType && data.qLabel}
            />
          )
        : getQuestion(type)

    const isV1Multipart = get(this.props, 'col.isV1Multipart', false)
    const userAnswerProps = {}
    if (userAnswer && !isSkipped) {
      userAnswerProps.userAnswer = userAnswer
    }

    if (data.id) {
      /**
       * adding `key` forces the component to re-render when `id` changes.
       */
      userAnswerProps.key = data.id
    }

    const canShowPlayer =
      ((showUserTTS === 'yes' && userRole === roleuser.STUDENT) ||
        this.ttsVisibilityAuthorSide) &&
      data.tts &&
      data.tts.taskStatus === 'COMPLETED' &&
      playerSkinType !== test.playerSkinValues.quester

    /**
     * we need to render the tts buttons at author, if it was rendered at student side
     * however, need to hide the visibility, and not show it in ui
     * need to render it because scratchpad data gets displaced at LCB, EG
     * @see https://snapwiz.atlassian.net/browse/EV-18747
     */
    const hideVisibility =
      isLCBView ||
      isExpressGrader ||
      (userRole === 'teacher' && LCBPreviewModal)

    const studentReportFeedbackVisible =
      isStudentReport && !isPassageOrVideoType && !data.scoringDisabled

    const themeToPass = themes[selectedTheme] || themes.default
    // themeToPass = getZoomedTheme(themeToPass, zoomLevel);
    // themeToPass = playersZoomTheme(themeToPass);

    const showQuestionMenu =
      view === EDIT && windowWidth > parseInt(smallDesktopWidth, 10)

    const advancedLink =
      !this.advancedAreOpen && !showQuestionMenu && advanced.length > 0 ? (
        <AdvancedOptionsLink
          bottom
          isPremiumUser={isPremiumUser}
          isPowerTeacher={_isPowerTeacher}
        />
      ) : null

    const { rubrics: rubricDetails } = data
    const rubricFeedback = data?.activity?.rubricFeedback

    if (isPremiumContentWithoutAccess) {
      return (
        <PremiumItemBanner
          itemBankName={premiumCollectionWithoutAccess}
          showStacked={showStacked}
          data={data}
          isExpandedView={isExpandedView}
          isPrintPreview={isPrintPreview}
          timeSpent={timeSpent}
        />
      )
    }

    let passageRightSpace = {}
    if (
      data.type === questionType.PASSAGE &&
      playerSkinType === test.playerSkinValues.parcc &&
      canShowPlayer
    ) {
      // for not to overlap tts buttons in testNav skin
      passageRightSpace = {
        paddingRight: '60px',
      }
    }

    const answerScore = this.answerScore
    const showAnswerScore =
      isExpressGrader || isLCBView || isReviewTab || viewPage === 'review'

    return (
      <ThemeProvider
        theme={{
          ...themeToPass,
          fontSize:
            themeToPass.fontSize ||
            getFontSize(get(data, 'uiStyle.fontsize', 'normal')),
          isV1Migrated: data.isV1Migrated,
        }}
      >
        <>
          {canShowPlayer &&
            (!hideVisibility || isShowStudentWork) &&
            !isPrintPreview && (
              <AudioControls
                hideVisibility={hideVisibility && !isShowStudentWork}
                key={data.id}
                item={data}
                page={page}
                qId={data.id}
                audioSrc={data.tts.titleAudioURL}
                isPaginated={data.paginated_content}
                className="question-audio-controller"
                isStudentReport={isStudentReport}
              />
            )}
          <div
            className="__print-question-main-wrapper"
            style={{ height: !isStudentReport && '100%' }}
          >
            <QuestionContainer
              className={`fr-view question-container question-container-id-${data.testItemId}_${data.id}`}
              disabled={disabled}
              noPadding={noPadding}
              isFlex
              data-cy={
                isPassageOrVideoType ? 'passage-content' : 'question-container'
              }
              style={{
                width: '100%',
                height: calculatedHeight || (fullHeight ? '100%' : null),
                ...passageRightSpace,
              }}
            >
              {showQuestionMenu && (
                <QuestionMenuWrapper>
                  <QuestionMenu
                    activeTab={activeTab}
                    main={main}
                    advanced={advanced}
                    extras={extras}
                    advancedAreOpen={this.advancedAreOpen}
                    questionTitle={data?.title || ''}
                    isPremiumUser={isPremiumUser}
                    isPowerTeacher={_isPowerTeacher}
                  />
                </QuestionMenuWrapper>
              )}
              <PaperWrapper
                className="question-wrapper"
                disabled={disabled}
                isV1Multipart={isV1Multipart}
                isStudentReport={isStudentReport}
                isLCBView={isLCBView}
                LCBPreviewModal={LCBPreviewModal}
                borderRadius={isLCBView ? '10px' : borderRadius}
                style={{
                  width:
                    !isPrintPreview &&
                    `${
                      view === EDIT && showQuestionMenu && !disableResponse
                        ? 'calc(100% - 250px)'
                        : '100%'
                    }`,
                  maxWidth: isPrintPreview && 'calc(100% - 10px)',
                  display: 'flex',
                  boxShadow: 'none',
                  paddingRight: layoutType === COMPACT ? '100px' : null,
                  border: showBorder ? '1px solid #DADAE4' : null,
                }}
                flowLayout={
                  type === questionType.CODING && view === 'preview'
                    ? true
                    : flowLayout
                }
              >
                <StyledFlexContainer
                  showScroll={isLCBView || isExpressGrader}
                  flexDirection="column"
                  maxWidth="100%"
                >
                  {evaluation === 'pending' && (
                    <Tooltip title={t('component.pendingEvaluation.tooltip')}>
                      <EvaluationMessage>
                        {t('component.pendingEvaluation.text')}
                      </EvaluationMessage>
                    </Tooltip>
                  )}
                  <Question
                    {...restProps}
                    t={t}
                    item={data}
                    view={view}
                    evaluation={evaluation}
                    answerScore={answerScore}
                    changePreviewTab={changePreviewTab}
                    qIndex={qIndex}
                    advancedLink={advancedLink}
                    advancedAreOpen={this.advancedAreOpen}
                    cleanSections={this.cleanSections}
                    fillSections={this.fillSections}
                    showQuestionNumber={!isPassageOrVideoType && data.qLabel}
                    flowLayout={flowLayout}
                    disableResponse={disableResponse}
                    studentReport={studentReportFeedbackVisible}
                    isPrintPreview={isPrintPreview}
                    {...userAnswerProps}
                    page={page}
                    setPage={this.setPage}
                    showAnswerScore={showAnswerScore}
                  />
                  {showFeedback && !isPrintPreview && (
                    <BottomAction
                      view={view}
                      isStudentReport={isStudentReport}
                      hasShowStudentWork={!!showStudentWork}
                      onClickHandler={this.openStudentWork}
                      timeSpent={timeSpent}
                      item={data}
                      QuestionComp={Question}
                      advancedLink={advancedLink}
                      advancedAreOpen={this.advancedAreOpen}
                      hasDrawingResponse={hasDrawingResponse}
                      saveAnswer={restProps.saveAnswer}
                      fillSections={() => {}}
                      cleanSections={() => {}}
                      studentId={studentId}
                      t={t}
                      isLCBView={isLCBView}
                      isExpressGrader={isExpressGrader}
                      isQuestionView={isQuestionView}
                      previewTab={previewTab}
                      isPrintPreview={isPrintPreview}
                      isGrade={isGrade}
                      data={data}
                      enableMagnifier={enableMagnifier}
                      saveHintUsage={saveHintUsage}
                      isStudent={userRole === 'student'}
                      itemIndex={itemIndex}
                      hideCorrectAnswer={hideCorrectAnswer}
                      isGradedExternally={answerScore.isGradedExternally}
                    />
                  )}
                  {rubricDetails &&
                    studentReportFeedbackVisible &&
                    !isShowStudentWork && (
                      <RubricTableWrapper data-cy="rubricTable">
                        <FieldLabel className="rubric-title">
                          Graded Rubric
                        </FieldLabel>
                        <FieldLabel className="rubric-name">
                          {rubricDetails.name}
                        </FieldLabel>
                        <PreviewRubricTable
                          data={rubricDetails}
                          rubricFeedback={rubricFeedback}
                          isDisabled
                        />
                      </RubricTableWrapper>
                    )}
                  {view === 'preview' && !isPrintPreview && !showFeedback && (
                    <Hints
                      question={data}
                      enableMagnifier={enableMagnifier}
                      saveHintUsage={saveHintUsage}
                      isStudent={userRole === 'student'}
                      itemIndex={itemIndex}
                      isLCBView={isLCBView}
                      isExpressGrader={isExpressGrader}
                      isStudentReport={isStudentReport}
                      displayRubricInfoButton={this.showRubricToStudentsButton}
                      rubricDetails={rubricDetails}
                      showHintsToStudents={showHintsToStudents}
                      penaltyOnUsingHints={penaltyOnUsingHints}
                    />
                  )}
                </StyledFlexContainer>
              </PaperWrapper>
            </QuestionContainer>
          </div>
        </>
      </ThemeProvider>
    )
  }
}

QuestionWrapper.contextType = ItemDetailContext

QuestionWrapper.propTypes = {
  isPresentationMode: PropTypes.bool,
  view: PropTypes.string.isRequired,
  multiple: PropTypes.bool,
  showFeedback: PropTypes.bool,
  type: PropTypes.any,
  isNew: PropTypes.bool,
  data: PropTypes.object,
  saveClicked: PropTypes.bool,
  testItem: PropTypes.bool,
  noPadding: PropTypes.bool,
  changePreviewTab: PropTypes.any,
  isFlex: PropTypes.bool,
  timespent: PropTypes.string,
  qIndex: PropTypes.number,
  windowWidth: PropTypes.number.isRequired,
  flowLayout: PropTypes.bool,
  userRole: PropTypes.string.isRequired,
  disableResponse: PropTypes.bool,
  clearAnswers: PropTypes.func,
  saveHintUsage: PropTypes.func,
  LCBPreviewModal: PropTypes.any,
  permissions: PropTypes.array,
  isTestDemoPlayer: PropTypes.bool,
  t: PropTypes.func,
}

QuestionWrapper.defaultProps = {
  isNew: false,
  type: null,
  data: {},
  saveClicked: false,
  testItem: false,
  noPadding: false,
  isFlex: false,
  timespent: '',
  multiple: false,
  LCBPreviewModal: false,
  showFeedback: false,
  qIndex: 0,
  clearAnswers: () => {},
  changePreviewTab: () => {},
  flowLayout: false,
  saveHintUsage: () => {},
  disableResponse: false,
  isPresentationMode: false,
  permissions: [],
  isTestDemoPlayer: false,
  t: () => {},
}

const enhance = compose(
  React.memo,
  withWindowSizes,
  withAnswerSave,
  withTheme,
  withNamespaces('assessment'),
  connect(
    (state, ownProps) => ({
      isPresentationMode: get(
        state,
        ['author_classboard_testActivity', 'presentationMode'],
        false
      ),
      showUserTTS: get(state, 'user.user.tts', 'no'),
      selectedTheme: state.ui.selectedTheme,
      zoomLevel: state.ui.zoomLevel,
      userRole: getUserRole(state),
      enableMagnifier: state.testPlayer.enableMagnifier,
      playerSkinType: playerSkinTypeSelector(state),
      isPowerTeacher: get(state, ['user', 'user', 'isPowerTeacher'], false),
      isPremiumUser: get(state, ['user', 'user', 'features', 'premium'], false),
      permissions: get(state, 'user.user.permissions', []),
      features: getUserFeatures(state),
      isItemsVisible: isItemVisibiltySelector(state),
      ttsUserIds: ttsUserIdSelector(state),
      studentLanguagePreference: languagePreferenceSelector(state, ownProps),
      authLanguage: getCurrentLanguage(state),
      isTestPreviewModalVisible: getIsPreviewModalVisibleSelector(state),
      previewScore: state?.itemScore?.score, // this used only in the author preview
      previewMaxScore: state?.itemScore?.maxScore, // this used only in the author preview
      assignmentLevelSettings: assignmentLevelSettingsSelector(state),
      testLevelSettings: get(state, ['test', 'settings'], {}),
      userInteractionsPassageData: get(
        state,
        ['userInteractions', 'passages'],
        {}
      ),
      testItemsInTest:
        get(state, 'tests.entity.itemGroups', []).flatMap(
          (itemGroup) => itemGroup.items || []
        ) || [],
      testItemDetail: get(state, 'itemDetail.item', {}),
    }),
    {
      loadScratchPad: requestScratchPadAction,
      setPassageCurrentPage: setPassageCurrentPageAction,
      setQuestionLevelScore: setQuestionScoreAction,
      setItemLevelScore: setItemLevelScoreAction,
    }
  )
)

export default enhance(QuestionWrapper)

const StyledFlexContainer = styled(FlexContainer)`
  font-size: ${(props) => props.theme.fontSize};
  overflow: ${({ showScroll }) => showScroll && 'auto'};
  width: 100%;
`

const QuestionMenuWrapper = styled.div`
  position: relative;
  width: 250px;

  @media (max-width: ${smallDesktopWidth}) {
    display: none;
  }
`

const RubricTableWrapper = styled.div`
  border: 1px solid ${borderGrey2};
  border-radius: 10px;
  margin-top: 10px;
  padding: 10px 10px 0px;

  .rubric-title {
    font-size: ${(props) => props.theme.titleSectionFontSize};
    font-weight: ${(props) => props.theme.semiBold};
    margin: 0px 16px 10px;
  }
  .rubric-name {
    font-size: ${(props) => props.theme.standardFont};
    margin: 0px 42px 10px;
  }
`

const QuestionContainer = styled.div`
  padding: ${({ noPadding }) => (noPadding ? '0px' : null)};
  display: ${({ isFlex }) => (isFlex ? 'flex' : 'block')};
  justify-content: space-between;
  ${({ style }) => style};
  @media (max-width: ${mobileWidthMax}) {
    flex-direction: column;
  }
  .ql-indent-1:not(.ql-direction-rtl) {
    padding-left: 3em;
  }
  .ql-indent-1.ql-direction-rtl.ql-align-right {
    padding-right: 3em;
  }
  .ql-indent-2:not(.ql-direction-rtl) {
    padding-left: 6em;
  }
  .ql-indent-2.ql-direction-rtl.ql-align-right {
    padding-right: 6em;
  }
  .ql-indent-3:not(.ql-direction-rtl) {
    padding-left: 9em;
  }
  .ql-indent-3.ql-direction-rtl.ql-align-right {
    padding-right: 9em;
  }
  .ql-indent-4:not(.ql-direction-rtl) {
    padding-left: 12em;
  }
  .ql-indent-4.ql-direction-rtl.ql-align-right {
    padding-right: 12em;
  }
  .ql-indent-5:not(.ql-direction-rtl) {
    padding-left: 15em;
  }
  .ql-indent-5.ql-direction-rtl.ql-align-right {
    padding-right: 15em;
  }
  .ql-indent-6:not(.ql-direction-rtl) {
    padding-left: 18em;
  }
  .ql-indent-6.ql-direction-rtl.ql-align-right {
    padding-right: 18em;
  }
  .ql-indent-7:not(.ql-direction-rtl) {
    padding-left: 21em;
  }
  .ql-indent-7.ql-direction-rtl.ql-align-right {
    padding-right: 21em;
  }
  .ql-indent-8:not(.ql-direction-rtl) {
    padding-left: 24em;
  }
  .ql-indent-8.ql-direction-rtl.ql-align-right {
    padding-right: 24em;
  }
  .ql-indent-9:not(.ql-direction-rtl) {
    padding-left: 27em;
  }
  .ql-indent-9.ql-direction-rtl.ql-align-right {
    padding-right: 27em;
  }

  .print-preview-feedback {
    width: 100%;
    padding: 0 35px;
  }

  /**
   * @see https://snapwiz.atlassian.net/browse/EV-21030
   * zwibbler canvas has z-index 999
   */
  .fr-video {
    z-index: 1000;
  }

  @media print {
    .__print_question-content-wrapper {
      max-width: calc(100% - 55px);
      display: block !important;
      position: relative !important;
      /**
       * @see https://snapwiz.atlassian.net/browse/EV-30606
       */
      .katex .halfarrow-left,
      .katex .halfarrow-right {
        overflow: hidden !important;
      }
    }
    .question-wrapper {
      padding: 5px;
    }
    .__print-question-option {
      margin-top: 20px !important;
    }
    .__print-question-main-wrapper {
      display: inline-table;
      width: 100%;
    }
    .__print-space-reduce {
      &-qlabel {
        margin-right: 0.5rem !important;
        margin-bottom: 0.5rem !important;
      }
      &-option {
        align-items: flex-start !important;
      }
      &-options {
        margin-bottom: 0px !important;
        label {
          padding: 0 !important;
        }
      }
      &-stimulus {
        margin-bottom: 5px !important;
        & p {
          br {
            display: none !important;
          }
        }
      }
    }
  }
`

export const EvaluationMessage = styled.div`
  color: rgb(250, 135, 52);
  width: 100%;
  text-align: center;
`

const getPadding = ({
  flowLayout,
  isV1Multipart,
  isStudentReport,
  isLCBView,
}) => {
  // use the same padding for top, bottom, and left in everywhere,
  // so we wil render scratchpad data in the same position
  if (flowLayout) {
    return '8px 0px'
  }
  if (isV1Multipart) {
    return '8px 35px'
  }
  if (isStudentReport) {
    return '8px 16px'
  }
  if (isLCBView) {
    return '8px 28px 8px'
  }
  return '8px 16px'
}

export const PaperWrapper = styled(StyledPaperWrapper)`
  padding: ${getPadding};
  min-width: ${({ style }) => style.minWidth};
  ${({ style }) => style};

  @media (max-width: ${mobileWidthMax}) {
    padding: ${({ flowLayout }) => (flowLayout ? '0px' : '8px')};
    margin-bottom: 15px;
  }
`
