/* eslint-disable react/prop-types */
import PropTypes from "prop-types";
import React, { Component } from "react";
import produce from "immer";
import styled from "styled-components";
import { findIndex, find, isEmpty, get } from "lodash";
import JsxParser from "react-jsx-parser";
import {
  InstructorStimulus,
  helpers,
  Stimulus,
  QuestionNumberLabel,
  QuestionLabelWrapper,
  QuestionSubLabel,
  QuestionContentWrapper,
  FlexContainer
} from "@edulastic/common";
import { EDIT } from "../../constants/constantsForQuestions";
import CheckboxTemplateBoxLayout from "./components/CheckboxTemplateBoxLayout";
import CorrectAnswerBoxLayout from "./components/CorrectAnswerBoxLayout";
import MathSpanWrapper from "../../components/MathSpanWrapper";
import Instructions from "../../components/Instructions";
import ClozeTextInput from "./ClozeTextInput";

import { getFontSize, getStemNumeration } from "../../utils/helpers";

class ClozeTextDisplay extends Component {
  state = {
    parsedTemplate: ""
  };

  componentDidMount() {
    const { stimulus } = this.props;
    this.setState({ parsedTemplate: helpers.parseTemplate(stimulus) });
  }

  static getDerivedStateFromProps({ stimulus }) {
    return { parsedTemplate: helpers.parseTemplate(stimulus.replace(/\u200B/gi, "")) };
  }

  getUiStyles = (responseBoxId, responseIndex) => {
    const { uiStyle } = this.props;
    const { widthpx, heightpx, placeholder, inputtype, stemNumeration, responsecontainerindividuals } = uiStyle;
    const fontSize = getFontSize(uiStyle.fontsize);

    const btnStyle = {
      position: "relative",
      maxWidth: 600,
      width: widthpx || 140,
      height: heightpx || 35,
      minHeight: heightpx || 35,
      type: inputtype,
      fontSize,
      placeholder
    };

    const responseBoxStyle = find(responsecontainerindividuals, resp => resp.id === responseBoxId) || {};

    if (responseBoxStyle.widthpx) {
      btnStyle.width = responseBoxStyle.widthpx;
      btnStyle.disableAutoExpend = true;
    }

    if (responseBoxStyle.heightpx) {
      btnStyle.height = responseBoxStyle.heightpx;
    }

    if (responseBoxStyle.inputtype) {
      btnStyle.type = responseBoxStyle.inputtype;
    }

    if (responseBoxStyle.placeholder) {
      btnStyle.placeholder = responseBoxStyle.placeholder;
    }

    return { btnStyle, stemNumeration: getStemNumeration(stemNumeration, responseIndex) };
  };

  onChangeUserAnswer = (value, id, widthpx) => {
    const { onChange: changeAnswers, userSelections, responseIds } = this.props;
    changeAnswers(
      produce(userSelections, draft => {
        /**
         * if there are three responses
         * if user does not answer the first two and answers the third
         * the first two are stored as null thus findIndex needs optionalChaining;
         * EV-10907
         */
        const changedIndex = findIndex(draft, (answer = {}) => answer?.id === id);
        if (changedIndex !== -1) {
          draft[changedIndex].value = value;
        } else {
          const resbtn = find(responseIds, res => res.id === id);
          draft[resbtn.index] = { value, index: resbtn.index, id };
        }
      }),
      id,
      widthpx
    );
  };

  _changeInput = ({ value, id, type }, widthpx) => {
    if (type === "number") {
      value = +value;
      if (typeof value === "number" && !Number.isNaN(value)) {
        this.onChangeUserAnswer(value, id);
      }
      return;
    }
    this.onChangeUserAnswer(value, id, widthpx);
  };

  render() {
    const {
      smallSize,
      question,
      uiStyle,
      showAnswer,
      checkAnswer,
      validation,
      evaluation,
      instructorStimulus,
      item,
      showQuestionNumber,
      disableResponse,
      userSelections,
      previewTab,
      changePreviewTab,
      responseIds,
      isReviewTab,
      isExpressGrader,
      view,
      isPrint,
      isV1Migrated
    } = this.props;

    const { parsedTemplate } = this.state;
    const fontSize = getFontSize(uiStyle.fontsize);

    const resProps = {
      item,
      onChange: this._changeInput,
      getUiStyles: this.getUiStyles,
      userAnswers: userSelections,
      disableResponse,
      isReviewTab,
      evaluation,
      checkAnswer,
      userSelections,
      responseIds,
      previewTab,
      changePreviewTab,
      isV1Migrated,
      cAnswers: get(item, "validation.validResponse.value", [])
      // isExpressGrader
    };

    const QuestionContent = (
      <StyledParser view={view} className={resProps.isV1Migrated && "migrated-question"}>
        <JsxParser
          disableKeyGeneration
          bindings={{ resProps }}
          showWarnings
          components={{
            textinput: showAnswer || checkAnswer || isPrint ? CheckboxTemplateBoxLayout : ClozeTextInput,
            mathspan: MathSpanWrapper
          }}
          jsx={parsedTemplate}
        />
      </StyledParser>
    );

    const answerBox =
      showAnswer || isExpressGrader ? (
        <>
          <CorrectAnswerBoxLayout
            fontSize={fontSize}
            userAnswers={validation.validResponse && validation.validResponse.value}
            stemNumeration={uiStyle.stemNumeration}
          />
          {!isEmpty(item.validation.altResponses) &&
            item.validation.altResponses.map((altAnswers, index) => (
              <CorrectAnswerBoxLayout
                key={altAnswers.id}
                fontSize={fontSize}
                altIndex={index + 1}
                stemNumeration={uiStyle.stemNumeration}
                userAnswers={altAnswers.value}
              />
            ))}
        </>
      ) : (
        <div />
      );

    return (
      <div style={{ fontSize }}>
        {instructorStimulus && instructorStimulus !== "<p><br></p>" && (
          <InstructorStimulus dangerouslySetInnerHTML={{ __html: instructorStimulus }} />
        )}
        <FlexContainer alignItems="baseline" justifyContent="flex-start" width="100%">
          <QuestionLabelWrapper>
            {showQuestionNumber && <QuestionNumberLabel>{item.qLabel}</QuestionNumberLabel>}
            {item.qSubLabel && <QuestionSubLabel>({item.qSubLabel})</QuestionSubLabel>}
          </QuestionLabelWrapper>

          <QuestionContentWrapper>
            <QuestionTitleWrapper>
              {!!question && <Stimulus smallSize={smallSize} dangerouslySetInnerHTML={{ __html: question }} />}
              {!question && QuestionContent}
            </QuestionTitleWrapper>
            {question && QuestionContent}
            {view !== EDIT && <Instructions item={item} />}
            {answerBox}
          </QuestionContentWrapper>
        </FlexContainer>
      </div>
    );
  }
}

ClozeTextDisplay.propTypes = {
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
  responseIds: PropTypes.object,
  item: PropTypes.object,
  disableResponse: PropTypes.bool,
  showQuestionNumber: PropTypes.bool,
  isExpressGrader: PropTypes.bool,
  isReviewTab: PropTypes.bool,
  isPrint: PropTypes.bool,
  view: PropTypes.string.isRequired,
  stimulus: PropTypes.string.isRequired,
  previewTab: PropTypes.string.isRequired,
  changePreviewTab: PropTypes.func.isRequired
};

ClozeTextDisplay.defaultProps = {
  responseIds: {},
  onChange: () => {},
  showAnswer: false,
  isPrint: false,
  instructorStimulus: "",
  evaluation: {},
  checkAnswer: false,
  userSelections: [],
  smallSize: false,
  item: {},
  validation: {},
  uiStyle: {
    fontsize: "normal",
    stemNumeration: "numerical",
    widthpx: 140,
    heightpx: 0,
    placeholder: null,
    inputtype: "text",
    responsecontainerindividuals: []
  },
  showQuestionNumber: false,
  disableResponse: false,
  isExpressGrader: false,
  isReviewTab: false
};

export default ClozeTextDisplay;

const QuestionTitleWrapper = styled.div`
  display: flex;
  width: 100%;

  iframe {
    max-width: 100%;
  }
  .jsx-parser {
    width: 100%;
  }
`;

const StyledParser = styled.div`
  padding: ${props => (props.view === EDIT ? 15 : 0)}px;
  border: ${props =>
    props.view === EDIT ? `solid 1px ${props.theme.widgets.clozeText.questionContainerBorderColor}` : null};
  border-radius: ${props => (props.view === EDIT ? 10 : 0)}px;
  width: 100%;
  /* overflow: auto; */

  .jsx-parser {
    p {
      font-size: ${props => props.theme.fontSize};
    }

    input {
      font-size: ${props => props.theme.fontSize};
    }
  }
`;
