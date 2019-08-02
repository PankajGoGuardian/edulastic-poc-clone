import React, { Component } from "react";
import PropTypes from "prop-types";
import styled, { withTheme } from "styled-components";
import { isEmpty, get } from "lodash";

import {
  MathInput,
  StaticMath,
  MathFormulaDisplay,
  MathDisplay,
  FlexContainer,
  QuestionNumberLabel
} from "@edulastic/common";

import { SHOW, CHECK, CLEAR } from "../../constants/constantsForQuestions";

import CorrectAnswerBox from "./components/CorrectAnswerBox/index";
import MathInputStatus from "./components/MathInputStatus/index";
import { UnitsDropdown } from "./components/MathFormulaAnswerMethod/options";

import MathInputWrapper from "./styled/MathInputWrapper";
import { QuestionTitleWrapper } from "./styled/QustionNumber";

import { getStylesFromUiStyleToCssStyle } from "../../utils/helpers";
import MathSpanWrapper from "../../components/MathSpanWrapper";

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
    disableResponse: PropTypes.bool.isRequired,
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
    const { studentTemplate, userAnswer, item } = props;
    if (this.isStatic()) {
      return studentTemplate;
    }

    if (userAnswer) {
      if (typeof userAnswer === "string") {
        return userAnswer;
      }

      const { isUnits, showDropdown } = item;
      if (isUnits && showDropdown && typeof userAnswer === "object") {
        return userAnswer.expression;
      }

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
    const { saveAnswer, userAnswer, item } = this.props;
    // if (previewType === CHECK) return;
    const { isUnits, showDropdown } = item;
    if (isUnits && showDropdown) {
      saveAnswer({ ...userAnswer, expression: latexv });
    } else {
      saveAnswer(latexv);
    }
  }

  onBlur(latexv) {
    const { type: previewType, saveAnswer, userAnswer, item } = this.props;
    const { isUnits, showDropdown } = item;

    if (this.isStatic() && previewType !== CHECK) {
      if (isUnits && showDropdown) {
        saveAnswer({ ...userAnswer, expression: latexv });
      } else {
        saveAnswer(latexv);
      }
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
    const { type: previewType, changePreview, changePreviewTab, disableResponse } = this.props;

    if ((previewType === SHOW || previewType === CHECK) && !disableResponse) {
      changePreview(CLEAR); // Item level
      changePreviewTab(CLEAR); // Question level
    }
  }

  selectUnitFromDropdown = unit => {
    const { userAnswer, saveAnswer, type: previewType, changePreview, changePreviewTab, disableResponse } = this.props;
    saveAnswer({ ...userAnswer, unit });
    if ((previewType === SHOW || previewType === CHECK) && !disableResponse) {
      changePreview(CLEAR); // Item level
      changePreviewTab(CLEAR); // Question level
    }
  };

  get restrictKeys() {
    const { item } = this.props;
    const { allowedVariables } = item;
    return allowedVariables ? allowedVariables.split(",").map(segment => segment.trim()) : [];
  }

  get selectedUnit() {
    const { userAnswer } = this.props;
    if (userAnswer) {
      return userAnswer.unit;
    }
    return "";
  }

  render() {
    const {
      evaluation,
      item,
      type: previewType,
      showQuestionNumber,
      studentTemplate,
      testItem,
      theme,
      disableResponse
    } = this.props;
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
    cssStyles.width = cssStyles.width || cssStyles.minWidth;
    const testItemCorrectValues = testItem
      ? item.validation.valid_response.value.map(validResponse => validResponse.value)
      : [];

    const customKeys = get(item, "custom_keys", []);
    const allowNumericOnly = get(item, "allowNumericOnly", false);

    // in Units type, this need when the show dropdown option is true
    const correctUnit = get(item, "validation.valid_response.value[0].options.unit", "");

    return (
      <div>
        <QuestionTitleWrapper>
          {showQuestionNumber && <QuestionNumberLabel>{item.qLabel}:</QuestionNumberLabel>}
          <MathFormulaDisplay
            data-cy="preview-header"
            style={{ marginBottom: 15 }}
            dangerouslySetInnerHTML={{ __html: item.stimulus }}
          />
        </QuestionTitleWrapper>

        {testItem && <MathDisplay template={studentTemplate} innerValues={testItemCorrectValues} />}

        {!testItem && (
          <FlexContainer alignItems="flex-start" justifyContent="flex-start">
            <MathInputWrapper width={cssStyles.width}>
              {this.isStatic() && (
                <StaticMath
                  symbols={item.symbols}
                  restrictKeys={this.restrictKeys}
                  allowNumericOnly={allowNumericOnly}
                  customKeys={customKeys}
                  numberPad={item.numberPad}
                  hideKeypad={item.isUnits && item.showDropdown}
                  ref={this.studentRef}
                  onInput={latexv => this.onUserResponse(latexv)}
                  onBlur={latexv => this.onBlur(latexv)}
                  style={{ background: statusColor, ...cssStyles }}
                  latex={studentTemplate}
                  innerValues={innerValues}
                  onInnerFieldClick={() => this.onInnerFieldClick()}
                />
              )}
              {!this.isStatic() && !disableResponse && (
                <MathInput
                  symbols={item.symbols}
                  restrictKeys={this.restrictKeys}
                  allowNumericOnly={allowNumericOnly}
                  customKeys={customKeys}
                  numberPad={item.numberPad}
                  hideKeypad={item.isUnits && item.showDropdown}
                  value={latex && !Array.isArray(latex) ? latex.replace("\\MathQuillMathField{}", "") : ""}
                  onInput={latexv => this.onUserResponse(latexv)}
                  onBlur={latexv => this.onBlur(latexv)}
                  disabled={evaluation && !evaluation.some(ie => ie)}
                  onInnerFieldClick={() => this.onInnerFieldClick()}
                  style={{ background: statusColor, ...cssStyles }}
                />
              )}
              {!this.isStatic() && disableResponse && (
                <MathInputSpan style={{ background: statusColor, ...cssStyles }}>
                  <MathSpanWrapper
                    latex={latex && !Array.isArray(latex) ? latex.replace("\\MathQuillMathField{}", "") : ""}
                  />
                </MathInputSpan>
              )}
              {latex && !isEmpty(evaluation) && (previewType === SHOW || previewType === CHECK) && (
                <MathInputStatus valid={!!evaluation && !!evaluation.some(ie => ie)} />
              )}
            </MathInputWrapper>
            {item.isUnits && item.showDropdown && (
              <UnitsDropdown
                item={item}
                preview
                onChange={this.selectUnitFromDropdown}
                selected={this.selectedUnit}
                disabled={disableResponse}
              />
            )}
          </FlexContainer>
        )}

        {!testItem && previewType === SHOW && item.validation.valid_response.value[0].value !== undefined && (
          <CorrectAnswerBox>
            {item.isUnits && item.showDropdown
              ? item.validation.valid_response.value[0].value.search("=") === -1
                ? item.validation.valid_response.value[0].value + correctUnit
                : item.validation.valid_response.value[0].value.replace(/=/gm, `${correctUnit}=`)
              : item.validation.valid_response.value[0].value}
          </CorrectAnswerBox>
        )}
        {!testItem && hasAltAnswers && previewType === SHOW && (
          <CorrectAnswerBox altAnswers>
            {item.validation.alt_responses
              .map(ans => {
                if (item.isUnits && item.showDropdown) {
                  const altUnit = !ans.value[0].options.unit ? "" : ans.value[0].options.unit;
                  return ans.value[0].value.search("=") === -1
                    ? ans.value[0].value + altUnit
                    : ans.value[0].value.replace(/=/gm, `${altUnit}=`);
                }
                return ans.value[0].value;
              })
              .join(", ")}
          </CorrectAnswerBox>
        )}
      </div>
    );
  }
}

export default withTheme(MathFormulaPreview);
const MathInputSpan = styled.div`
  align-items: center;
  min-width: ${({ width }) => (width ? "unset" : "80px")};
  min-height: 42px;
  display: inline-flex;
  width: ${({ width }) => width || "100%"};
  padding-right: ${({ width }) => (width ? "unset" : "40px")};
  position: relative;
  border-radius: 5px;
  border: 1px solid #dfdfdf;
  padding: ${({ width }) => (width ? "3px" : "5px 25px")};
`;
