import React, { Component } from "react";
import PropTypes from "prop-types";
import styled, { ThemeProvider } from "styled-components";
import { questionType } from "@edulastic/constants";
import { Button } from "antd";
import { connect } from "react-redux";
import { compose } from "redux";
import { get, isUndefined, round } from "lodash";
import { withNamespaces } from "@edulastic/localization";
import { mobileWidthMax, themeColor } from "@edulastic/colors";
import { withWindowSizes, WithResources } from "@edulastic/common";
import { PaperWrapper } from "./Graph/common/styled_components";
import { themes } from "../themes";
import QuestionMenu from "./Graph/common/QuestionMenu";

import { OrderList } from "../widgets/OrderList";
import { SortList } from "../widgets/SortList";
import { MatchList } from "../widgets/MatchList";
import { Classification } from "../widgets/Classification";
import { MultipleChoice } from "../widgets/MultipleChoice";
import { ClozeDragDrop } from "../widgets/ClozeDragDrop";
import { ClozeImageDragDrop } from "../widgets/ClozeImageDragDrop";
import { ClozeImageDropDown } from "../widgets/ClozeImageDropDown";
import { ClozeImageText } from "../widgets/ClozeImageText";
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
import { MathFormula } from "../widgets/MathFormula";
import { FormulaEssay } from "../widgets/FormulaEssay";
import ClozeMath from "../widgets/ClozeMath";
import FeedbackBottom from "./FeedbackBottom";
import FeedbackRight from "./FeedbackRight";
import { setQuestionDataAction } from "../../author/src/actions/question";
import { toggleAdvancedSections } from "../actions/questions";
import { Chart } from "../widgets/Charts";
import { getUserRole } from "../../author/src/selectors/user";
import AudioControls from "../AudioControls";
import StudentReportFeedback from "../../student/TestAcitivityReport/components/StudentReportFeedback";

import ItemDetailContext, { COMPACT, DEFAULT } from "@edulastic/common/src/contexts/ItemDetailContext";
import { getFontSize } from "../utils/helpers";

const QuestionContainer = styled.div`
  padding: ${({ noPadding }) => (noPadding ? "0px" : null)};
  display: ${({ isFlex }) => (isFlex ? "flex" : "block")};

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
`;

const ShowStudentWorkBtn = styled(Button)`
  margin-right: 15px;
  &:hover,
  &:focus {
    color: ${themeColor};
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
    case questionType.PASSAGE:
      return Passage;
    case questionType.VIDEO:
      return Video;
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
    default:
      return null;
  }
};

class QuestionWrapper extends Component {
  static contextType = ItemDetailContext;

  state = {
    main: [],
    advanced: [],
    activeTab: 0,
    shuffledOptsOrder: []
  };

  handleShuffledOptions = shuffledOptsOrder => {
    this.setState({ shuffledOptsOrder });
  };

  fillSections = (section, label, el) => {
    this.setState(state => {
      const sectionState = state[section];
      const found = sectionState.filter(block => block.label === label);

      if (found.length) {
        // update of section offset in array
        return {
          [section]: sectionState.filter(block => {
            if (el.label === label) {
              block.el = el;
            }
            return block;
          })
        };
      }

      // push of section to array
      return {
        [section]: sectionState.concat({ section, label, el })
      };
    });
  };

  cleanSections = sectionId => {
    if (!sectionId) return;

    this.setState(({ main }) => ({ main: main.filter(item => item.id !== sectionId) }));
  };

  static getDerivedStateFromProps(props) {
    if (props.view !== "edit") {
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
      showCollapseBtn = false,
      ...restProps
    } = this.props;
    const userAnswer = get(data, "activity.userResponse", null);
    const timeSpent = get(data, "activity.timeSpent", false);
    const { main, advanced, activeTab } = this.state;
    const disabled = get(data, "activity.disabled", false) || data.scoringDisabled;
    const Question = getQuestion(type);
    const { layoutType } = this.context;

    const isV1Multipart = get(this.props, "col.isV1Multipart", false);
    const studentName = data.activity && data.activity.studentName;
    const presentationModeProps = {
      isPresentationMode,
      color: data.activity && data.activity.color,
      icon: data.activity && data.activity.icon
    };

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

    const isPassageOrVideoType = [questionType.PASSAGE, questionType.VIDEO].includes(data.type);

    const studentReportFeedbackVisible = isStudentReport && !isPassageOrVideoType && !data.scoringDisabled;
    const showQuestionNumber = showFeedback || (showCollapseBtn && !isPassageOrVideoType);
    return (
      <WithResources
        resources={[
          "https://cdneduv2.snapwiz.net/JS/froala/v0/froala_editor.pkgd.min.css",
          "https://cdneduv2.snapwiz.net/JS/froala/v0/froala_editor.min.css"
        ]}
        fallBack={<span />}
      >
        <ThemeProvider theme={{ ...themes.default, fontSize: getFontSize(get(data, "uiStyle.fontsize", "normal")) }}>
          <>
            {canShowPlayer ? (
              <AudioControls
                showAudioControls={showAudioControls}
                key={data.id}
                item={data}
                qId={data.id}
                audioSrc={data.tts.titleAudioURL}
              />
            ) : (
              ""
            )}
            <QuestionContainer
              className={`fr-view question-container-id-${data.id}`}
              disabled={disabled}
              noPadding={noPadding}
              isFlex={isFlex}
              data-cy="question-container"
            >
              <PaperWrapper
                // className="question-wrapper" // this style not working with test item layout columns settings (when > 1 columns)
                disabled={disabled}
                isV1Multipart={isV1Multipart}
                style={{
                  width: "-webkit-fill-available",
                  display: "flex",
                  boxShadow: "none",
                  paddingRight: layoutType === COMPACT ? "100px" : null
                }}
                flowLayout={flowLayout}
              >
                {view === "edit" && (
                  <QuestionMenu
                    activeTab={activeTab}
                    main={main}
                    advanced={advanced}
                    advancedAreOpen={advancedAreOpen}
                    handleAdvancedOpen={handleAdvancedOpen}
                  />
                )}
                <FlexContainer>
                  <Question
                    {...restProps}
                    setQuestionData={setQuestionData}
                    item={data}
                    view={view}
                    changePreviewTab={changePreviewTab}
                    qIndex={qIndex}
                    advancedAreOpen={advancedAreOpen}
                    cleanSections={this.cleanSections}
                    fillSections={this.fillSections}
                    showQuestionNumber={showQuestionNumber}
                    flowLayout={flowLayout}
                    disableResponse={disableResponse}
                    {...userAnswerProps}
                  />
                  {showFeedback && timeSpent ? (
                    <>
                      <TimeSpentWrapper>
                        {!!showStudentWork && (
                          <ShowStudentWorkBtn onClick={showStudentWork}> Show student work</ShowStudentWorkBtn>
                        )}
                        <i className="fa fa-clock-o" aria-hidden="true" />
                        {round(timeSpent / 1000, 1)}s
                      </TimeSpentWrapper>
                    </>
                  ) : (
                    ""
                  )}
                </FlexContainer>
              </PaperWrapper>
              {showFeedback && !isPassageOrVideoType && !studentReportFeedbackVisible && (
                <FeedbackRight disabled={disabled} widget={data} studentName={studentName} {...presentationModeProps} />
              )}
              {/* STUDENT REPORT PAGE FEEDBACK */}
              {studentReportFeedbackVisible && <StudentReportFeedback qLabel={data.qLabel} qId={data.id} />}
            </QuestionContainer>
          </>
        </ThemeProvider>
      </WithResources>
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
  disableResponse: false,
  isPresentationMode: false
};

const enhance = compose(
  React.memo,
  withWindowSizes,
  withAnswerSave,
  withNamespaces("assessment"),
  connect(
    state => ({
      isPresentationMode: get(state, ["author_classboard_testActivity", "presentationMode"], false),
      advancedAreOpen: state.assessmentplayerQuestions.advancedAreOpen,
      showUserTTS: get(state, "user.user.tts", "no"),
      userRole: getUserRole(state)
    }),
    {
      setQuestionData: setQuestionDataAction,
      handleAdvancedOpen: toggleAdvancedSections
    }
  )
);

export default enhance(QuestionWrapper);
