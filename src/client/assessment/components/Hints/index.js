import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import {
  EduButton,
  FlexContainer,
  QuestionLabelWrapper as LabelWrapper,
  QuestionSubLabel as SubLabel,
  MathFormulaDisplay
} from "@edulastic/common";
import { themeColor, lightFadedBlack } from "@edulastic/colors";
import { Label } from "../../styled/WidgetOptions/Label";

const Hints = ({ question }) => {
  if (question.type === "passage") {
    return null;
  }

  const { hints = [] } = question;
  const validHints = hints?.filter(hint => hint?.label);
  const hintCount = validHints.length;

  const [showCount, updateShowCount] = useState(0);

  const showHintHandler = () => updateShowCount(1);

  const showMoreHints = () => updateShowCount(showCount + 1);

  return (
    hintCount > 0 && (
      <div data-cy="hint-container">
        {!!showCount &&
          validHints.map(
            ({ value, label }, index) =>
              index + 1 <= showCount && (
                <HintContainer key={value}>
                  <LabelWrapper>
                    <HintLabel>
                      <Label marginBottom="0px">Hint</Label>
                      <Label marginBottom="0px">{`${index + 1}/${hintCount}`}</Label>
                    </HintLabel>
                  </LabelWrapper>
                  <HintContent>
                    <MathFormulaDisplay dangerouslySetInnerHTML={{ __html: label }} />
                  </HintContent>
                </HintContainer>
              )
          )}
        <HintActionCont>
          {!showCount && (
            <ShowHint height="30px" isGhost onClick={showHintHandler}>
              Show Hints
            </ShowHint>
          )}
          {!!showCount && showCount < hintCount && (
            <ShowMoreHint onClick={showMoreHints}>+ Get Another Hint {`1/${hintCount}`}</ShowMoreHint>
          )}
        </HintActionCont>
      </div>
    )
  );
};

Hints.propTypes = {
  question: PropTypes.object
};

Hints.defaultProps = {
  question: {
    hints: []
  }
};

export default Hints;

const HintContainer = styled(FlexContainer)`
  width: 100%;
  margin-top: 4px;
  margin-bottom: 8px;
  justify-content: flex-start;
`;

const HintLabel = styled(SubLabel)`
  padding-left: 0px;
  & label {
    text-align: center;
  }
`;

const HintContent = styled.div`
  width: 100%;
  padding: 8px;
  border-left: 3px solid ${lightFadedBlack};
  justify-content: flex-start;
`;

const HintActionCont = styled.div`
  margin-left: 48px;
`;

const ShowHint = styled(EduButton)`
  margin-left: 0px;
`;

const ShowMoreHint = styled.div`
  cursor: pointer;
  user-select: none;
  text-transform: uppercase;
  color: ${themeColor};
  font-size: 0.8em;
`;
