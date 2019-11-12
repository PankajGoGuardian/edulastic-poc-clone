import React, { useContext, useState } from "react";
import { withTheme } from "styled-components";
import get from "lodash/get";
import PropTypes from "prop-types";
import Switch from "antd/lib/switch";

import { Stimulus, FlexContainer, QuestionNumberLabel, AnswerContext } from "@edulastic/common";
import Circles from "./Circles";
import Rectangles from "./Rectangles";
import AnnotationRnd from "../../../components/Annotations/AnnotationRnd";
import { CLEAR, SHOW } from "../../../constants/constantsForQuestions";
import CorrectAnswerBox from "./CorrectAnswerBox";
import SwitchWrapper from "../styled/SwitchWrapper";

const Display = ({
  saveAnswer,
  item,
  stimulus,
  evaluation,
  previewTab,
  showQuestionNumber,
  userAnswer,
  changePreviewTab,
  isReviewTab,
  t
}) => {
  const { fractionProperties = {}, annotations = [] } = item;
  const fractionType = fractionProperties.fractionType;
  const count = fractionProperties.count || 1;
  let selected = userAnswer;
  const answerContext = useContext(AnswerContext);
  const hasAnnotations = annotations.length > 0;
  const [showAnnotations, toggleAnnotationsVibility] = useState(hasAnnotations);
  const handleSelect = index => {
    if (
      previewTab === "check" ||
      (previewTab === "show" && !answerContext.expressGrader && answerContext.isAnswerModifiable)
    ) {
      saveAnswer([]);
      changePreviewTab("clear");
      return;
    }
    const _userAnswer = [...userAnswer];
    if (_userAnswer.includes(index)) {
      _userAnswer.splice(_userAnswer.indexOf(index), 1);
    } else {
      _userAnswer.push(index);
    }
    saveAnswer(_userAnswer);
  };
  return (
    <FlexContainer justifyContent="flex-start" flexDirection="column" alignItems="flex-start" flexWrap="wrap">
      <FlexContainer justifyContent="space-between" style={{ width: "100%" }}>
        <FlexContainer width="100%">
          {showQuestionNumber && <QuestionNumberLabel>{item.qLabel}: </QuestionNumberLabel>}
          <Stimulus
            style={{ marginTop: "14px", marginRight: "20px", width: "100%" }}
            dangerouslySetInnerHTML={{ __html: stimulus }}
          />
        </FlexContainer>
        {hasAnnotations && answerContext.isAnswerModifiable && (
          <FlexContainer>
            <span style={{ marginRight: "5px" }}>{t("component.fractionEditor.showAnnotations")}</span>
            <SwitchWrapper>
              <Switch defaultChecked={showAnnotations} onChange={checked => toggleAnnotationsVibility(checked)} />
            </SwitchWrapper>
          </FlexContainer>
        )}
      </FlexContainer>
      <FlexContainer
        style={{
          overflow: "auto",
          position: "relative",
          minWidth: "660px",
          minHeight: "300px",
          padding: "0 0 1em 0"
        }}
        flexDirection="column"
        justifyContent="flex-start"
        alignItems="center"
      >
        <FlexContainer alignItems="flex-start" flexDirection="row" flexWrap="wrap" justifyContent="flex-start">
          {Array(count)
            .fill()
            .map((_, index) => {
              return fractionType === "circles" ? (
                <Circles
                  fractionNumber={index}
                  sectors={fractionProperties.sectors}
                  selected={selected}
                  sectorClick={index => handleSelect(index)}
                  previewTab={previewTab}
                  isExpressGrader={answerContext.expressGrader}
                  isAnswerModifiable={answerContext.isAnswerModifiable}
                  evaluation={evaluation}
                  isReviewTab={isReviewTab}
                />
              ) : (
                <Rectangles
                  fractionNumber={index}
                  rows={fractionProperties.rows}
                  columns={fractionProperties.columns}
                  selected={selected}
                  onSelect={index => handleSelect(index)}
                  previewTab={previewTab}
                  isExpressGrader={answerContext.expressGrader}
                  isAnswerModifiable={answerContext.isAnswerModifiable}
                  evaluation={evaluation}
                  isReviewTab={isReviewTab}
                />
              );
            })}
        </FlexContainer>
        {showAnnotations && <AnnotationRnd question={item} setQuestionData={() => {}} disableDragging />}
        {previewTab === SHOW && (
          <CorrectAnswerBox
            fractionProperties={fractionProperties}
            selected={Array(get(item, "validation.validResponse.value", 1))
              .fill()
              .map((_, i) => i + 1)}
          />
        )}
      </FlexContainer>
    </FlexContainer>
  );
};

Display.propTypes = {
  t: PropTypes.func.isRequired,
  previewTab: PropTypes.string,
  item: PropTypes.object,
  saveAnswer: PropTypes.func.isRequired,
  userAnswer: PropTypes.array,
  evaluation: PropTypes.any,
  showQuestionNumber: PropTypes.bool,
  stimulus: PropTypes.string
};

Display.defaultProps = {
  previewTab: CLEAR,
  item: {},
  userAnswer: [],
  evaluation: [],
  showQuestionNumber: false,
  stimulus: ""
};

export default withTheme(Display);
