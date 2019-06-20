import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTheme } from "styled-components";
import { isEmpty } from "lodash";

import { MathInput, StaticMath, MathFormulaDisplay } from "@edulastic/common";

import { SHOW, CHECK, CLEAR } from "../../constants/constantsForQuestions";

import CorrectAnswerBox from "./components/CorrectAnswerBox/index";
import MathInputStatus from "./components/MathInputStatus/index";
import MathInputWrapper from "./styled/MathInputWrapper";
import { QuestionTitleWrapper, QuestionNumber } from "./styled/QustionNumber";

import { getStylesFromUiStyleToCssStyle } from "../../utils/helpers";

class MathFormulaPreview extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    studentTemplate: PropTypes.string,
    type: PropTypes.string.isRequired,
    saveAnswer: PropTypes.func.isRequired,
    changePreviewTab: PropTypes.func.isRequired,
    evaluation: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
    userAnswer: PropTypes.any,
    theme: PropTypes.object.isRequired,
    showQuestionNumber: PropTypes.bool
  };

  static defaultProps = {
    studentTemplate: "",
    userAnswer: null,
    showQuestionNumber: false
  };

  studentRef = React.createRef();

  state = {
    latex: "",
    innerValues: []
  };

  constructor(props) {
    super(props);
    const { studentTemplate } = props;
    this.state = {
      latex: studentTemplate,
      innerValues: []
    };
  }

  componentDidUpdate(prevProps) {
    const { studentTemplate, type: previewType, userAnswer } = this.props;
    const { studentTemplate: prevStudentTemplate, type: prevPreviewType, userAnswer: prevUserAnswer } = prevProps;

    if (
      (previewType !== prevPreviewType && previewType === CLEAR) ||
      userAnswer !== prevUserAnswer ||
      studentTemplate !== prevStudentTemplate
    ) {
      if (!this.isStatic()) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({ latex: userAnswer || studentTemplate });
        return;
      }
      this.updateStaticMathFromUserAnswer();
    }
  }

  isStatic() {
    const { studentTemplate } = this.props;
    return (
      studentTemplate.search(/\\MathQuillMathField\{(.*)\}/g) !== -1 && studentTemplate !== "\\MathQuillMathField{}"
    );
  }

  updateStaticMathFromUserAnswer() {
    const { userAnswer, studentTemplate } = this.props;
    if (!userAnswer) {
      this.setState({
        latex: studentTemplate,
        innerValues: []
      });
      return;
    }

    if (!this.isStatic()) return;

    const escapeRegExp = string => string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regexTemplate = new RegExp(
      escapeRegExp(studentTemplate).replace(/\\\\MathQuillMathField\\\{\\\}/g, "(.*)"),
      "g"
    );

    if (userAnswer && userAnswer.length > 0) {
      const userInnerValues = regexTemplate.exec(userAnswer);
      if (userInnerValues && userInnerValues.length > 0) {
        this.setState({ innerValues: userInnerValues.slice(1) });
      }
    } else {
      this.setState({ innerValues: [] });
    }
  }

  onUserResponse(latexv) {
    const { type: previewType, saveAnswer } = this.props;
    if (previewType === CHECK) return;
    if (this.isStatic()) {
      saveAnswer(latexv);
      return;
    }
    this.setState({ latex: latexv });
    saveAnswer(latexv);
  }

  onBlur(latexv) {
    const { type: previewType, saveAnswer } = this.props;
    if (this.isStatic() && previewType !== CHECK) {
      saveAnswer(latexv);
    }
  }

  onInnerFieldClick() {
    const { type: previewType, changePreviewTab } = this.props;

    if (previewType === CHECK) {
      changePreviewTab(CLEAR);
    }
  }

  render() {
    const { evaluation, item, type: previewType, showQuestionNumber, studentTemplate, theme } = this.props;
    const { latex, innerValues } = this.state;

    const hasAltAnswers =
      item && item.validation && item.validation.alt_responses && item.validation.alt_responses.length > 0;
    const cssStyles = getStylesFromUiStyleToCssStyle(item.ui_style);
    let statusColor = theme.widgets.mathFormula.inputColor;
    if (!isEmpty(evaluation) && (previewType === SHOW || previewType === CHECK)) {
      statusColor = !isEmpty(evaluation)
        ? evaluation.some(ie => ie)
          ? theme.widgets.mathFormula.inputCorrectColor
          : theme.widgets.mathFormula.inputIncorrectColor
        : theme.widgets.mathFormula.inputIncorrectColor;
    }
    return (
      <div>
        <QuestionTitleWrapper>
          {showQuestionNumber && <QuestionNumber>{item.qLabel}</QuestionNumber>}
          <MathFormulaDisplay
            data-cy="preview-header"
            style={{ marginBottom: 15 }}
            dangerouslySetInnerHTML={{ __html: item.stimulus }}
          />
        </QuestionTitleWrapper>

        <MathInputWrapper>
          {this.isStatic() && (
            <StaticMath
              symbols={item.symbols}
              numberPad={item.numberPad}
              ref={this.studentRef}
              onInput={latexv => this.onUserResponse(latexv)}
              onBlur={latexv => this.onBlur(latexv)}
              style={{ background: statusColor, ...cssStyles }}
              latex={studentTemplate}
              innerValues={innerValues}
              onInnerFieldClick={() => this.onInnerFieldClick()}
            />
          )}
          {!this.isStatic() && (
            <MathInput
              symbols={item.symbols}
              numberPad={item.numberPad}
              value={latex && !Array.isArray(latex) ? latex.replace("\\MathQuillMathField{}", "") : ""}
              onInput={latexv => this.onUserResponse(latexv)}
              onBlur={latexv => this.onBlur(latexv)}
              disabled={evaluation && !evaluation.some(ie => ie)}
              style={{ background: statusColor, ...cssStyles }}
            />
          )}
          {!isEmpty(evaluation) && (previewType === SHOW || previewType === CHECK) && (
            <MathInputStatus valid={!!evaluation && !!evaluation.some(ie => ie)} />
          )}
        </MathInputWrapper>

        {previewType === SHOW && item.validation.valid_response.value[0].value !== undefined && (
          <CorrectAnswerBox>{item.validation.valid_response.value[0].value}</CorrectAnswerBox>
        )}
        {hasAltAnswers && previewType === SHOW && (
          <CorrectAnswerBox altAnswers>
            {item.validation.alt_responses.map(ans => ans.value[0].value).join(", ")}
          </CorrectAnswerBox>
        )}
      </div>
    );
  }
}

export default withTheme(MathFormulaPreview);
