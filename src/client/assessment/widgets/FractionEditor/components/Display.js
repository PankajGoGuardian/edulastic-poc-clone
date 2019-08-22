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
  isReviewTab
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
      <FlexContainer style={{ width: "100%" }} justifyContent="space-between">
        <FlexContainer>
          {showQuestionNumber && <QuestionNumberLabel>{item.qLabel}: </QuestionNumberLabel>}
          <Stimulus style={{ marginTop: "14px" }} dangerouslySetInnerHTML={{ __html: stimulus }} />
        </FlexContainer>
        {hasAnnotations && answerContext.isAnswerModifiable && (
          <FlexContainer>
            <span>Show Annotatations</span>
            <SwitchWrapper>
              <Switch defaultChecked={showAnnotations} onChange={checked => toggleAnnotationsVibility(checked)} />
            </SwitchWrapper>
          </FlexContainer>
        )}
      </FlexContainer>
      <FlexContainer
        style={{ overflow: "auto", position: "relative", height: "425px", width: "700px" }}
        flexWrap="wrap"
        justifyContent="flex-start"
      >
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
        {showAnnotations && <AnnotationRnd question={item} setQuestionData={() => {}} disableDragging />}
      </FlexContainer>

      {previewTab === SHOW && (
        <CorrectAnswerBox
          fractionProperties={fractionProperties}
          selected={Array(get(item, "validation.validResponse.value", 1))
            .fill()
            .map((_, i) => i + 1)}
        />
      )}
    </FlexContainer>
  );
};

Display.propTypes = {
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
