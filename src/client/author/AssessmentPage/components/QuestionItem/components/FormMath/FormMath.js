import React from "react";
import PropTypes from "prop-types";
import { ThemeProvider } from "styled-components";

import { MathSpan, MathInput } from "@edulastic/common";
import { themes } from "../../../../../../theme";
import { QuestionText } from "../../common/Form";

export default class FormMath extends React.Component {
  static propTypes = {
    saveAnswer: PropTypes.func.isRequired,
    mode: PropTypes.oneOf(["edit", "review", "report"]).isRequired,
    question: PropTypes.object.isRequired,
    answer: PropTypes.string
  };

  static defaultProps = {
    answer: ""
  };

  handleChange = value => {
    const { saveAnswer } = this.props;
    saveAnswer(value);
  };

  renderView = () => {
    const {
      question: { validation }
    } = this.props;

    if (!validation) return this.renderForm();

    const {
      validResponse: { value }
    } = validation;
    const answer = value[0];

    if (!answer || !answer.value) return null;

    return (
      <QuestionText>
        <MathSpan
          dangerouslySetInnerHTML={{ __html: `<span class="input__math" data-latex="${answer.value}"></span>` }}
        />
      </QuestionText>
    );
  };

  handleBlur = () => {
    const { clearHighlighted, saveQuestionResponse } = this.props;
    clearHighlighted();
    saveQuestionResponse();
  };

  renderForm = mode => {
    const {
      question: { numberPad, symbols, allowedVariables = "", allowNumericOnly = false},
      answer,
      view,
      highlighted,
    } = this.props;
    
    const restrictKeys = allowedVariables.split(",").map(val=> val.trim());

    if (mode === "report") {
      return <QuestionText>{answer}</QuestionText>;
    }
    return (
      <ThemeProvider theme={themes.default}>
        <MathInput
          onInput={this.handleChange}
          numberPad={numberPad}
          symbols={symbols}
          check={["check", "show"].includes(view)}
          value={answer}
          fullWidth
          ref={el => highlighted && el?.setFocus()}
          onBlur={this.handleBlur}
          isDocbasedSection
          restrictKeys={restrictKeys}
          allowNumericOnly={allowNumericOnly}
        />
      </ThemeProvider>
    );
  };

  renderReport = () => {
    const { answer } = this.props;

    return (
      <QuestionText>
        <MathSpan dangerouslySetInnerHTML={{ __html: `<span class="input__math" data-latex="${answer}"></span>` }} />
      </QuestionText>
    );
  };

  render() {
    const { mode } = this.props;

    switch (mode) {
      case "edit":
        return this.renderView();
      case "review":
        return this.renderForm();
      case "report":
        return this.renderReport();
      default:
        return null;
    }
  }
}
