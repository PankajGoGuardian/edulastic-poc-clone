import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTheme } from "styled-components";
import { isEmpty, get } from "lodash";

import { MathInput, StaticMath, MathFormulaDisplay, MathDisplay } from "@edulastic/common";

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
    changePreviewTab: PropTypes.func.isRequired,
    changePreview: PropTypes.func.isRequired,
    saveAnswer: PropTypes.func.isRequired,
    evaluation: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
    userAnswer: PropTypes.any,
    testItem: PropTypes.bool,
    theme: PropTypes.object.isRequired,
    showQuestionNumber: PropTypes.bool
  };

  static defaultProps = {
    studentTemplate: "",
    userAnswer: null,
    testItem: false,
    showQuestionNumber: false
  };

  studentRef = React.createRef();

  state = {
    innerValues: []
  };

  constructor(props) {
    super(props);
    this.state = {
      innerValues: []
    };
  }

  componentDidUpdate(prevProps) {
    const { studentTemplate, type: previewType } = this.props;
    const { studentTemplate: prevStudentTemplate, type: prevPreviewType } = prevProps;

    if ((previewType !== prevPreviewType && previewType === CLEAR) || studentTemplate !== prevStudentTemplate) {
      this.updateStaticMathFromUserAnswer();
    }
  }

  isStatic() {
    const { studentTemplate } = this.props;
    return (
      studentTemplate.search(/\\MathQuillMathField\{(.*)\}/g) !== -1 && studentTemplate !== "\\MathQuillMathField{}"
    );
  }

  getValidLatex(props) {
    const { studentTemplate, userAnswer } = props;
    if (this.isStatic()) {
      return studentTemplate;
    }
    if (userAnswer) {
      if (typeof userAnswer === "string") return userAnswer;
      return userAnswer[0];
    }
    return studentTemplate;
  }

  updateStaticMathFromUserAnswer() {
    const { userAnswer, studentTemplate } = this.props;
    if (!userAnswer) {
      this.setState({
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
    const { saveAnswer } = this.props;
    // if (previewType === CHECK) return;
    if (this.isStatic()) {
      saveAnswer(latexv);
      return;
    }

    saveAnswer(latexv);
  }

  onBlur(latexv) {
    const { type: previewType, saveAnswer } = this.props;
    if (this.isStatic() && previewType !== CHECK) {
      saveAnswer(latexv);
    }
  }

  specialKeyCheck = e => {
    if (!e) {
      return false;
    }

    if (e === "cmd") {
      return true;
    }

    const isSpecialChar = !!(e.key.length > 1 || e.key.match(/[^a-zA-Z]/g));
    const isArrowOrShift = (e.keyCode >= 37 && e.keyCode <= 40) || e.keyCode === 16 || e.keyCode === 8;

    if (!isSpecialChar || isArrowOrShift) {
      return false;
    }
    return true;
  };

  onInnerFieldClick() {
    const { type: previewType, changePreview, changePreviewTab } = this.props;

    if (previewType === SHOW || previewType === CHECK) {
      changePreview(CLEAR); // Item level
      changePreviewTab(CLEAR); // Question level
    }
  }

  get restrictKeys() {
    const { item } = this.props;
    const { options = {} } = get(item, ["validation", "valid_response", "value", 0], {});
    const { allowedVariables } = options;

    return allowedVariables ? allowedVariables.split(",").map(segment => segment.trim()) : [];
  }

  render() {
    const { evaluation, item, type: previewType, showQuestionNumber, studentTemplate, testItem, theme } = this.props;
    const { innerValues } = this.state;

    const latex = this.getValidLatex(this.props);

    const hasAltAnswers =
      item && item.validation && item.validation.alt_responses && item.validation.alt_responses.length > 0;
    const cssStyles = getStylesFromUiStyleToCssStyle(item.ui_style);
    let statusColor = theme.widgets.mathFormula.inputColor;
    if (latex && !isEmpty(evaluation) && (previewType === SHOW || previewType === CHECK)) {
      statusColor = !isEmpty(evaluation)
        ? evaluation.some(ie => ie)
          ? theme.widgets.mathFormula.inputCorrectColor
          : theme.widgets.mathFormula.inputIncorrectColor
        : theme.widgets.mathFormula.inputIncorrectColor;
    }

    const testItemCorrectValues = testItem
      ? item.validation.valid_response.value.map(validResponse => validResponse.value)
      : [];
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

        {testItem && <MathDisplay template={studentTemplate} innerValues={testItemCorrectValues} />}

        {!testItem && (
          <MathInputWrapper>
            {this.isStatic() && (
              <StaticMath
                symbols={item.symbols}
                restrictKeys={this.restrictKeys}
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
                restrictKeys={this.restrictKeys}
                numberPad={item.numberPad}
                value={latex && !Array.isArray(latex) ? latex.replace("\\MathQuillMathField{}", "") : ""}
                onInput={latexv => this.onUserResponse(latexv)}
                onBlur={latexv => this.onBlur(latexv)}
                disabled={evaluation && !evaluation.some(ie => ie)}
                onInnerFieldClick={() => this.onInnerFieldClick()}
                style={{ background: statusColor, ...cssStyles }}
              />
            )}
            {latex && !isEmpty(evaluation) && (previewType === SHOW || previewType === CHECK) && (
              <MathInputStatus valid={!!evaluation && !!evaluation.some(ie => ie)} />
            )}
          </MathInputWrapper>
        )}

        {!testItem && previewType === SHOW && item.validation.valid_response.value[0].value !== undefined && (
          <CorrectAnswerBox>{item.validation.valid_response.value[0].value}</CorrectAnswerBox>
        )}
        {!testItem && hasAltAnswers && previewType === SHOW && (
          <CorrectAnswerBox altAnswers>
            {item.validation.alt_responses.map(ans => ans.value[0].value).join(", ")}
          </CorrectAnswerBox>
        )}
      </div>
    );
  }
}

export default withTheme(MathFormulaPreview);
