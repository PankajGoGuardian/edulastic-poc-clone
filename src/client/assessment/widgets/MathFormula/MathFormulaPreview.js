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
  QuestionNumberLabel,
  getInnerValuesForStatic,
  QuestionLabelWrapper,
  QuestionSubLabel,
  QuestionContentWrapper
} from "@edulastic/common";

import { greyThemeLight, white } from "@edulastic/colors";
import { SHOW, CHECK, CLEAR, EDIT } from "../../constants/constantsForQuestions";

import CorrectAnswerBox from "./components/CorrectAnswerBox/index";
import MathInputStatus from "./components/MathInputStatus/index";
import { UnitsDropdown } from "./components/MathFormulaAnswerMethod/options";

import MathInputWrapper from "./styled/MathInputWrapper";
import { QuestionTitleWrapper } from "./styled/QustionNumber";

import { getStylesFromUiStyleToCssStyle } from "../../utils/helpers";
import MathSpanWrapper from "../../components/MathSpanWrapper";
import Instructions from "../../components/Instructions";
import Spinner from "./components/Spinner";

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
    answerContextConfig: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    showQuestionNumber: PropTypes.bool
  };

  static defaultProps = {
    studentTemplate: "",
    userAnswer: null,
    testItem: false,
    showQuestionNumber: false
  };

  state = {
    innerValues: []
  };

  constructor(props) {
    super(props);
    this.state = {
      innerValues: []
    };
  }

  componentDidMount() {
    this.updateStaticMathFromUserAnswer();
  }

  componentDidUpdate(prevProps) {
    const {
      studentTemplate,
      type: previewType,
      answerContextConfig: { expressGrader, isAnswerModifiable },
      userAnswer
    } = this.props;
    const {
      studentTemplate: prevStudentTemplate,
      type: prevPreviewType,
      answerContextConfig: { isAnswerModifiable: prevIsAnswerModifiable },
      userAnswer: prevUserAnswer
    } = prevProps;

    if (
      (previewType !== prevPreviewType && previewType === CLEAR) ||
      studentTemplate !== prevStudentTemplate ||
      (expressGrader && isAnswerModifiable && isAnswerModifiable !== prevIsAnswerModifiable) ||
      userAnswer !== prevUserAnswer
    ) {
      this.updateStaticMathFromUserAnswer();
    }
  }

  get isStatic() {
    const { studentTemplate, item } = this.props;
    return (
      (studentTemplate &&
        studentTemplate.search(/\\MathQuillMathField\{(.*)\}/g) !== -1 &&
        studentTemplate !== "\\MathQuillMathField{}") ||
      item.templateDisplay
    );
  }

  getValidLatex(props) {
    const { studentTemplate, userAnswer, item } = props;
    if (this.isStatic) {
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

    if (!this.isStatic) return;

    const innerValues = getInnerValuesForStatic(studentTemplate, userAnswer);
    this.setState({ innerValues });
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

    if (this.isStatic && previewType !== CHECK) {
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
    const { userAnswer, testItem, item } = this.props;
    if (!testItem && userAnswer) {
      return userAnswer.unit;
    }
    if (testItem) {
      return get(item, "validation.validResponse.value[0].options.unit", "");
    }
    return "";
  }

  render() {
    const {
      evaluation: mathEvaluation,
      item,
      type: previewType,
      showQuestionNumber,
      studentTemplate,
      testItem,
      theme,
      userAnswer,
      disableResponse,
      answerContextConfig,
      showCalculatingSpinner,
      view,
      isPrintPreview
    } = this.props;
    const { expressGrader, isAnswerModifiable } = answerContextConfig;
    const { innerValues } = this.state;

    const latex = this.getValidLatex(this.props);
    const evaluation = Array.isArray(mathEvaluation) ? mathEvaluation : [];
    const hasAltAnswers =
      item && item.validation && item.validation.altResponses && item.validation.altResponses.length > 0;
    const cssStyles = getStylesFromUiStyleToCssStyle(item.uiStyle);
    let answerContainerStyle = {};
    let statusColor = theme.widgets.mathFormula.inputColor;
    if (latex && !isEmpty(evaluation) && (previewType === SHOW || previewType === CHECK)) {
      statusColor = !isEmpty(evaluation)
        ? evaluation?.some(ie => ie)
          ? theme.widgets.mathFormula.inputCorrectColor
          : theme.widgets.mathFormula.inputIncorrectColor
        : theme.widgets.mathFormula.inputIncorrectColor;

      answerContainerStyle = {
        background: !isPrintPreview && statusColor,
        border: "1px solid",
        width: "fit-content",
        position: "relative",
        borderRadius: 4,
        paddingRight: 30,
        borderColor:
          !isPrintPreview &&
          (!isEmpty(evaluation)
            ? evaluation?.some(ie => ie)
              ? theme.widgets.mathFormula.inputCorrectBorderColor
              : theme.widgets.mathFormula.inputIncorrectBorderColor
            : theme.widgets.mathFormula.inputIncorrectBorderColor)
      };
    }
    if (expressGrader && isAnswerModifiable) {
      statusColor = theme.widgets.mathFormula.inputColor;
    }

    const testItemCorrectValues = testItem
      ? item?.validation?.validResponse?.value?.map(validResponse => validResponse.value)
      : [];

    const customKeys = get(item, "customKeys", []);
    const allowNumericOnly = get(item, "allowNumericOnly", false);

    // in Units type, this need when the show dropdown option is true
    let correctUnit = get(item, "validation.validResponse.value[0].options.unit", "");
    if ((correctUnit.search("text{") === -1 && correctUnit.search("f") !== -1) || correctUnit.search(/\s/g) !== -1) {
      correctUnit = `\\text{${correctUnit}}`;
    }

    let statusIcon = latex && !isEmpty(evaluation) && (previewType === SHOW || previewType === CHECK) && (
      <MathInputStatus valid={!!evaluation && !!evaluation?.some(ie => ie)} />
    );

    if (expressGrader && isAnswerModifiable) {
      statusIcon = null;
    }
    return (
      <div>
        {showCalculatingSpinner && <Spinner />}
        <FlexContainer justifyContent="flex-start" alignItems="baseline" width="100%">
          <QuestionLabelWrapper>
            {showQuestionNumber && <QuestionNumberLabel>{item.qLabel}</QuestionNumberLabel>}
            {item.qSubLabel && <QuestionSubLabel>({item.qSubLabel})</QuestionSubLabel>}
          </QuestionLabelWrapper>

          <QuestionContentWrapper>
            <QuestionTitleWrapper>
              <MathFormulaDisplay
                data-cy="preview-header"
                style={{ marginBottom: 15 }}
                dangerouslySetInnerHTML={{ __html: item.stimulus }}
              />
            </QuestionTitleWrapper>
            {testItem && (
              <FlexContainer alignItems="stretch" justifyContent="flex-start" width="100%">
                <MathDisplay styles={cssStyles} template="\MathQuillMathField{}" innerValues={testItemCorrectValues} />
                {item.isUnits && item.showDropdown && (
                  <UnitsDropdown
                    preview
                    disabled
                    item={item}
                    selected={this.selectedUnit}
                    onChange={this.selectUnitFromDropdown}
                    statusColor={isPrintPreview ? white : statusColor}
                  />
                )}
              </FlexContainer>
            )}

            {!testItem && (
              <FlexContainer
                alignItems="stretch"
                justifyContent="flex-start"
                style={item.isUnits && item.showDropdown ? answerContainerStyle : {}}
                width="100%"
              >
                <MathInputWrapper bg={isPrintPreview ? white : statusColor} minWidth={cssStyles.width}>
                  {this.isStatic && !disableResponse && (
                    <StaticMath
                      symbols={item.symbols}
                      restrictKeys={this.restrictKeys}
                      allowNumericOnly={allowNumericOnly}
                      customKeys={customKeys}
                      numberPad={item.numberPad}
                      hideKeypad={item.isUnits && item.showDropdown}
                      onInput={latexv => this.onUserResponse(latexv)}
                      onBlur={latexv => this.onBlur(latexv)}
                      latex={studentTemplate}
                      innerValues={innerValues}
                      onInnerFieldClick={() => this.onInnerFieldClick()}
                      isPrintPreview={isPrintPreview}
                      noBorder
                    />
                  )}
                  {this.isStatic && disableResponse && (
                    <MathInputSpan>
                      <MathSpanWrapper latex={userAnswer || ""} />
                    </MathInputSpan>
                  )}
                  {!this.isStatic && !disableResponse && (
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
                      disabled={evaluation && !evaluation?.some(ie => ie)}
                      onInnerFieldClick={() => this.onInnerFieldClick()}
                    />
                  )}
                  {!this.isStatic && disableResponse && (
                    <MathInputSpan>
                      <MathSpanWrapper
                        latex={latex && !Array.isArray(latex) ? latex.replace("\\MathQuillMathField{}", "") : ""}
                      />
                    </MathInputSpan>
                  )}
                  {!item.showDropdown && statusIcon}
                </MathInputWrapper>
                {item.isUnits && item.showDropdown && (
                  <>
                    <UnitsDropdown
                      item={item}
                      preview
                      onChange={this.selectUnitFromDropdown}
                      selected={this.selectedUnit}
                      disabled={disableResponse}
                      statusColor={isPrintPreview ? white : statusColor}
                      keypadMode={item?.keypadMode} // to get selected keypadMode on student side
                    />
                    {statusIcon}
                  </>
                )}
              </FlexContainer>
            )}
            {view && view !== EDIT && <Instructions item={item} />}
            {previewType === SHOW && item.validation.validResponse.value[0].value !== undefined && (
              <CorrectAnswerBox
                theme={theme}
                answer={
                  item.isUnits && item.showDropdown
                    ? item.validation.validResponse.value[0].value.search("=") === -1
                      ? `${item.validation.validResponse.value[0].value}\\ ${correctUnit}`
                      : item.validation.validResponse.value[0].value.replace(/=/gm, `\\ ${correctUnit}=`)
                    : item.validation.validResponse.value[0].value
                }
              />
            )}
            {hasAltAnswers &&
              previewType === SHOW &&
              item?.validation?.altResponses.map((ans, index) => {
                let answer = "";

                answer = ans?.value?.[0]?.value;

                if (item.isUnits && item.showDropdown) {
                  let altUnit = get(ans, "value[0].options.unit", "");
                  if ((altUnit.search("text{") === -1 && altUnit.search("f") !== -1) || altUnit.search(/\s/g) !== -1) {
                    altUnit = `\\text{${altUnit}}`;
                  }

                  answer =
                    ans.value[0].value.search("=") === -1
                      ? `${ans.value[0].value}\\ ${altUnit}`
                      : ans.value[0].value.replace(/=/gm, `\\ ${altUnit}=`);
                }

                return <CorrectAnswerBox altAnswers theme={theme} answer={answer} index={index + 1} />;
              })}
          </QuestionContentWrapper>
        </FlexContainer>
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
  border: 1px solid ${greyThemeLight};
  padding: ${({ width }) => (width ? "3px" : "5px 25px")};
`;
