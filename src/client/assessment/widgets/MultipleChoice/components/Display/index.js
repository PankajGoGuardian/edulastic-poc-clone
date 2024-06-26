import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Stimulus, QuestionNumberLabel, FlexContainer, QuestionSubLabel } from "@edulastic/common";
import Instructions from "../../../../components/Instructions";
import { EDIT } from "../../../../constants/constantsForQuestions";

import Options from "./components/Options";
// import { QuestionTitleWrapper } from "./styled/Label";

const Display = ({
  qIndex,
  view,
  smallSize,
  question,
  uiStyle,
  instructorStimulus,
  index,
  styleType,
  multipleResponses,
  showQuestionNumber,
  flowLayout,
  qLabel,
  fontSize,
  item = {},
  qSubLabel,
  fromSetAnswers,
  ...restProps
}) => (
  <FlexContainer alignItems="baseline" justifyContent="flex-start">
    {!flowLayout && (
      <>
        <FlexContainer justifyContent="flex-start" flexDirection="column" alignItems="flex-start">
          {showQuestionNumber && (
            <QuestionNumberLabel fontSize={fontSize} className="__print-space-reduce-qlabel">
              {qLabel}
            </QuestionNumberLabel>
          )}
          {qSubLabel && <QuestionSubLabel>({qSubLabel})</QuestionSubLabel>}
        </FlexContainer>

        <FlexContainer
          width="100%"
          className="__print_question-content-wrapper"
          flexDirection="column"
          alignItems="flex-start"
        >
          {!fromSetAnswers && (
            <StyledStimulus
              fontSize={fontSize}
              dangerouslySetInnerHTML={{ __html: question }}
              className="_print-space-reduce-stimulus"
            />
          )}
          <Options
            view={view}
            smallSize={smallSize}
            question={question}
            uiStyle={uiStyle}
            styleType={styleType}
            multipleResponses={multipleResponses}
            fontSize={fontSize}
            fromSetAnswers={fromSetAnswers}
            item={item}
            {...restProps}
          />
          {view !== EDIT && <Instructions item={item} />}
        </FlexContainer>
      </>
    )}
  </FlexContainer>
);

Display.propTypes = {
  options: PropTypes.array,
  onChange: PropTypes.func,
  showAnswer: PropTypes.bool,
  validation: PropTypes.object,
  userSelections: PropTypes.array,
  smallSize: PropTypes.bool,
  checkAnswer: PropTypes.bool,
  question: PropTypes.string.isRequired,
  instructorStimulus: PropTypes.string,
  uiStyle: PropTypes.object,
  qLabel: PropTypes.string.isRequired,
  view: PropTypes.string.isRequired,
  qIndex: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  fontSize: PropTypes.any.isRequired,
  item: PropTypes.object.isRequired,
  styleType: PropTypes.string,
  multipleResponses: PropTypes.bool,
  showQuestionNumber: PropTypes.bool,
  flowLayout: PropTypes.bool,
  qSubLabel: PropTypes.string
};

Display.defaultProps = {
  options: [],
  onChange: () => {},
  showAnswer: false,
  checkAnswer: false,
  validation: {},
  userSelections: [],
  smallSize: false,
  instructorStimulus: "",
  uiStyle: {
    type: "standard",
    fontsize: "normal",
    columns: 1,
    orientation: "horizontal",
    choiceLabel: "number"
  },
  showQuestionNumber: false,
  flowLayout: false,
  styleType: "default",
  multipleResponses: false,
  qSubLabel: ""
};

const StyledStimulus = styled(Stimulus)`
  margin-bottom: 25px;
  word-break: break-word;
  overflow: hidden;
  font-size: ${props => props.fontSize};

  img {
    padding: 0px;
  }

  p {
    padding-top: 2px;
  }
`;

export default Display;
