import React from "react";
import PropTypes from "prop-types";
import { ThemeProvider } from "styled-components";

import { MathSpan } from "@edulastic/common";
import { themes } from "../../../../../../theme";
import { QuestionText } from "../../common/Form";
import { MathAnswer } from "./styled";

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

  renderForm = mode => {
    const {
      question: { numberPad, symbols },
      answer,
      view,
      highlighted,
      boundingRect = {}
    } = this.props;

    if (mode === "report") {
      return <QuestionText>{answer}</QuestionText>;
    }
    return (
      <ThemeProvider theme={themes.default}>
        <MathAnswer
          onInput={this.handleChange}
          numberPad={numberPad}
          symbols={symbols}
          check={["check", "show"].includes(view)}
          value={answer}
          fullWidth
          ref={el => highlighted && el?.setFocus()}
          top={boundingRect.bottom + 10}
          right={20}
          isDocbasedSection
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
