import PropTypes from "prop-types";
import React, { Component } from "react";
import styled from "styled-components";
import JsxParser from "react-jsx-parser";

import { InstructorStimulus, helpers } from "@edulastic/common";

import { QuestionHeader } from "../../styled/QuestionHeader";
import CheckboxTemplateBoxLayout from "./components/CheckboxTemplateBoxLayout";
import CorrectAnswerBoxLayout from "./components/CorrectAnswerBoxLayout";
import AlternateAnswerBoxLayout from "./components/AlternateAnswerBoxLayout";
import ClozeTextInput from "../../components/ClozeTextInput";
import MathSpanWrapper from "../../components/MathSpanWrapper";
import { response } from "../../../../../packages/constants/const/dimensions";

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

  selectChange = (value, index) => {
    const { onChange: changeAnswers, userSelections: newAnswers } = this.props;
    newAnswers[index] = value;
    changeAnswers(newAnswers);
  };

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
      minWidth: 100,
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

  _changeInput = ({ value, dropTargetIndex, type }) => {
    if (type === "number") {
      value = +value;
      if (typeof value === "number" && !Number.isNaN(value)) {
        this.selectChange(value, dropTargetIndex);
      }
      return;
    }
    this.selectChange(value, dropTargetIndex);
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
      qIndex,
      showIndex,
      userSelections
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
            uiStyle
          }
        : {
            userAnswers: userSelections,
            style: { height: btnStyle.height, minWidth: uiStyle.widthpx || response.minWidth },
            btnStyle,
            onChange: this._changeInput,
            placeholder: btnStyle.placeholder,
            type: btnStyle.inputtype,
            item,
            showIndex
          };

    const answerBox = showAnswer ? (
      <CorrectAnswerBoxLayout
        fontSize={fontSize}
        groupResponses={options}
        userAnswers={validation.valid_response && validation.valid_response.value}
        // eslint-disable-next-line no-prototype-builtins
        altAnswers={validation.hasOwnProperty("alt_responses") && validation.alt_responses}
      />
    ) : (
      <div />
    );

    return (
      <div style={{ fontSize }}>
        {instructorStimulus && instructorStimulus !== "<p><br></p>" && (
          <InstructorStimulus dangerouslySetInnerHTML={{ __html: instructorStimulus }} />
        )}
        <QuestionTitleWrapper>
          {showQuestionNumber && <QuestionNumber>{`Q${qIndex + 1}`}</QuestionNumber>}
          <QuestionHeader smallSize={smallSize} dangerouslySetInnerHTML={{ __html: question }} />
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
  item: PropTypes.object,
  showQuestionNumber: PropTypes.bool,
  qIndex: PropTypes.number
};

ClozeTextDisplay.defaultProps = {
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
