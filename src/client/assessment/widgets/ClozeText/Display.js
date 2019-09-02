import PropTypes from "prop-types";
import React, { Component } from "react";
import produce from "immer";
import styled from "styled-components";
import { findIndex, find, isEmpty, get } from "lodash";
import JsxParser from "react-jsx-parser";

import { InstructorStimulus, helpers, Stimulus, QuestionNumberLabel } from "@edulastic/common";
import { response } from "@edulastic/constants";

import CheckboxTemplateBoxLayout from "./components/CheckboxTemplateBoxLayout";
import CorrectAnswerBoxLayout from "./components/CorrectAnswerBoxLayout";
import MathSpanWrapper from "../../components/MathSpanWrapper";
import ClozeTextInput from "./ClozeTextInput";

class ClozeTextDisplay extends Component {
  state = {
    parsedTemplate: ""
  };

  componentDidMount() {
    const { stimulus } = this.props;
    this.setState({ parsedTemplate: helpers.parseTemplate(stimulus) });
  }

  static getDerivedStateFromProps({ stimulus }) {
    return { parsedTemplate: helpers.parseTemplate(stimulus) };
  }

  getFontSize = size => {
    switch (size) {
      case "small":
        return "11px";
      case "normal":
        return "14px";
      case "large":
        return "17px";
      case "xlarge":
        return "20px";
      case "xxlarge":
        return "24px";
      default:
        return "14px";
    }
  };

  getBtnStyle = () => {
    const { uiStyle } = this.props;
    const { widthpx, heightpx, placeholder, inputtype } = uiStyle; // , responsecontainerindividuals

    const responseBtnStyle = {
      widthpx: widthpx !== 0 ? widthpx : 140,
      heightpx: heightpx !== 0 ? heightpx : 35
    };

    const btnStyle = {
      height: 0,
      minWidth: `${response.minWidth}px`,
      minHeight: `${response.minHeight}px`,
      widthpx: widthpx || 140,
      heightpx: 0,
      placeholder,
      inputtype
    };
    // if (responsecontainerindividuals && responsecontainerindividuals[dropTargetIndex]) {
    //   const {
    //     widthpx: widthpx1,
    //     heightpx: heightpx1,
    //     placeholder: placeholder1,
    //     inputtype: inputtype1
    //   } = responsecontainerindividuals[dropTargetIndex];
    //   btnStyle.width = widthpx1;
    //   btnStyle.height = heightpx1;
    //   btnStyle.widthpx = widthpx1;
    //   btnStyle.heightpx = heightpx1;
    //   btnStyle.placeholder = placeholder1;
    //   btnStyle.inputtype = inputtype1;
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
    if (btnStyle && btnStyle.placeholder === undefined) {
      btnStyle.placeholder = responseBtnStyle.placeholder;
    } else {
      btnStyle.placeholder = btnStyle.placeholder;
    }
    if (btnStyle && btnStyle.inputtype === undefined) {
      btnStyle.inputtype = responseBtnStyle.inputtype;
    } else {
      btnStyle.inputtype = btnStyle.inputtype;
    }

    return { btnStyle, responseBtnStyle };
  };

  onChangeUserAnswer = (value, id) => {
    const { onChange: changeAnswers, userSelections, responseIds } = this.props;
    changeAnswers(
      produce(userSelections, draft => {
        const changedIndex = findIndex(draft, (answer = {}) => answer.id === id);
        if (changedIndex !== -1) {
          draft[changedIndex].value = value;
        } else {
          const resbtn = find(responseIds, res => res.id === id);
          draft[resbtn.index] = { value, index: resbtn.index, id };
        }
      }),
      id
    );
  };

  _changeInput = ({ value, id, type }) => {
    if (type === "number") {
      value = +value;
      if (typeof value === "number" && !Number.isNaN(value)) {
        this.onChangeUserAnswer(value, id);
      }
      return;
    }
    this.onChangeUserAnswer(value, id);
  };

  render() {
    const {
      smallSize,
      question,
      options,
      uiStyle,
      showAnswer,
      checkAnswer,
      validation,
      evaluation,
      instructorStimulus,
      item,
      showQuestionNumber,
      disableResponse,
      qIndex,
      userSelections,
      previewTab,
      changePreviewTab,
      responseIds,
      isReviewTab,
      view
    } = this.props;

    const { parsedTemplate } = this.state;
    // Layout Options
    const fontSize = this.getFontSize(uiStyle.fontsize);
    const { responsecontainerindividuals, stemNumeration } = uiStyle;
    const { btnStyle, responseBtnStyle } = this.getBtnStyle();

    let maxLineHeight = smallSize ? 50 : 40;
    maxLineHeight = maxLineHeight < btnStyle.height ? btnStyle.height : maxLineHeight;
    const resProps = {
      view,
      item,
      qIndex,
      uiStyle,
      fontSize,
      showAnswer,
      checkAnswer,
      evaluation,
      previewTab,
      changePreviewTab,
      responseIds,
      isReviewTab,
      stemNumeration,
      userSelections,
      disableResponse,
      style: btnStyle,
      responseBtnStyle,
      type: btnStyle.inputtype,
      userAnswers: userSelections,
      onChange: this._changeInput,
      responsecontainerindividuals,
      placeholder: btnStyle.placeholder,
      cAnswers: get(item, "validation.validResponse.value", [])
    };

    const QuestionContent = (
      <JsxParser
        bindings={{ resProps, lineHeight: `${maxLineHeight}px` }}
        showWarnings
        components={{
          textinput: showAnswer || checkAnswer ? CheckboxTemplateBoxLayout : ClozeTextInput,
          mathspan: MathSpanWrapper
        }}
        jsx={parsedTemplate}
      />
    );

    const answerBox =
      previewTab === "show" ? (
        <>
          <CorrectAnswerBoxLayout
            fontSize={fontSize}
            groupResponses={options}
            userAnswers={validation.validResponse && validation.validResponse.value}
            responseIds={responseIds}
            stemNumeration={stemNumeration}
          />
          {!isEmpty(item.validation.altResponses) && (
            <CorrectAnswerBoxLayout
              fontSize={fontSize}
              groupResponses={options}
              altAnswers={item.validation.altResponses}
              responseIds={item.responseIds}
              stemNumeration={stemNumeration}
            />
          )}
        </>
      ) : (
        <div />
      );

    return (
      <div style={{ fontSize }}>
        {instructorStimulus && instructorStimulus !== "<p><br></p>" && (
          <InstructorStimulus dangerouslySetInnerHTML={{ __html: instructorStimulus }} />
        )}
        <QuestionTitleWrapper>
          {showQuestionNumber && <QuestionNumberLabel>{item.qLabel}:</QuestionNumberLabel>}
          <Stimulus smallSize={smallSize} dangerouslySetInnerHTML={{ __html: question }} />
          {!question && QuestionContent}
        </QuestionTitleWrapper>
        {question && QuestionContent}
        {answerBox}
      </div>
    );
  }
}

ClozeTextDisplay.propTypes = {
  options: PropTypes.object,
  onChange: PropTypes.func,
  showAnswer: PropTypes.bool,
  userSelections: PropTypes.array,
  smallSize: PropTypes.bool,
  checkAnswer: PropTypes.bool,
  question: PropTypes.string.isRequired,
  validation: PropTypes.object,
  evaluation: PropTypes.object,
  uiStyle: PropTypes.object,
  instructorStimulus: PropTypes.string,
  /* eslint-disable react/no-unused-prop-types */
  template: PropTypes.string,
  responseIds: PropTypes.object,
  item: PropTypes.object,
  disableResponse: PropTypes.bool,
  showQuestionNumber: PropTypes.bool,
  isReviewTab: PropTypes.bool,
  qIndex: PropTypes.number,
  view: PropTypes.string.isRequired,
  stimulus: PropTypes.string.isRequired,
  previewTab: PropTypes.string.isRequired,
  changePreviewTab: PropTypes.func.isRequired
};

ClozeTextDisplay.defaultProps = {
  responseIds: {},
  options: {},
  onChange: () => {},
  showAnswer: false,
  instructorStimulus: "",
  evaluation: {},
  checkAnswer: false,
  userSelections: [],
  smallSize: false,
  item: {},
  validation: {},
  uiStyle: {
    fontsize: "normal",
    stemNumeration: "numerical",
    widthpx: 140,
    heightpx: 0,
    placeholder: null,
    inputtype: "text",
    responsecontainerindividuals: []
  },
  template: "",
  showQuestionNumber: false,
  disableResponse: false,
  isReviewTab: false,
  qIndex: null
};

export default ClozeTextDisplay;

const QuestionTitleWrapper = styled.div`
  display: flex;
`;
