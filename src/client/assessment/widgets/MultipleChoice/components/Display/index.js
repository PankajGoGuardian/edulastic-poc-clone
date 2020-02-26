import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Stimulus, QuestionNumberLabel, FlexContainer, QuestionSubLabel } from "@edulastic/common";

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
  ...restProps
}) => (
  <div style={{ display: "inline-block", width: "100%" }}>
    <FlexContainer alignItems="baseline" justifyContent="flex-start">
      {!flowLayout && (
        <>
          <FlexContainer justifyContent="flex-start" flexDirection="column" alignItems="flex-start">
            {showQuestionNumber && (
              <QuestionNumberLabel fontSize={fontSize}>{qLabel}</QuestionNumberLabel>
            )}
            {qSubLabel && <QuestionSubLabel>({qSubLabel})</QuestionSubLabel>}
          </FlexContainer>

          <FlexContainer width="100%" flexDirection="column" alignItems="flex-start">
            <StyledStimulus fontSize={fontSize} dangerouslySetInnerHTML={{ __html: question }} />
            <Options
              view={view}
              smallSize={smallSize}
              question={question}
              uiStyle={uiStyle}
              styleType={styleType}
              multipleResponses={multipleResponses}
              fontSize={fontSize}
              item={item}
              {...restProps}
            />
          </FlexContainer>
        </>
      )}
    </FlexContainer>
  </div>
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
  word-break: break-word;
  overflow: hidden;
  font-size: ${props => props.fontSize};

  img {
    padding: 0px;
  }
`;

export default Display;
