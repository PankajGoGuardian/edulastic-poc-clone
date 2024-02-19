import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ThemeProvider, withTheme } from 'styled-components'
import { questionType, test, roleuser } from '@edulastic/constants'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { get, isEqual, isEmpty } from 'lodash'
import { Tooltip } from 'antd'
import { withNamespaces } from '@edulastic/localization'
import { smallDesktopWidth } from '@edulastic/colors'
import {
  withWindowSizes,
  ItemDetailContext,
  COMPACT,
  FieldLabel,
  PremiumItemBanner,
  EduIf,
  FlexContainer,
} from '@edulastic/common'
import { AI_EVALUATION_STATUS } from '@edulastic/constants/const/evaluationType'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { themes } from '../../theme'
import QuestionMenu, { AdvancedOptionsLink } from './QuestionMenu'
import { questionTypeToComponent } from '../utils/questionTypeComponent'

import withAnswerSave from './HOC/withAnswerSave'
import { requestScratchPadAction } from '../../author/ExpressGrader/ducks'
import { setPassageCurrentPageAction } from '../actions/userInteractions'
import { getUserRole, getUserFeatures } from '../../author/src/selectors/user'
import AudioControls from '../AudioControls'

import PreviewRubricTable from '../../author/GradingRubric/Components/common/PreviewRubricTable'

import Hints from './Hints'
import {
  EDIT,
  sttEnabledQuestionTypes,
} from '../constants/constantsForQuestions'
import BottomAction from './Common/QuestionBottomAction'
import {
  getIsPreviewModalVisibleSelector,
  playerSkinTypeSelector,
} from '../selectors/test'
import { assignmentLevelSettingsSelector } from '../selectors/answers'
import {
  isItemVisibiltySelector,
  ttsUserIdSelector,
  getIsVideoQuizSelector,
} from '../../author/ClassBoard/ducks'
import ItemInvisible from '../../author/ExpressGrader/components/Question/ItemInvisible'
import { canUseAllOptionsByDefault } from '../../common/utils/helpers'
import { getFontSize, isSpeechToTextEnabled } from '../utils/helpers'
import { changeDataToPreferredLanguage } from '../utils/question'
import {
  languagePreferenceSelector,
  getCurrentLanguage,
} from '../../common/components/LanguageSelectorTab/duck'
import ImmersiveReaderWrapper from './ImmersiveReadeWrapper'
import {
  StyledFlexContainer,
  QuestionMenuWrapper,
  RubricTableWrapper,
  QuestionContainer,
  EvaluationMessage,
  AiEvaluationWrapper,
  AiEvaluationMessage,
  ManualEvaluationMessage,
  PaperWrapper,
} from '../styled/QuestionWrapperStyledComponents'
import {
  getAccommodationsTtsSelector,
  getUserAccommodations,
} from '../../student/Login/ducks'

const getQuestion = (type) =>
  questionTypeToComponent[type] || questionTypeToComponent.default

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
  }

  openStudentWork = () => {
    const { data, loadScratchPad, showStudentWork, isVideoQuiz } = this.props
    // load the data from server and then show
    loadScratchPad({
      testActivityId: data?.activity?.testActivityId,
      testItemId: data?.activity?.testItemId,
      qActId: data?.activity?.qActId || data?.activity?._id,
      isVideoQuiz,
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
    const { data, studentLanguagePreference, view } = this.props
    return changeDataToPreferredLanguage(data, studentLanguagePreference, view)
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

  get isSpeechToTextAllowed() {
    const {
      viewAsStudent,
      assignmentLevelSettings: {
        showSpeechToText: assignmentLevelShowSpeechToText,
      } = {},
      isTestPreviewModalVisible = false,
      isTestDemoPlayer = false,
      userRole,
      testLevelSettings: { showSpeechToText: testLevelShowSpeechToText } = {},
      isPremiumUser,
      accommodations,
      type: qType,
    } = this.props

    if (!sttEnabledQuestionTypes.includes(qType)) {
      return false
    }

    const isTestPreview =
      viewAsStudent || isTestDemoPlayer || isTestPreviewModalVisible

    if (userRole === roleuser.STUDENT) {
      return isSpeechToTextEnabled(
        assignmentLevelShowSpeechToText,
        accommodations
      )
    }

    if (isTestPreview) {
      return testLevelShowSpeechToText
    }

    return isPremiumUser
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
      t: translate,
      aiEvaluationStatus,
      authLanguage,
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
        showHintsToStudents: showHintsToStudentsAssignmentLevel = true,
        penaltyOnUsingHints: penaltyOnUsingHintsAssignmentLevel = 0,
        showTtsForPassages: showTtsForPassagesAssignmentLevel = true,
      },
      testLevelSettings: {
        showHintsToStudents: showHintsToStudentsTest = true,
        penaltyOnUsingHints: penaltyOnUsingHintsTest = 0,
        showTtsForPassages: showTtsForPassagesTest = true,
      },
      classLevelSettings,
      viewAsStudent,
    } = restProps

    const showHintsToStudents = viewAsStudent
      ? showHintsToStudentsTest
      : typeof classLevelSettings?.showHintsToStudents === 'boolean'
      ? classLevelSettings.showHintsToStudents
      : showHintsToStudentsAssignmentLevel

    const penaltyOnUsingHints = viewAsStudent
      ? penaltyOnUsingHintsTest
      : typeof classLevelSettings?.penaltyOnUsingHints === 'number'
      ? classLevelSettings.penaltyOnUsingHints
      : penaltyOnUsingHintsAssignmentLevel

    const showTtsForPassages = viewAsStudent
      ? showTtsForPassagesTest
      : typeof classLevelSettings?.showTtsForPassages === 'boolean'
      ? classLevelSettings.showTtsForPassages
      : showTtsForPassagesAssignmentLevel

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

    // EV-36516 | if showTtsForPassages is false hide tts for passage
    const showPlayerForPassage =
      !isStudentReport &&
      (data.type === questionType.PASSAGE || data.type === questionType.VIDEO)
        ? showTtsForPassages
        : true

    const canShowPlayer =
      ((showUserTTS === 'yes' && userRole === roleuser.STUDENT) ||
        this.ttsVisibilityAuthorSide) &&
      data.tts &&
      data.tts.taskStatus === 'COMPLETED' &&
      playerSkinType !== test.playerSkinValues.quester &&
      showPlayerForPassage

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

    const aiEvaluationMsg = {
      [AI_EVALUATION_STATUS.PENDING]: {
        text: translate('component.aiEvaluationStatus.pending.text'),
        tooltip: translate('component.aiEvaluationStatus.pending.tooltip'),
      },
      [AI_EVALUATION_STATUS.FAILED]: {
        text: translate('component.aiEvaluationStatus.failed.text'),
        tooltip: translate('component.aiEvaluationStatus.failed.tooltip'),
      },
      [AI_EVALUATION_STATUS.DONE]: {
        text: translate('component.aiEvaluationStatus.done.text'),
        tooltip: translate('component.aiEvaluationStatus.done.tooltip'),
      },
    }

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
                    <Tooltip
                      title={translate('component.pendingEvaluation.tooltip')}
                    >
                      <EvaluationMessage>
                        {translate('component.pendingEvaluation.text')}
                      </EvaluationMessage>
                    </Tooltip>
                  )}
                  <EduIf
                    condition={
                      aiEvaluationStatus &&
                      !aiEvaluationStatus?.isGradedExternally
                    }
                  >
                    <FlexContainer>
                      <AiEvaluationWrapper
                        aiEvaluationStatus={aiEvaluationStatus?.status}
                      >
                        <Tooltip
                          title={
                            aiEvaluationMsg[aiEvaluationStatus?.status]?.tooltip
                          }
                        >
                          <AiEvaluationMessage>
                            {aiEvaluationMsg[aiEvaluationStatus?.status]?.text}
                          </AiEvaluationMessage>
                        </Tooltip>
                      </AiEvaluationWrapper>
                      <Tooltip title={translate('author:rubric.infoText')}>
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          aria-hidden="true"
                          style={{
                            color: 'black',
                            fontSize: '25px',
                            marginLeft: '10px',
                          }}
                        />
                      </Tooltip>
                    </FlexContainer>
                    <EduIf
                      condition={
                        aiEvaluationStatus?.status ===
                        AI_EVALUATION_STATUS.FAILED
                      }
                    >
                      <ManualEvaluationMessage>
                        {translate('component.manualEvaluationNeeded.text')}
                      </ManualEvaluationMessage>
                    </EduIf>
                  </EduIf>
                  <ImmersiveReaderWrapper>
                    <Question
                      {...restProps}
                      t={translate}
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
                      isDefaultTheme={selectedTheme === 'default'}
                      isSpeechToTextEnabled={this.isSpeechToTextAllowed}
                    />
                  </ImmersiveReaderWrapper>

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
                      t={translate}
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
                      viewAsStudent={viewAsStudent}
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
  withNamespaces(['assessment', 'author']),
  connect(
    (state, ownProps) => ({
      isPresentationMode: get(
        state,
        ['author_classboard_testActivity', 'presentationMode'],
        false
      ),
      showUserTTS: getAccommodationsTtsSelector(state),
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
      isVideoQuiz: getIsVideoQuizSelector(state),
      accommodations: getUserAccommodations(state),
    }),
    {
      loadScratchPad: requestScratchPadAction,
      setPassageCurrentPage: setPassageCurrentPageAction,
    }
  )
)

export default enhance(QuestionWrapper)
