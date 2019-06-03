import PropTypes from "prop-types";
import React, { Component } from "react";
import styled from "styled-components";

import { InstructorStimulus, WithMathFormula, PreWrapper } from "@edulastic/common";

import { QuestionHeader } from "../../styled/QuestionHeader";
import CheckboxTemplateBoxLayout from "./components/CheckboxTemplateBoxLayout";
import CorrectAnswerBoxLayout from "./components/CorrectAnswerBoxLayout";
import ClozeTextInput from "../../components/ClozeTextInput";

const MathSpan = WithMathFormula(styled.span`
  user-select: none;
  line-height: ${props => props.lineHeight};
`);

const QuestionTitleWrapper = styled.div`
  display: flex;
`;

const QuestionNumber = styled.div`
  font-weight: 700;
  margin-right: 4px;
`;

class ClozeTextDisplay extends Component {
  constructor(props) {
    super(props);
    const { templateParts, respLength, responseParts } = this.getTemplateParts(props);
    const userAnswers = new Array(respLength).fill("");
    props.userSelections.forEach((userSelection, index) => {
      userAnswers[index] = userSelection;
    });

    this.state = {
      templateParts,
      responseParts,
      userAnswers
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state !== undefined) {
      const { onChange: changeAnswers } = this.props;
      const { userAnswers, responseParts } = this.state;
      const { templateParts, respLength, responseParts: currentResParts } = this.getTemplateParts(nextProps);
      let newUserAnswers = new Array(respLength).fill("");
      if (userAnswers.length < respLength) {
        newUserAnswers.splice(0, userAnswers.length, ...userAnswers);
      } else if (userAnswers.length > respLength) {
        newUserAnswers.splice(0, userAnswers.length, ...userAnswers);
        for (const i in currentResParts) {
          if (currentResParts[i] !== responseParts[i]) {
            newUserAnswers.splice(i, 1);
            break;
          }
        }
        if (userAnswers.length === newUserAnswers.length) {
          newUserAnswers.splice(-1);
        }
      }
      if (userAnswers.length !== respLength) {
        changeAnswers(newUserAnswers);
        this.setState({
          userAnswers: newUserAnswers,
          responseParts: currentResParts,
          templateParts
        });
      } else {
        this.setState({
          userAnswers: nextProps.userSelections ? [...nextProps.userSelections] : [],
          responseParts: currentResParts,
          templateParts
        });
      }
    }
  }

  getTemplateParts = props => {
    const { templateMarkUp } = props;
    const templateParts = templateMarkUp.match(/(<p.*?<\/p>)|(<span.*?><\/span>)/g);
    const responseParts = templateMarkUp.match(/<p class="response-btn.*?<\/p>/g);
    const respLength = responseParts !== null ? responseParts.length : 0;
    return { templateParts, respLength, responseParts };
  };

  selectChange = (value, index) => {
    const { userAnswers: newAnswers } = this.state;
    const { onChange: changeAnswers } = this.props;
    newAnswers[index] = value;
    this.setState({ userAnswers: newAnswers });
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
      showIndex
    } = this.props;
    const { templateParts, userAnswers } = this.state;
    let responseIndex = 0;
    // const responses = cloneDeep(options);

    // Layout Options
    const fontSize = this.getFontSize(uiStyle.fontsize);
    const { widthpx, heightpx, placeholder, inputtype, responsecontainerindividuals, stemnumeration } = uiStyle;

    const responseBtnStyle = {
      widthpx: widthpx !== 0 ? widthpx : 140,
      heightpx: heightpx !== 0 ? heightpx : 35
    };
    let maxLineHeight = smallSize ? 50 : 40;
    const previewTemplateBoxLayout = (
      <PreWrapper>
        <div
          className={`template_box ${smallSize ? "text-small" : ""}`}
          style={{ fontSize: smallSize ? 14 : fontSize, padding: smallSize ? 0 : 20 }}
        >
          {Array.isArray(templateParts) &&
            templateParts.map((templatePart, index) => {
              if (templatePart.indexOf('class="response-btn"') !== -1) {
                const dropTargetIndex = responseIndex;
                responseIndex++;
                const btnStyle = {
                  width: widthpx || 140,
                  height: 0,
                  minWidth: 100,
                  widthpx: widthpx || 140,
                  heightpx: 0,
                  placeholder,
                  inputtype
                };
                if (responsecontainerindividuals && responsecontainerindividuals[dropTargetIndex]) {
                  const {
                    widthpx: widthpx1,
                    heightpx: heightpx1,
                    placeholder: placeholder1,
                    inputtype: inputtype1
                  } = responsecontainerindividuals[dropTargetIndex];
                  btnStyle.width = widthpx1;
                  btnStyle.height = heightpx1;
                  btnStyle.widthpx = widthpx1;
                  btnStyle.heightpx = heightpx1;
                  btnStyle.placeholder = placeholder1;
                  btnStyle.inputtype = inputtype1;
                }
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
                maxLineHeight = maxLineHeight < btnStyle.height ? btnStyle.height : maxLineHeight;
                return (
                  <ClozeTextInput
                    value={userAnswers[dropTargetIndex]}
                    style={{ height: btnStyle.height, minWidth: 100 }}
                    btnStyle={btnStyle}
                    dropTargetIndex={dropTargetIndex}
                    onChange={this._changeInput}
                    placeholder={btnStyle.placeholder}
                    type={btnStyle.inputtype}
                    item={item}
                    showIndex={showIndex}
                    indexNumber={responseIndex}
                  />
                );
              }
              return (
                <MathSpan
                  lineHeight={`${maxLineHeight}px`}
                  key={index}
                  dangerouslySetInnerHTML={{ __html: templatePart }}
                />
              );
            })}
        </div>
      </PreWrapper>
    );

    const checkboxTemplateBoxLayout = (
      <CheckboxTemplateBoxLayout
        templateParts={templateParts}
        responsecontainerindividuals={responsecontainerindividuals}
        responseBtnStyle={responseBtnStyle}
        stemNumeration={stemnumeration}
        fontSize={fontSize}
        showAnswer={showAnswer}
        userSelections={userAnswers}
        evaluation={evaluation}
        showIndex={showIndex}
        uiStyle={uiStyle}
      />
    );
    const templateBoxLayout = showAnswer || checkAnswer ? checkboxTemplateBoxLayout : previewTemplateBoxLayout;
    const correctAnswerBoxLayout = showAnswer ? (
      <CorrectAnswerBoxLayout
        fontSize={fontSize}
        groupResponses={options}
        userAnswers={validation.valid_response && validation.valid_response.value}
        altAnswers={validation.hasOwnProperty("alt_responses") && validation.alt_responses}
      />
    ) : (
      <div />
    );
    const answerBox = showAnswer ? correctAnswerBoxLayout : <div />;
    return (
      <div style={{ fontSize }}>
        {instructorStimulus && instructorStimulus !== "<p><br></p>" && (
          <InstructorStimulus dangerouslySetInnerHTML={{ __html: instructorStimulus }} />
        )}
        <QuestionTitleWrapper>
          {showQuestionNumber && <QuestionNumber>{`Q${qIndex + 1}`}</QuestionNumber>}
          <QuestionHeader smallSize={smallSize} dangerouslySetInnerHTML={{ __html: question }} />
        </QuestionTitleWrapper>
        <div>
          <React.Fragment>
            <div style={{ margin: smallSize ? "-10px -20px" : 0, borderRadius: 0 }}>{templateBoxLayout}</div>
          </React.Fragment>
        </div>
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
