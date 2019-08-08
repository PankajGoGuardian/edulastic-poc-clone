import PropTypes from "prop-types";
import React, { Component } from "react";
import { isUndefined, mapValues, cloneDeep, findIndex, find, get } from "lodash";
import styled, { withTheme } from "styled-components";
import JsxParser from "react-jsx-parser";

import { InstructorStimulus, helpers, Stimulus, QuestionNumberLabel } from "@edulastic/common";

import CorrectAnswerBoxLayout from "./components/CorrectAnswerBoxLayout";
import { getFontSize } from "../../utils/helpers";

import CheckboxTemplateBoxLayout from "./components/CheckboxTemplateBoxLayout";
import { withCheckAnswerButton } from "../../components/HOC/withCheckAnswerButton";
import MathSpanWrapper from "../../components/MathSpanWrapper";

import ChoicesBox from "./ChoicesBox";

class ClozeDropDownDisplay extends Component {
  state = {
    parsedTemplate: ""
  };

  static getDerivedStateFromProps({ stimulus }) {
    return { parsedTemplate: helpers.parseTemplate(stimulus) };
  }

  componentDidMount() {
    const { stimulus } = this.props;
    this.setState({ parsedTemplate: helpers.parseTemplate(stimulus) });
  }

  selectChange = (value, index, id) => {
    const { onChange: changeAnswers, userSelections: newAnswers } = this.props;
    const changedIndex = findIndex(newAnswers, answer => (answer ? answer.id : "") === id);
    if (changedIndex !== -1) {
      newAnswers[changedIndex] = { value, index, id };
      changeAnswers(newAnswers);
    } else {
      const {
        item: { responseIds }
      } = this.props;
      const response = find(responseIds, res => res.id === id);
      newAnswers[response.index] = { value, index, id };
      changeAnswers(newAnswers);
    }
  };

  shuffle = arr => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  shuffleGroup = data =>
    mapValues(data, (value, key) => {
      if (!isUndefined(value)) {
        data[key] = this.shuffle(value);
      }
      data[key] = value;
      return data[key];
    });

  getBtnStyle = () => {
    const { uiStyle } = this.props;
    const responseBtnStyle = {
      widthpx: uiStyle.widthpx !== 0 ? uiStyle.widthpx : "auto",
      heightpx: uiStyle.heightpx !== 0 ? uiStyle.heightpx : "auto"
    };

    const btnStyle = {
      width: 0,
      height: 0,
      widthpx: 0,
      heightpx: 0
    };
    // if (responsecontainerindividuals && responsecontainerindividuals[dropTargetIndex]) {
    //   const { widthpx, heightpx } = responsecontainerindividuals[dropTargetIndex];
    //   btnStyle.width = widthpx;
    //   btnStyle.height = heightpx;
    //   btnStyle.widthpx = widthpx;
    //   btnStyle.heightpx = heightpx;
    //   btnStyle.placeholder = placeholder;
    // }
    if (btnStyle && btnStyle.width === 0) {
      btnStyle.width = responseBtnStyle.widthpx;
    } else {
      btnStyle.width = btnStyle.widthpx;
    }
    if (btnStyle && btnStyle.height === 0) {
      btnStyle.height = responseBtnStyle.heightpx;
    } else {
      btnStyle.height = btnStyle.heightpx;
    }
    return { btnStyle, responseBtnStyle };
  };

  render() {
    const {
      qIndex,
      smallSize,
      question,
      configureOptions,
      preview,
      options,
      uiStyle,
      showAnswer,
      checkAnswer,
      evaluation,
      instructorStimulus,
      item,
      disableResponse,
      showQuestionNumber,
      userSelections,
      isReviewTab,
      theme,
      previewTab,
      changePreviewTab
    } = this.props;
    const { parsedTemplate } = this.state;
    const { shuffleOptions } = configureOptions;
    let responses = cloneDeep(options);
    if (preview && shuffleOptions) {
      responses = this.shuffleGroup(responses);
    }
    // Layout Options
    const fontSize = getFontSize(theme.fontSize || "normal", true);
    const { placeholder, responsecontainerindividuals, stemnumeration } = uiStyle;
    const { btnStyle, responseBtnStyle } = this.getBtnStyle();

    let maxLineHeight = smallSize ? 50 : 40;
    maxLineHeight = maxLineHeight < btnStyle.height ? btnStyle.height : maxLineHeight;

    const hasAltAnswers = item.validation && item.validation.altResponses && item.validation.altResponses.length > 0;

    const answerBox = showAnswer ? (
      <React.Fragment>
        <CorrectAnswerBoxLayout
          fontSize={fontSize}
          groupResponses={options}
          userAnswers={item.validation.validResponse && item.validation.validResponse.value}
          responseIds={item.responseIds}
        />
        {hasAltAnswers && (
          <CorrectAnswerBoxLayout
            fontSize={fontSize}
            groupResponses={options}
            altResponses={item.validation.altResponses}
            responseIds={item.responseIds}
          />
        )}
      </React.Fragment>
    ) : (
      <div />
    );
    const resProps = {
      item,
      qIndex,
      fontSize,
      btnStyle,
      showAnswer,
      isReviewTab,
      placeholder,
      disableResponse,
      responseBtnStyle,
      options: responses,
      onChange: this.selectChange,
      responsecontainerindividuals,
      stemNumeration: stemnumeration,
      previewTab,
      changePreviewTab,
      userAnswers: userSelections || [],
      showIndex: showAnswer || checkAnswer,
      cAnswers: get(item, "validation.validResponse.value", []),
      userSelections: item && item.activity && item.activity.userResponse ? item.activity.userResponse : userSelections,
      evaluation: item && item.activity && item.activity.evaluation ? item.activity.evaluation : evaluation
    };
    const questionContent = (
      <ContentWrapper fontSize={fontSize}>
        <JsxParser
          bindings={{ resProps, lineHeight: `${maxLineHeight}px` }}
          showWarnings
          components={{
            textdropdown: showAnswer || checkAnswer ? CheckboxTemplateBoxLayout : ChoicesBox,
            mathspan: MathSpanWrapper
          }}
          jsx={parsedTemplate}
        />
      </ContentWrapper>
    );

    return (
      <div>
        <InstructorStimulus>{instructorStimulus}</InstructorStimulus>
        <QuestionTitleWrapper>
          {showQuestionNumber && <QuestionNumberLabel>{item.qLabel}:</QuestionNumberLabel>}
          <Stimulus qIndex={qIndex} smallSize={smallSize} dangerouslySetInnerHTML={{ __html: question }} />
          {!question && questionContent}
        </QuestionTitleWrapper>
        {question && questionContent}
        {answerBox}
      </div>
    );
  }
}

ClozeDropDownDisplay.propTypes = {
  options: PropTypes.object,
  onChange: PropTypes.func,
  preview: PropTypes.bool,
  showAnswer: PropTypes.bool,
  userSelections: PropTypes.array,
  smallSize: PropTypes.bool,
  checkAnswer: PropTypes.bool,
  stimulus: PropTypes.string,
  question: PropTypes.string.isRequired,
  configureOptions: PropTypes.object,
  evaluation: PropTypes.array,
  uiStyle: PropTypes.object,
  changePreviewTab: PropTypes.func.isRequired,
  previewTab: PropTypes.func.isRequired,
  instructorStimulus: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
  disableResponse: PropTypes.bool,
  qIndex: PropTypes.number,
  isReviewTab: PropTypes.bool,
  showQuestionNumber: PropTypes.bool,
  theme: PropTypes.object
};

ClozeDropDownDisplay.defaultProps = {
  options: {},
  theme: {},
  onChange: () => {},
  preview: true,
  showAnswer: false,
  evaluation: [],
  checkAnswer: false,
  userSelections: [],
  stimulus: "",
  disableResponse: false,
  smallSize: false,
  configureOptions: {
    shuffleOptions: false
  },
  uiStyle: {
    fontsize: "normal",
    stemnumeration: "numerical",
    widthpx: 0,
    heightpx: 0,
    placeholder: null,
    responsecontainerindividuals: []
  },
  showQuestionNumber: false,
  isReviewTab: false,
  qIndex: null
};

export default withTheme(withCheckAnswerButton(ClozeDropDownDisplay));

const QuestionTitleWrapper = styled.div`
  display: flex;
`;

const ContentWrapper = styled.div`
  p {
    font-size: ${({ fontSize }) => fontSize || "auto"};
  }
`;
