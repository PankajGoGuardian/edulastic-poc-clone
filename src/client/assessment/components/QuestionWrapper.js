import React, { Component } from "react";
import PropTypes from "prop-types";
import styled, { ThemeProvider } from "styled-components";
import { questionType } from "@edulastic/constants";
import { connect } from "react-redux";
import { compose } from "redux";
import { get, isUndefined, round } from "lodash";
import { withNamespaces } from "@edulastic/localization";
import { mobileWidth, desktopWidth } from "@edulastic/colors";
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

const QuestionContainer = styled.div`
  padding: ${({ noPadding }) => (noPadding ? "0px" : null)};
  display: ${({ isFlex }) => (isFlex ? "flex" : "block")};
  @media (max-width: ${mobileWidth}) {
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
    default:
      return null;
  }
};

class QuestionWrapper extends Component {
  state = {
    main: [],
    advanced: [],
    activeTab: 0,
    shuffledOptsOrder: []
  };

  handleShuffledOptions = shuffledOptsOrder => {
    this.setState({ shuffledOptsOrder });
  };

  fillSections = (section, label, offset, offsetBottom, haveDesk, deskHeight, id) => {
    this.setState(state => {
      const sectionState = state[section];
      const found = sectionState.filter(el => el.label === label && el.offset !== offset);

      if (found.length) {
        // update of section offset in array
        return {
          [section]: sectionState.filter(el => {
            if (el.label === label) {
              el.offset = offset;
              el.offsetBottom = offsetBottom;
              el.haveDesk = haveDesk;
              el.deskHeight = deskHeight;
            }
            return el;
          })
        };
      }

      // push of section to array
      return {
        [section]: sectionState.concat({ label, offset, offsetBottom, haveDesk, deskHeight, id })
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
      ...restProps
    } = this.props;
    const userAnswer = get(data, "activity.userResponse", null);
    const timeSpent = get(data, "activity.timeSpent", false);
    const { main, advanced, activeTab } = this.state;
    const disabled = get(data, "activity.disabled", false) || data.scoringDisabled;
    const Question = getQuestion(type);

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

    if (isUndefined(restProps.userAnswer)) {
      restProps.userAnswer = [];
    }

    if (data.id) {
      /**
       * adding `key` forces the component to re-render when `id` changes.
       */
      userAnswerProps.key = data.id;
    }
    const canShowPlayer = userRole === "student" && data.tts && data.tts.taskStatus === "COMPLETED";
    return (
      <WithResources
        resources={[
          "https://cdneduv2.snapwiz.net/JS/froala/v0/froala_editor.pkgd.min.css",
          "https://cdneduv2.snapwiz.net/JS/froala/v0/froala_editor.min.css"
        ]}
        fallBack={<span />}
      >
        <ThemeProvider theme={{ ...themes.default, fontSize: get(data, "ui_style.fontsize", "normal") }}>
          <>
            {canShowPlayer ? (
              <AudioControls key={data.id} item={data} qId={data.id} audioSrc={data.tts.titleAudioURL} />
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
                disabled={disabled}
                isV1Multipart={isV1Multipart}
                style={{
                  width: "-webkit-fill-available",
                  display: "flex",
                  boxShadow: "none"
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
                <div style={{ flex: "auto", maxWidth: `${windowWidth > desktopWidth ? "auto" : "100%"}` }}>
                  {showFeedback && timeSpent && (
                    <p style={{ fontSize: 19, color: "grey" }}>
                      <i className="fa fa-clock-o" style={{ paddingRight: 15 }} aria-hidden="true" />
                      {round(timeSpent / 1000, 1)}s
                    </p>
                  )}

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
                    showQuestionNumber={showFeedback}
                    flowLayout={flowLayout}
                    disableResponse={disableResponse}
                    {...userAnswerProps}
                  />
                </div>
              </PaperWrapper>
              {showFeedback &&
                (multiple ? (
                  <FeedbackBottom
                    widget={data}
                    disabled={disabled}
                    studentName={studentName}
                    {...presentationModeProps}
                  />
                ) : (
                  <FeedbackRight
                    disabled={disabled}
                    widget={data}
                    studentName={studentName}
                    {...presentationModeProps}
                  />
                ))}
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
  disableResponse: PropTypes.bool
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
  showFeedback: false,
  qIndex: 0,
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
      userRole: getUserRole(state)
    }),
    {
      setQuestionData: setQuestionDataAction,
      handleAdvancedOpen: toggleAdvancedSections
    }
  )
);

export default enhance(QuestionWrapper);
