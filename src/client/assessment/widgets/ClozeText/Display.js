import PropTypes from "prop-types";
import React, { Component } from "react";
import styled from "styled-components";
import { findIndex, find, isEmpty, get } from "lodash";
import JsxParser from "react-jsx-parser";

import { InstructorStimulus, helpers, Stimulus } from "@edulastic/common";
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
    const { templateMarkUp } = this.props;
    this.setState({ parsedTemplate: helpers.parseTemplate(templateMarkUp) });
  }

  static getDerivedStateFromProps({ templateMarkUp }) {
    return { parsedTemplate: helpers.parseTemplate(templateMarkUp) };
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
      width: widthpx || 140,
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

  selectChange = (value, id) => {
    const { onChange: changeAnswers, userSelections: newAnswers, responseIds } = this.props;
    const changedIndex = findIndex(newAnswers, answer => (answer ? answer.id : "") === id);
    if (changedIndex !== -1) {
      newAnswers[changedIndex].value = value;
    } else {
      const resbtn = find(responseIds, res => res.id === id);
      newAnswers[resbtn.index] = { value, index: resbtn.index, id };
    }
    changeAnswers(newAnswers, id, Math.min(Math.max(value.length * 8, 100), 400));
  };

  _changeInput = ({ value, id, type }) => {
    if (type === "number") {
      value = +value;
      if (typeof value === "number" && !Number.isNaN(value)) {
        this.selectChange(value, id);
      }
      return;
    }
    this.selectChange(value, id);
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
      showIndex,
      disableResponse,
      qIndex,
      userSelections,
      responseIds,
      isReviewTab
    } = this.props;
    const { parsedTemplate } = this.state;
    // Layout Options
    const fontSize = this.getFontSize(uiStyle.fontsize);
    const { responsecontainerindividuals, stemnumeration } = uiStyle;
    const { btnStyle, responseBtnStyle } = this.getBtnStyle();

    let maxLineHeight = smallSize ? 50 : 40;
    maxLineHeight = maxLineHeight < btnStyle.height ? btnStyle.height : maxLineHeight;
    const resProps =
      showAnswer || checkAnswer
        ? {
            responseBtnStyle,
            responsecontainerindividuals,
            stemNumeration: stemnumeration,
            fontSize,
            showAnswer,
            userSelections,
            evaluation,
            showIndex,
            disableResponse,
            qIndex,
            uiStyle,
            responseIds,
            isReviewTab,
            cAnswers: get(item, "validation.valid_response.value", [])
          }
        : {
            userAnswers: userSelections,
            style: { height: btnStyle.height },
            btnStyle,
            onChange: this._changeInput,
            placeholder: btnStyle.placeholder,
            type: btnStyle.inputtype,
            item,
            qIndex,
            disableResponse,
            showIndex,
            responseIds,
            responsecontainerindividuals,
            isReviewTab,
            cAnswers: get(item, "validation.valid_response.value", [])
          };

    const answerBox = showAnswer ? (
      <>
        <CorrectAnswerBoxLayout
          fontSize={fontSize}
          groupResponses={options}
          userAnswers={validation.valid_response && validation.valid_response.value}
          responseIds={responseIds}
        />
        {!isEmpty(item.validation.alt_responses) && (
          <CorrectAnswerBoxLayout
            fontSize={fontSize}
            groupResponses={options}
            altAnswers={item.validation.alt_responses}
            responseIds={item.response_ids}
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
          {showQuestionNumber && <QuestionNumber>{item.qLabel}</QuestionNumber>}
          <Stimulus smallSize={smallSize} dangerouslySetInnerHTML={{ __html: question }} />
        </QuestionTitleWrapper>
        <JsxParser
          bindings={{ resProps, lineHeight: `${maxLineHeight}px` }}
          showWarnings
          components={{
            textinput: showAnswer || checkAnswer ? CheckboxTemplateBoxLayout : ClozeTextInput,
            mathspan: MathSpanWrapper
          }}
          jsx={parsedTemplate}
        />
        {answerBox}
      </div>
    );
  }
}

ClozeTextDisplay.propTypes = {
  options: PropTypes.object,
  onChange: PropTypes.func,
  showIndex: PropTypes.bool,
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
  templateMarkUp: PropTypes.string,
  responseIds: PropTypes.object,
  item: PropTypes.object,
  disableResponse: PropTypes.bool,
  showQuestionNumber: PropTypes.bool,
  isReviewTab: PropTypes.bool,
  qIndex: PropTypes.number
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
  showIndex: false,
  smallSize: false,
  item: {},
  validation: {},
  uiStyle: {
    fontsize: "normal",
    stemnumeration: "numerical",
    widthpx: 140,
    heightpx: 0,
    placeholder: null,
    inputtype: "text",
    responsecontainerindividuals: []
  },
  templateMarkUp: "",
  showQuestionNumber: false,
  disableResponse: false,
  isReviewTab: false,
  qIndex: null
};

export default ClozeTextDisplay;

const QuestionTitleWrapper = styled.div`
  display: flex;
`;

const QuestionNumber = styled.div`
  font-weight: 700;
  margin-right: 4px;
`;
