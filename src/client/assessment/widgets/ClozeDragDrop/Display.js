/* eslint-disable no-undef */
import PropTypes from "prop-types";
import React, { Component } from "react";
import { cloneDeep, isEmpty, get } from "lodash";
import { withTheme } from "styled-components";
import uuid from "uuid/v4";

import JsxParser from "react-jsx-parser";

import { InstructorStimulus, PreWrapper, helpers, Stimulus } from "@edulastic/common";

import CorrectAnswerBoxLayout from "../../components/CorrectAnswerBoxLayout";
import AlternateAnswerBoxLayout from "./components/AlternateAnswerBoxLayout";

import CheckboxTemplateBoxLayout from "./components/CheckboxTemplateBoxLayout";
import ResponseBoxLayout from "./components/ResponseBoxLayout";
import TemplateBox from "./components/TemplateBox";
import { AnswerContainer } from "./styled/AnswerContainer";
import { QuestionTitleWrapper, QuestionNumber } from "./styled/QustionNumber";
import { getFontSize } from "../../utils/helpers";
import MathSpanWrapper from "../../components/MathSpanWrapper";

class ClozeDragDropDisplay extends Component {
  constructor(props) {
    super(props);
    const { template } = props;
    const respLength = this.getResponsesCount(template);
    const userAnswers = new Array(respLength).fill(false);
    props.userSelections.map((userSelection, index) => {
      userAnswers[index] = userSelection;
      return 0;
    });
    const possibleResponses = this.getInitialResponses(props);

    this.state = {
      userAnswers,
      possibleResponses
    };
  }

  componentDidMount() {
    const { template } = this.props;
    this.setState({ parsedTemplate: helpers.parseTemplate(template) });
  }

  componentWillReceiveProps(nextProps) {
    if (this.state !== undefined) {
      const possibleResponses = this.getInitialResponses(nextProps);
      const parsedTemplate = helpers.parseTemplate(nextProps.template);
      this.setState({
        userAnswers: nextProps.userSelections ? [...nextProps.userSelections] : [],
        possibleResponses,
        parsedTemplate
      });
    }
  }

  getResponsesCount = template => {
    if (!window.$) {
      return 0;
    }
    return $($("<div />").html(template)).find("response").length;
  };

  onDrop = (data, index) => {
    const { userAnswers: newAnswers, possibleResponses } = this.state;
    const { onChange: changeAnswers, hasGroupResponses, userSelections, configureOptions, options } = this.props;
    const { duplicatedResponses: isDuplicated } = configureOptions;
    const newResponses = cloneDeep(possibleResponses);

    // Remove duplicated responses if duplicated option is disable
    if (!isDuplicated) {
      if (hasGroupResponses) {
        const groupIndex = data.split("_")[1];
        const groupData = data.split("_")[0];
        const sourceIndex = data.split("_")[2];
        const fromResp = data.split("_")[3];
        if (fromResp) {
          const temp = newAnswers[sourceIndex];
          newAnswers[sourceIndex] = newAnswers[index];
          newAnswers[index] = temp;
        } else {
          for (let i = 0; i < newResponses[groupIndex].options.length; i++) {
            if (newResponses[groupIndex].options[i].value === groupData) {
              if (userSelections && userSelections[index] !== null && typeof userSelections[index] === "object") {
                newResponses[userSelections[index].group].options.push({
                  value: uuid(),
                  label: userSelections[index].data
                });
              }
              newResponses[groupIndex].options.splice(i, 1);
              break;
            }
          }
        }
        newAnswers[index] = {
          group: groupIndex,
          data: groupData
        };
      } else {
        const sourceIndex = data.split("_")[1];
        const sourceData = data.split("_")[0];
        const fromResp = data.split("_")[2];
        if (fromResp) {
          const temp = newAnswers[sourceIndex];
          newAnswers[sourceIndex] = newAnswers[index];
          newAnswers[index] = temp;
        } else {
          newAnswers[index] = options.find(option => option.value === sourceData).value;
          for (let i = 0; i < newResponses.length; i++) {
            if (newResponses[i].value === sourceData) {
              newResponses.splice(i, 1);
              break;
            }
          }
        }
      }
    } else if (hasGroupResponses) {
      const groupIndex = data.split("_")[1];
      const groupData = data.split("_")[0];
      const sourceIndex = data.split("_")[2];
      const fromResp = data.split("_")[3];

      if (fromResp) {
        const temp = newAnswers[sourceIndex];
        newAnswers[sourceIndex] = newAnswers[index];
        newAnswers[index] = temp;
      }
      newAnswers[index] = {
        group: groupIndex,
        data: groupData
      };
    } else {
      const value = data.split("_")[0];
      const sourceIndex = data.split("_")[1];
      const fromResp = data.split("_")[2];
      if (fromResp) {
        const temp = newAnswers[sourceIndex];
        newAnswers[sourceIndex] = newAnswers[index];
        newAnswers[index] = temp;
      } else {
        newAnswers[index] = options.find(option => option.value === value).value;
        newResponses.splice(newResponses.indexOf(resp => resp.value === value), 1);
      }
    }

    this.setState({ userAnswers: newAnswers, possibleResponses: newResponses });
    changeAnswers(newAnswers);
  };

  shuffle = arr => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  shuffleGroup = data =>
    data.map(arr => {
      arr.options = this.shuffle(arr.options);
      return arr;
    });

  getInitialResponses = props => {
    const { hasGroupResponses, configureOptions, userSelections: userSelectionsProp, options } = props;
    const { duplicatedResponses: isDuplicated } = configureOptions;
    const userSelections = userSelectionsProp || [];

    let possibleResps = [];
    possibleResps = cloneDeep(options);

    if (!isDuplicated) {
      if (hasGroupResponses) {
        userSelections.forEach(userSelection => {
          if (userSelection !== null && typeof userSelection === "object") {
            for (let i = 0; i < possibleResps[userSelection.group].options.length; i++) {
              if (possibleResps[userSelection.group].options[i].value === userSelection.data) {
                possibleResps[userSelection.group].options.splice(i, 1);
                break;
              }
            }
          }
        });
      } else {
        for (let j = 0; j < userSelections.length; j++) {
          for (let i = 0; i < possibleResps.length; i++) {
            if (possibleResps[i].value === userSelections[j]) {
              possibleResps.splice(i, 1);
              break;
            }
          }
        }
      }
    }

    return possibleResps;
  };

  getBtnStyles = () => {
    const { uiStyle } = this.props;

    const btnStyle = {
      width: 0,
      height: 0,
      widthpx: 0,
      heightpx: 0,
      whiteSpace: undefined,
      wordwrap: undefined
    };

    const responseBtnStyle = {
      widthpx: uiStyle.widthpx !== 0 ? uiStyle.widthpx : "auto",
      heightpx: uiStyle.heightpx !== 0 ? uiStyle.heightpx : "auto",
      whiteSpace: uiStyle.wordwrap ? "inherit" : "nowrap"
    };

    // if (responsecontainerindividuals && responsecontainerindividuals[dropTargetIndex]) {
    //   const { widthpx, heightpx, wordwrap } = responsecontainerindividuals[dropTargetIndex];
    //   btnStyle.width = widthpx;
    //   btnStyle.height = heightpx;
    //   btnStyle.whiteSpace = wordwrap;
    //   btnStyle.widthpx = widthpx;
    //   btnStyle.heightpx = heightpx;
    //   btnStyle.wordwrap = wordwrap;
    // }

    // if (btnStyle && btnStyle.width === 0) {
    //   btnStyle.width = responseBtnStyle.widthpx;
    // } else {
    //   btnStyle.width = btnStyle.widthpx;
    // }
    if (btnStyle && btnStyle.height === 0) {
      btnStyle.height = responseBtnStyle.heightpx;
    } else {
      btnStyle.height = btnStyle.heightpx;
    }
    if (btnStyle && btnStyle.whiteSpace === undefined) {
      btnStyle.whiteSpace = responseBtnStyle.whiteSpace;
    } else {
      btnStyle.whiteSpace = btnStyle.wordwrap;
    }

    return { btnStyle, responseBtnStyle };
  };

  render() {
    const {
      smallSize,
      question,
      configureOptions,
      hasGroupResponses,
      preview,
      options,
      uiStyle,
      showAnswer,
      checkAnswer,
      validation,
      evaluation,
      item,
      theme,
      showQuestionNumber,
      responseIDs,
      disableResponse,
      isReviewTab
    } = this.props;

    const { userAnswers, possibleResponses, parsedTemplate } = this.state;
    const { showDraghandle: dragHandler, shuffleOptions } = configureOptions;

    const { btnStyle, responseBtnStyle } = this.getBtnStyles();

    let responses = cloneDeep(possibleResponses);

    if (preview && shuffleOptions) {
      if (hasGroupResponses) {
        responses = this.shuffleGroup(possibleResponses);
      } else {
        responses = this.shuffle(possibleResponses);
      }
    }

    // Layout Options
    const fontSize = getFontSize(uiStyle.fontsize);
    const { responsecontainerposition, responsecontainerindividuals, stemnumeration } = uiStyle;

    const templateBoxLayout = showAnswer || checkAnswer ? CheckboxTemplateBoxLayout : TemplateBox;

    const resProps =
      showAnswer || checkAnswer
        ? {
            options,
            responsecontainerindividuals,
            responseBtnStyle,
            stemnumeration,
            hasGroupResponses,
            showAnswer,
            userSelections: userAnswers,
            evaluation,
            onDropHandler: !disableResponse ? this.onDrop : () => {},
            responseIDs,
            isReviewTab,
            cAnswers: get(item, "validation.valid_response.value", [])
          }
        : {
            hasGroupResponses,
            btnStyle,
            smallSize,
            options,
            userAnswers,
            onDrop: !disableResponse ? this.onDrop : () => {},
            responseIDs,
            isReviewTab,
            cAnswers: get(item, "validation.valid_response.value", [])
          };

    const templateBoxLayoutContainer = (
      <PreWrapper>
        <div
          className={`template_box ${smallSize ? "small" : ""}`}
          style={{
            fontSize: smallSize ? theme.widgets.clozeDragDrop.previewTemplateBoxSmallFontSize : fontSize
          }}
        >
          <JsxParser
            bindings={{ resProps }}
            showWarnings
            components={{
              response: templateBoxLayout,
              mathspan: MathSpanWrapper
            }}
            jsx={parsedTemplate}
          />
        </div>
      </PreWrapper>
    );

    const previewResponseBoxLayout = (
      <ResponseBoxLayout
        smallSize={smallSize}
        hasGroupResponses={hasGroupResponses}
        responses={responses}
        fontSize={fontSize}
        dragHandler={dragHandler}
        onDrop={!disableResponse ? this.onDrop : () => {}}
      />
    );
    const correctAnswerBoxLayout = showAnswer ? (
      <>
        <CorrectAnswerBoxLayout
          hasGroupResponses={hasGroupResponses}
          fontSize={fontSize}
          groupResponses={options}
          userAnswers={validation.valid_response && validation.valid_response.value}
        />
        {!isEmpty(item.validation.alt_responses) && (
          <AlternateAnswerBoxLayout
            fontSize={fontSize}
            groupResponses={options}
            hasGroupResponses={hasGroupResponses}
            altAnswers={validation.alt_responses}
          />
        )}
      </>
    ) : (
      <div />
    );
    const responseBoxLayout = showAnswer || isReviewTab ? <div /> : previewResponseBoxLayout;
    const answerBox = showAnswer ? correctAnswerBoxLayout : <div />;

    return (
      <div style={{ fontSize }}>
        <QuestionTitleWrapper>
          {showQuestionNumber && <QuestionNumber>{item.qLabel}</QuestionNumber>}
          <Stimulus smallSize={smallSize} dangerouslySetInnerHTML={{ __html: question }} />
        </QuestionTitleWrapper>
        <div>
          {responsecontainerposition === "top" && (
            <React.Fragment>
              <div style={{ margin: "15px 0", borderRadius: 10 }}>{responseBoxLayout}</div>
              <div style={{ margin: "15px 0", borderRadius: 10 }}>{templateBoxLayoutContainer}</div>
            </React.Fragment>
          )}
          {responsecontainerposition === "bottom" && (
            <React.Fragment>
              <div
                style={{
                  margin: smallSize ? "-18px -20px 10px" : "15px 0",
                  borderRadius: smallSize ? 0 : 10
                }}
              >
                <InstructorStimulus>{item.instructor_stimulus}</InstructorStimulus>

                {templateBoxLayoutContainer}
              </div>
              <div
                style={{
                  margin: smallSize ? "0 -40px -20px" : "15px 0",
                  borderRadius: smallSize ? 0 : 10
                }}
              >
                {responseBoxLayout}
              </div>
            </React.Fragment>
          )}
          {responsecontainerposition === "left" && (
            <AnswerContainer position={responsecontainerposition}>
              <div
                hidden={checkAnswer || showAnswer}
                style={{
                  height: "100%",
                  maxWidth: "30%",
                  margin: "15px 0",
                  borderRadius: 10,
                  background: theme.widgets.clozeDragDrop.responseBoxBgColor,
                  display: "flex",
                  justifyContent: "center"
                }}
              >
                {responseBoxLayout}
              </div>
              <div style={{ margin: 15, borderRadius: 10, flex: 1 }}>{templateBoxLayoutContainer}</div>
            </AnswerContainer>
          )}
          {responsecontainerposition === "right" && (
            <AnswerContainer position={responsecontainerposition}>
              <div style={{ flex: 1, margin: 15, borderRadius: 10 }}>{templateBoxLayoutContainer}</div>
              <div
                hidden={checkAnswer || showAnswer}
                style={{
                  height: "100%",
                  maxWidth: "30%",
                  margin: "15px 0",
                  borderRadius: 10,
                  background: theme.widgets.clozeDragDrop.responseBoxBgColor,
                  display: "flex",
                  justifyContent: "center"
                }}
              >
                {responseBoxLayout}
              </div>
            </AnswerContainer>
          )}
        </div>
        {answerBox}
      </div>
    );
  }
}

ClozeDragDropDisplay.propTypes = {
  options: PropTypes.array,
  item: PropTypes.object,
  onChange: PropTypes.func,
  preview: PropTypes.bool,
  showAnswer: PropTypes.bool,
  userSelections: PropTypes.array,
  smallSize: PropTypes.bool,
  checkAnswer: PropTypes.bool,
  template: PropTypes.string,
  question: PropTypes.string.isRequired,
  hasGroupResponses: PropTypes.bool,
  configureOptions: PropTypes.object,
  validation: PropTypes.object,
  evaluation: PropTypes.array,
  uiStyle: PropTypes.object,
  disableResponse: PropTypes.bool,
  theme: PropTypes.object.isRequired,
  showQuestionNumber: PropTypes.bool,
  isReviewTab: PropTypes.bool,
  responseIDs: PropTypes.array.isRequired
  // qIndex: PropTypes.number
};

ClozeDragDropDisplay.defaultProps = {
  options: [],
  onChange: () => {},
  preview: true,
  item: {},
  disableResponse: false,
  showAnswer: false,
  userSelections: [],
  evaluation: [],
  checkAnswer: false,
  template: "",
  smallSize: false,
  hasGroupResponses: false,
  validation: {},
  configureOptions: {
    showDraghandle: false,
    duplicatedResponses: false,
    shuffleOptions: false
  },
  uiStyle: {
    responsecontainerposition: "bottom",
    fontsize: "normal",
    stemnumeration: "numerical",
    widthpx: 0,
    heightpx: 0,
    wordwrap: false,
    responsecontainerindividuals: []
  },
  showQuestionNumber: false,
  isReviewTab: false
  // qIndex: null
};

export default withTheme(ClozeDragDropDisplay);
