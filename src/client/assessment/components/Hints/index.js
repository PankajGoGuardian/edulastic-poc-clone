import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styled from "styled-components";
import {
  EduButton,
  FlexContainer,
  QuestionLabelWrapper as LabelWrapper,
  QuestionSubLabel as SubLabel,
  MathFormulaDisplay
} from "@edulastic/common";
import { themeColor, mainTextColor } from "@edulastic/colors";
import { Label } from "../../styled/WidgetOptions/Label";
import { saveHintUsageAction } from "../../actions/userInteractions";

const Hints = ({
  question,
  showHints,
  enableMagnifier,
  isStudent,
  itemIndex,
  saveHintUsage,
  isLCBView,
  isExpressGrader
}) => {
  const { hints = [], id } = question;
  const validHints = hints?.filter(hint => hint?.label);
  const hintCount = validHints.length;

  if (
    !hintCount ||
    question.type === "passage" ||
    question.type === "passageWithQuestions" ||
    question.type === "video" ||
    question.type === "resource" ||
    question.type === "text"
  ) {
    return null;
  }

  const hintContRef = useRef();

  const [showCount, updateShowCount] = useState(0);

  const showHintHandler = () => {
    if (isLCBView || isExpressGrader) {
      updateShowCount(hintCount);
    } else {
      updateShowCount(1);
    }
  };

  const showMoreHints = () => updateShowCount(showCount + 1);

  useEffect(() => {
    if (itemIndex === 0 && showCount === 0 && showHints) {
      updateShowCount(1);
      if (hintContRef.current) {
        setTimeout(() => {
          hintContRef.current.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
        }, 500);
      }
    } else {
      updateShowCount(0);
    }
  }, [showHints, itemIndex]);

  useEffect(() => {
    if (enableMagnifier) {
      setTimeout(() => {
        const dragElements = document.querySelectorAll(".zoomed-container-wrapper .hint-container");
        if (dragElements.length > 0) {
          document.querySelectorAll(".unzoom-container-wrapper .hint-container").forEach((elm, i) => {
            dragElements[i].innerHTML = elm.innerHTML;
          });
        }
      }, 500);
    }
    if (showCount === 1) {
      saveHintUsage({
        event: "HintClicked",
        id,
        time: Date.now()
      });
    }
  }, [showCount]);

  return (
    hintCount > 0 && (
      <HintCont data-cy="hint-container" className="hint-container" ref={hintContRef}>
        {!!showCount && <QuestionLabel>Hint</QuestionLabel>}
        {!!showCount &&
          validHints.map(
            ({ value, label }, index) =>
              index + 1 <= showCount && (
                <HintItem key={value}>
                  <LabelWrapper>
                    <HintLabel>
                      <Label marginBottom="0px">{`${index + 1}/${hintCount}`}</Label>
                    </HintLabel>
                  </LabelWrapper>
                  <div>
                    <HintContent>
                      <MathFormulaDisplay dangerouslySetInnerHTML={{ __html: label }} />
                    </HintContent>
                    {index + 1 === showCount && showCount < hintCount && (
                      <ShowMoreHint onClick={showMoreHints}>+ Get Another Hint {`1/${hintCount}`}</ShowMoreHint>
                    )}
                  </div>
                </HintItem>
              )
          )}
        {!showCount && (
          <ShowHint height="30px" width="110px" isGhost onClick={showHintHandler} isStudent={isStudent}>
            Show Hint
          </ShowHint>
        )}
      </HintCont>
    )
  );
};

Hints.propTypes = {
  question: PropTypes.object
  //
};

Hints.defaultProps = {
  question: {
    hints: []
  }
};

export default connect(
  state => ({
    showHints: state.test.showHints
  }),
  {
    saveHintUsage: saveHintUsageAction
  }
)(Hints);

const HintCont = styled.div`
  margin: 16px 0px;
`;

const HintItem = styled(FlexContainer)`
  width: 100%;
  margin-top: 4px;
  margin-bottom: 16px;
  justify-content: flex-start;
  align-items: flex-start;
`;

const HintLabel = styled(SubLabel)`
  padding-left: 0px;
  & label {
    text-align: center;
  }
`;

const HintContent = styled.div`
  width: 100%;
  padding: 8px 16px;
  border-left: 3px solid ${themeColor};
  justify-content: flex-start;
`;

const ShowHint = styled(EduButton)`
  margin-left: ${({ isStudent }) => `${isStudent ? 50 : 0}px`};
`;

const ShowMoreHint = styled.div`
  cursor: pointer;
  user-select: none;
  text-transform: uppercase;
  color: ${themeColor};
  font-size: 0.8em;
  padding: 8px 16px;
`;

const QuestionLabel = styled.div`
  color: ${mainTextColor};
  font-weight: 700;
  font-size: 16px;
  padding-bottom: 1rem;
`;
