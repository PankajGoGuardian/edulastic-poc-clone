/* eslint-disable react/prop-types */
import React, { Component } from "react";
import PropTypes from "prop-types";
import styled, { ThemeProvider, withTheme } from "styled-components";
import { questionType, test, roleuser } from "@edulastic/constants";
import { connect } from "react-redux";
import { compose } from "redux";
import { get, round } from "lodash";
import { IconClockCircularOutline } from "@edulastic/icons";

import { withNamespaces } from "@edulastic/localization";
import { mobileWidthMax, smallDesktopWidth, borderGrey2 } from "@edulastic/colors";
import { withWindowSizes, ItemDetailContext, COMPACT } from "@edulastic/common";
import { PaperWrapper } from "./Graph/common/styled_components";
import { themes } from "../../theme";
import QuestionMenu, { AdvancedOptionsLink } from "./QuestionMenu";

import { OrderList } from "../widgets/OrderList";
import { SortList } from "../widgets/SortList";
import { MatchList } from "../widgets/MatchList";
import { Classification } from "../widgets/Classification";
import { MultipleChoice } from "../widgets/MultipleChoice";
import { ClozeDragDrop } from "../widgets/ClozeDragDrop";
import { ClozeImageDragDrop } from "../widgets/ClozeImageDragDrop";
import { ClozeImageDropDown } from "../widgets/ClozeImageDropDown";
import { ClozeImageText } from "../widgets/ClozeImageText";
import { ClozeEditingTask } from "../widgets/ClozeEditingTask";
import { Graph } from "./Graph";
import { ClozeDropDown } from "../widgets/ClozeDropDown";
import { ClozeText } from "../widgets/ClozeText";
import { ShortText } from "../widgets/ShortText";
import { TokenHighlight } from "../widgets/TokenHighlight";
import { Shading } from "../widgets/Shading";
import { Hotspot } from "../widgets/Hotspot";
import { HighlightImage } from "../widgets/HighlightImage";
import { Drawing } from "./Drawing";
import { EssayPlainText } from "../widgets/EssayPlainText";
import { EssayRichText } from "../widgets/EssayRichText";
import FractionEditor from "../widgets/FractionEditor";

import withAnswerSave from "./HOC/withAnswerSave";
import { MatrixChoice } from "../widgets/MatrixChoice";
import { Protractor } from "../widgets/Protractor";
import { Passage } from "../widgets/Passage";
import { Video } from "../widgets/Video";
import { Text } from "../widgets/Text";
import { MathFormula } from "../widgets/MathFormula";
import { FormulaEssay } from "../widgets/FormulaEssay";
import ClozeMath from "../widgets/ClozeMath";
import { setQuestionDataAction } from "../../author/src/actions/question";
import { requestScratchPadAction } from "../../author/ExpressGrader/ducks";
import { toggleAdvancedSections } from "../actions/questions";
import { Chart } from "../widgets/Charts";
import { getUserRole, getUserFeatures } from "../../author/src/selectors/user";
import AudioControls from "../AudioControls";

import { getFontSize } from "../utils/helpers";
import PreviewRubricTable from "../../author/GradingRubric/Components/common/PreviewRubricTable";
import { Coding } from "../widgets/Coding";

import Hints from "./Hints";
import Explanation from "./Common/Explanation";
import { EDIT } from "../constants/constantsForQuestions";
import ShowUserWork from "./Common/ShowUserWork";
import { playerSkinTypeSelector } from "../selectors/test";
import { isItemVisibiltySelector } from "../../author/ClassBoard/ducks";
import ItemInvisible from "../../author/ExpressGrader/components/Question/ItemInvisible";

const QuestionContainer = styled.div`
  padding: ${({ noPadding }) => (noPadding ? "0px" : null)};
  display: ${({ isFlex }) => (isFlex ? "flex" : "block")};
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

  @media print {
    .__print_question-content-wrapper {
      max-width: calc(100% - 55px);
      display: block !important;
      position: relative !important;
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
`;

export const TimeSpentWrapper = styled.p`
  font-size: 19px;
  color: grey;
  display: flex;
  justify-content: flex-end;
  margin-top: auto;
  align-items: center;
  padding-top: 10px;
  &.student-report {
    position: absolute;
    top: 25px;
    right: 0px;
    background: #f3f3f3;
    padding: 10px 15px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    svg {
      margin-right: 10px;
      fill: #6a737f;
    }
  }
  i {
    padding-right: 15px;
  }
`;

export const FlexContainer = styled.div`
  flex: auto;
  display: flex;
  flex-direction: column;
  max-width: 100%;
`;

export const EvaluationMessage = styled.div`
  color: rgb(250, 135, 52);
  width: 100%;
  text-align: center;
`;

const DummyQuestion = () => <></>;

const getQuestion = type => {
  switch (type) {
    case questionType.LINE_PLOT:
    case questionType.DOT_PLOT:
    case questionType.HISTOGRAM:
    case questionType.LINE_CHART:
    case questionType.BAR_CHART:
      return Chart;
    case questionType.DRAWING:
      return Drawing;
    case questionType.HIGHLIGHT_IMAGE:
      return HighlightImage;
    case questionType.SHADING:
      return Shading;
    case questionType.HOTSPOT:
      return Hotspot;
    case questionType.TOKEN_HIGHLIGHT:
      return TokenHighlight;
    case questionType.SHORT_TEXT:
      return ShortText;
    case questionType.ESSAY_PLAIN_TEXT:
      return EssayPlainText;
    case questionType.ESSAY_RICH_TEXT:
      return EssayRichText;
    case questionType.MULTIPLE_CHOICE:
      return MultipleChoice;
    case questionType.CHOICE_MATRIX:
      return MatrixChoice;
    case questionType.SORT_LIST:
      return SortList;
    case questionType.CLASSIFICATION:
      return Classification;
    case questionType.MATCH_LIST:
      return MatchList;
    case questionType.ORDER_LIST:
      return OrderList;
    case questionType.CLOZE_DRAG_DROP:
      return ClozeDragDrop;
    case questionType.CLOZE_IMAGE_DRAG_DROP:
      return ClozeImageDragDrop;
    case questionType.PROTRACTOR:
      return Protractor;
    case questionType.CLOZE_IMAGE_DROP_DOWN:
      return ClozeImageDropDown;
    case questionType.CLOZE_IMAGE_TEXT:
      return ClozeImageText;
    case questionType.CLOZE_DROP_DOWN:
      return ClozeDropDown;
    case questionType.CLOZE_TEXT:
      return ClozeText;
    case questionType.EDITING_TASK:
      return ClozeEditingTask;
    case questionType.PASSAGE:
      return Passage;
    case questionType.VIDEO:
      return Video;
    case questionType.TEXT:
      return Text;
    case questionType.MATH:
      return MathFormula;
    case questionType.FORMULA_ESSAY:
      return FormulaEssay;
    case questionType.CLOZE_MATH:
    case questionType.EXPRESSION_MULTIPART:
      return ClozeMath;
    case questionType.GRAPH:
      return Graph;
    case questionType.FRACTION_EDITOR:
      return FractionEditor;
    case questionType.SECTION_LABEL:
      return DummyQuestion;
    case questionType.CODING:
      return Coding;
    default:
      return null;
  }
};

const { TEACHER, SCHOOL_ADMIN, DISTRICT_ADMIN } = roleuser;

class QuestionWrapper extends Component {
  static contextType = ItemDetailContext;

  state = {
    main: [],
    advanced: [],
    activeTab: 0,
    shuffledOptsOrder: [],
    page: 1
  };

  setPage = page => this.setState({ page });

  handleShuffledOptions = shuffledOptsOrder => {
    this.setState({ shuffledOptsOrder });
  };

  fillSections = (section, label, el, sectionId) => {
    if (typeof el !== "object") return;
    this.setState(state => {
      const sectionState = state[section];
      const found = sectionState.filter(block => block.label === label);

      if (found.length) {
        // update of section offset in array
        return {
          [section]: sectionState.filter(block => {
            if (block.label === label) {
              block.el = el;
            }
            return block;
          })
        };
      }

      // push of section to array
      return {
        [section]: sectionState.concat({ section, label, el, sectionId })
      };
    });
  };

  cleanSections = sectionId => {
    if (!sectionId) return;
    this.setState(({ main }) => ({ main: main.filter(item => item.sectionId !== sectionId) }));
  };

  static getDerivedStateFromProps(props) {
    if (props.view !== EDIT) {
      return { main: [], advanced: [], activeTab: 0 };
    }
    return null;
  }

  render() {
    const {
      noPadding,
      isFlex,
      type,
      timespent,
      data,
      showFeedback,
      multiple,
      view,
      setQuestionData,
      changePreviewTab,
      qIndex,
      itemIndex,
      windowWidth,
      flowLayout,
      isPresentationMode,
      handleAdvancedOpen,
      advancedAreOpen,
      userRole,
      disableResponse,
      isStudentReport,
      showStudentWork,
      LCBPreviewModal,
      showUserTTS,
      selectedTheme = "default",
      isPrintPreview = false,
      evaluation,
      scrollContainer,
      loadScratchPad,
      isQuestionView,
      isExpressGrader,
      saveHintUsage,
      theme,
      isLCBView,
      isGrade,
      enableMagnifier,
      playerSkinType = test.playerSkinValues.edulastic,
      isPowerTeacher = false,
      isPremiumUser = false,
      features,
      isItemsVisible,
      ...restProps
    } = this.props;
    const userAnswer = get(data, "activity.userResponse", null);
    const timeSpent = get(data, "activity.timeSpent", false);
    const { main, advanced, activeTab, page } = this.state;
    const disabled = get(data, "activity.disabled", false) || data.scoringDisabled;
    const { layoutType } = this.context;
    const isPassageOrVideoType = [questionType.PASSAGE, questionType.VIDEO, questionType.TEXT].includes(data.type);
    const Question =
      isExpressGrader && !isItemsVisible
        ? () => <ItemInvisible qLabel={data.qLabel} showQuestionNumber={!isPassageOrVideoType && data.qLabel} />
        : getQuestion(type);

    const isV1Multipart = get(this.props, "col.isV1Multipart", false);
    const userAnswerProps = {};
    if (userAnswer) {
      userAnswerProps.userAnswer = userAnswer;
    }

    if (data.id) {
      /**
       * adding `key` forces the component to re-render when `id` changes.
       */
      userAnswerProps.key = data.id;
    }
    const canShowPlayer =
      ((showUserTTS === "yes" && userRole === "student") || (userRole === "teacher" && !!LCBPreviewModal)) &&
      data.tts &&
      data.tts.taskStatus === "COMPLETED";

    const showAudioControls = userRole === "teacher" && !!LCBPreviewModal;

    const studentReportFeedbackVisible = isStudentReport && !isPassageOrVideoType && !data.scoringDisabled;

    const themeToPass = themes[selectedTheme] || themes.default;
    // themeToPass = getZoomedTheme(themeToPass, zoomLevel);
    // themeToPass = playersZoomTheme(themeToPass);

    const showQuestionMenu = windowWidth > parseInt(smallDesktopWidth, 10);

    const advancedLink =
      !showQuestionMenu && advanced.length > 0 ? (
        <AdvancedOptionsLink handleAdvancedOpen={handleAdvancedOpen} advancedAreOpen={advancedAreOpen} bottom />
      ) : null;

    const { rubrics: rubricDetails } = data;
    const rubricFeedback = data?.activity?.rubricFeedback;

    const { calculatedHeight, fullHeight } = restProps;
    let openAdvancedOptions = false;

    if (
      (userRole === TEACHER && !features.isPublisherAuthor && !features.isCurator) ||
      [DISTRICT_ADMIN, SCHOOL_ADMIN].includes(userRole)
    ) {
      openAdvancedOptions = true;
      if (isPremiumUser && isPowerTeacher) {
        openAdvancedOptions = false;
      }
    }

    return (
      <ThemeProvider
        theme={{
          ...themeToPass,
          fontSize: themeToPass.fontSize || getFontSize(get(data, "uiStyle.fontsize", "normal")),
          isV1Migrated: data.isV1Migrated
        }}
      >
        <>
          {canShowPlayer ? (
            <AudioControls
              btnWithText={playerSkinType.toLowerCase() === test.playerSkinValues.edulastic.toLowerCase()}
              showAudioControls={showAudioControls}
              key={data.id}
              item={data}
              page={page}
              qId={data.id}
              audioSrc={data.tts.titleAudioURL}
              isPaginated={data.paginated_content}
              className="question-audio-controller"
            />
          ) : (
            ""
          )}
          <div className="__print-question-main-wrapper">
            <QuestionContainer
              className={`fr-view question-container question-container-id-${data.id}`}
              disabled={disabled}
              noPadding={noPadding}
              isFlex
              data-cy="question-container"
              style={{ width: "100%", height: calculatedHeight || (fullHeight ? "100%" : null) }}
            >
              {view === EDIT && showQuestionMenu && (
                <QuestionMenuWrapper>
                  <QuestionMenu
                    activeTab={activeTab}
                    main={main}
                    advanced={advanced}
                    advancedAreOpen={openAdvancedOptions || advancedAreOpen}
                    handleAdvancedOpen={handleAdvancedOpen}
                    scrollContainer={scrollContainer}
                    questionTitle={data?.title || ""}
                    hideAdvancedToggleOption={openAdvancedOptions}
                  />
                </QuestionMenuWrapper>
              )}
              <PaperWrapper
                className="question-wrapper"
                disabled={disabled}
                isV1Multipart={isV1Multipart}
                isStudentReport={isStudentReport}
                borderRadius={isLCBView ? "10px" : restProps.borderRadius}
                style={{
                  width:
                    !isPrintPreview &&
                    `${view === EDIT && showQuestionMenu && !disableResponse ? "calc(100% - 250px)" : "100%"}`,
                  maxWidth: isPrintPreview && "calc(100% - 10px)",
                  display: "flex",
                  boxShadow: "none",
                  paddingRight: layoutType === COMPACT ? "100px" : null,
                  border: isLCBView && !restProps.showScratchpadByDefault ? "1px solid #DADAE4" : null
                }}
                flowLayout={type === questionType.CODING && view === "preview" ? true : flowLayout}
              >
                <StyledFlexContainer showScroll={isLCBView || isExpressGrader}>
                  {evaluation === "pending" && <EvaluationMessage> Evaluation is pending </EvaluationMessage>}
                  <Question
                    {...restProps}
                    setQuestionData={setQuestionData}
                    item={data}
                    view={view}
                    evaluation={evaluation}
                    changePreviewTab={changePreviewTab}
                    qIndex={qIndex}
                    advancedLink={advancedLink}
                    advancedAreOpen={openAdvancedOptions || advancedAreOpen}
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
                  />
                  {!restProps.viewAtStudentRes && showFeedback && !isPrintPreview && (
                    <>
                      <TimeSpentWrapper className={isStudentReport ? "student-report" : ""}>
                        {!!showStudentWork && (
                          <ShowUserWork
                            style={{ marginRight: "1rem" }}
                            onClickHandler={() => {
                              // load the data from server and then show
                              loadScratchPad({
                                testActivityId: data.activity.testActivityId,
                                testItemId: data.activity.testItemId,
                                qActId: data.activity.qActId || data.activity._id,
                                callback: () => showStudentWork()
                              });
                            }}
                          >
                            Show student work
                          </ShowUserWork>
                        )}
                        {timeSpent && (
                          <>
                            <IconClockCircularOutline />
                            {round(timeSpent / 1000, 1)}s
                          </>
                        )}
                      </TimeSpentWrapper>
                    </>
                  )}
                  {rubricDetails && studentReportFeedbackVisible && (
                    <RubricTableWrapper>
                      <span>Graded Rubric</span>
                      <PreviewRubricTable data={rubricDetails} rubricFeedback={rubricFeedback} isDisabled />
                    </RubricTableWrapper>
                  )}
                  {view === "preview" && !isPrintPreview && (
                    <Hints
                      question={data}
                      enableMagnifier={enableMagnifier}
                      saveHintUsage={saveHintUsage}
                      isStudent={userRole === "student"}
                      itemIndex={itemIndex}
                      isLCBView={isLCBView}
                      isExpressGrader={isExpressGrader}
                      isStudentReport={isStudentReport}
                    />
                  )}
                  {(isGrade || isLCBView || isExpressGrader || restProps.previewTab === "show") && (
                    <Explanation isStudentReport={isStudentReport} question={data} isGrade={isGrade} />
                  )}
                </StyledFlexContainer>
              </PaperWrapper>
            </QuestionContainer>
          </div>
        </>
      </ThemeProvider>
    );
  }
}

QuestionWrapper.propTypes = {
  setQuestionData: PropTypes.func.isRequired,
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
  advancedAreOpen: PropTypes.bool,
  handleAdvancedOpen: PropTypes.func,
  userRole: PropTypes.string.isRequired,
  disableResponse: PropTypes.bool,
  clearAnswers: PropTypes.func,
  saveHintUsage: PropTypes.func,
  LCBPreviewModal: PropTypes.any
};

QuestionWrapper.defaultProps = {
  isNew: false,
  type: null,
  data: {},
  saveClicked: false,
  testItem: false,
  noPadding: false,
  isFlex: false,
  timespent: "",
  multiple: false,
  LCBPreviewModal: false,
  showFeedback: false,
  qIndex: 0,
  clearAnswers: () => {},
  changePreviewTab: () => {},
  flowLayout: false,
  advancedAreOpen: false,
  handleAdvancedOpen: () => {},
  saveHintUsage: () => {},
  disableResponse: false,
  isPresentationMode: false
};

const enhance = compose(
  React.memo,
  withWindowSizes,
  withAnswerSave,
  withTheme,
  withNamespaces("assessment"),
  connect(
    state => ({
      isPresentationMode: get(state, ["author_classboard_testActivity", "presentationMode"], false),
      advancedAreOpen: state.assessmentplayerQuestions.advancedAreOpen,
      showUserTTS: get(state, "user.user.tts", "no"),
      selectedTheme: state.ui.selectedTheme,
      zoomLevel: state.ui.zoomLevel,
      userRole: getUserRole(state),
      enableMagnifier: state.testPlayer.enableMagnifier,
      playerSkinType: playerSkinTypeSelector(state),
      isPowerTeacher: get(state, ["user", "user", "isPowerTeacher"], false),
      isPremiumUser: get(state, ["user", "user", "features", "premium"], false),
      features: getUserFeatures(state),
      isItemsVisible: isItemVisibiltySelector(state)
    }),
    {
      setQuestionData: setQuestionDataAction,
      handleAdvancedOpen: toggleAdvancedSections,
      loadScratchPad: requestScratchPadAction
    }
  )
);

export default enhance(QuestionWrapper);

const StyledFlexContainer = styled(FlexContainer)`
  font-size: ${props => props.theme.fontSize};
  overflow: ${({ showScroll }) => showScroll && "auto"};
`;

const QuestionMenuWrapper = styled.div`
  position: relative;
  width: 250px;

  @media (max-width: ${smallDesktopWidth}) {
    display: none;
  }
`;

const RubricTableWrapper = styled.div`
  border: 1px solid ${borderGrey2};
  border-radius: 10px;
  margin-top: 10px;
  padding: 10px 10px 0px;
  > span {
    font-size: ${props => props.theme.titleSectionFontSize};
    font-weight: ${props => props.theme.semiBold};
    display: inline-block;
    margin: 0px 16px 10px;
    text-transform: uppercase;
  }
`;
