import React, { Component } from "react";
import PropTypes from "prop-types";
import styled, { ThemeProvider } from "styled-components";
import { questionType } from "@edulastic/constants";
import { connect } from "react-redux";
import { compose } from "redux";
import { get } from "lodash";
import { withNamespaces } from "@edulastic/localization";
import { mobileWidth, desktopWidth } from "@edulastic/colors";
import { withWindowSizes } from "@edulastic/common";
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
import Timespent from "./Timespent";
import { setQuestionDataAction } from "../../author/src/actions/question";
import { Chart } from "../widgets/Charts";

const QuestionContainer = styled.div`
  padding: ${({ noPadding }) => (noPadding ? "0px" : null)};
  display: ${({ isFlex }) => (isFlex ? "flex" : "block")};
  @media (max-width: ${mobileWidth}) {
    flex-direction: column;
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
    activeTab: 0
  };

  fillSections = (section, label, offset, offsetBottom, haveDesk, deskHeight) => {
    this.setState(state => ({
      [section]: state[section].concat({ label, offset, offsetBottom, haveDesk, deskHeight })
    }));
  };

  cleanSections = () => {
    this.setState({ main: [], advanced: [], activeTab: 0 });
  };

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
      t,
      changePreviewTab,
      qIndex,
      windowWidth,
      ...restProps
    } = this.props;
    const userAnswer = get(data, "activity.userResponse", null);
    const { main, advanced, activeTab } = this.state;
    const Question = getQuestion(type);
    const studentName = data.activity && data.activity.studentName;
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

    return (
      <ThemeProvider theme={themes.default}>
        <QuestionContainer noPadding={noPadding} isFlex={isFlex} data-cy="question-container">
          <PaperWrapper
            style={{
              width: "-webkit-fill-available",
              display: "flex",
              boxShadow: "none"
            }}
          >
            {view === "edit" && <QuestionMenu activeTab={activeTab} main={main} advanced={advanced} />}
            <div style={{ flex: "auto", maxWidth: `${windowWidth > desktopWidth ? "auto" : "100%"}` }}>
              {timespent ? <Timespent timespent={timespent} view={view} /> : null}
              <Question
                {...restProps}
                setQuestionData={setQuestionData}
                item={data}
                view={view}
                changePreviewTab={changePreviewTab}
                qIndex={qIndex}
                cleanSections={this.cleanSections}
                fillSections={this.fillSections}
                {...userAnswerProps}
              />
            </div>
          </PaperWrapper>
          {showFeedback &&
            (multiple ? <FeedbackBottom widget={data} /> : <FeedbackRight widget={data} studentName={studentName} />)}
        </QuestionContainer>
      </ThemeProvider>
    );
  }
}

QuestionWrapper.propTypes = {
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  view: PropTypes.string.isRequired,
  multiple: PropTypes.bool,
  showFeedback: PropTypes.bool,
  type: PropTypes.any,
  isNew: PropTypes.bool,
  data: PropTypes.object,
  saveClicked: PropTypes.bool,
  testItem: PropTypes.bool,
  noPadding: PropTypes.bool,
  changePreviewTab: PropTypes.any.isRequired,
  isFlex: PropTypes.bool,
  timespent: PropTypes.string,
  qIndex: PropTypes.number,
  windowWidth: PropTypes.number.isRequired
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
  qIndex: 0
};

const enhance = compose(
  React.memo,
  withWindowSizes,
  withAnswerSave,
  withNamespaces("assessment"),
  connect(
    null,
    {
      setQuestionData: setQuestionDataAction
    }
  )
);

export default enhance(QuestionWrapper);
