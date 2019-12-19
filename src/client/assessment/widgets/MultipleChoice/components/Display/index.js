import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Stimulus, QuestionNumberLabel } from "@edulastic/common";

import Options from "./components/Options";
import { QuestionTitleWrapper } from "./styled/Label";

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
  ...restProps
}) => (
  <div>
    {!flowLayout && (
      <>
        <QuestionTitleWrapper>
          {showQuestionNumber && <QuestionNumberLabel fontSize={fontSize}>{qLabel}:</QuestionNumberLabel>}
          <StyledStimulus fontSize={fontSize} dangerouslySetInnerHTML={{ __html: question }} />
        </QuestionTitleWrapper>
      </>
    )}

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
  styleType: PropTypes.string,
  multipleResponses: PropTypes.bool,
  showQuestionNumber: PropTypes.bool,
  flowLayout: PropTypes.bool
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
  multipleResponses: false
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
