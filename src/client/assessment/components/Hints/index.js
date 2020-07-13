import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import get from "lodash/get";
import { connect } from "react-redux";
import styled from "styled-components";
import {
  EduButton,
  FlexContainer,
  QuestionLabelWrapper as LabelWrapper,
  QuestionSubLabel as SubLabel,
  MathFormulaDisplay
} from "@edulastic/common";
import { themeColor, mainTextColor, backgroundGrey, greyThemeLighter, title } from "@edulastic/colors";
import { getFontSize } from "../../utils/helpers";
import { Label } from "../../styled/WidgetOptions/Label";

const Hints = ({
  question,
  showHints,
  enableMagnifier,
  isStudent,
  itemIndex,
  saveHintUsage,
  isLCBView,
  isExpressGrader,
  isStudentReport
}) => {
  const { hints = [], id } = question;
  const validHints = hints?.filter(hint => hint?.label);
  const hintCount = validHints.length;
  const fontSize = getFontSize(get(question, "uiStyle.fontsize"));

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

  const showHintHandler = e => {
    e.stopPropagation();
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
    if (showCount) {
      saveHintUsage({
        event: "HintClicked",
        id,
        time: Date.now()
      });
    }
  }, [showCount]);

  useEffect(() => {
    updateShowCount(0);
  }, [id]);

  return (
    <>
      {!isStudentReport && hintCount > 0 && (
        <HintCont data-cy="hint-container" className="hint-container" ref={hintContRef}>
          {!!showCount && <QuestionLabel>Hint</QuestionLabel>}
          {!!showCount &&
            validHints.map(
              ({ value, label }, index) =>
                index + 1 <= showCount && (
                  <HintItem data-cy="hint-subcontainer" key={value}>
                    <LabelWrapper>
                      <HintLabel>
                        <Label data-cy="hint-count" marginBottom="0px">{`${index + 1}/${hintCount}`}</Label>
                      </HintLabel>
                    </LabelWrapper>

                    <div style={{ width: "100%" }}>
                      {/* stretch to full width of the container, otherwise videos and other embeds wont have width */}
                      {/* https://snapwiz.atlassian.net/browse/EV-13446 */}
                      <HintContent>
                        <MathFormulaDisplay fontSize={fontSize} dangerouslySetInnerHTML={{ __html: label }} />
                      </HintContent>
                      {index + 1 === showCount && showCount < hintCount && (
                        <ShowMoreHint data-cy="more-hint" onClick={showMoreHints}>
                          + Get Another Hint {`1/${hintCount}`}
                        </ShowMoreHint>
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
      )}

      {isStudentReport && hintCount > 0 && (
        <HintCont data-cy="hint-container" className="hint-container" ref={hintContRef} style={{ width: "63%" }}>
          <QuestionLabel isStudentReport={isStudentReport}>
            <span style={{ color: "#4aac8b" }}>{question.barLabel}</span> - Hint
          </QuestionLabel>
          {validHints.map(({ value, label }, index) => (
            <HintItem isStudentReport={isStudentReport} data-cy="hint-subcontainer" key={value}>
              <HintLabel className="hint-label">
                <div>HINT</div>
                <span data-cy="hint-count">{`${index + 1}/${hintCount}`}</span>
              </HintLabel>
              <HintContent className="hint-content">
                <MathFormulaDisplay fontSize={fontSize} dangerouslySetInnerHTML={{ __html: label }} />
              </HintContent>
            </HintItem>
          ))}
        </HintCont>
      )}
    </>
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

export default connect(state => ({
  showHints: state.test.showHints
}))(Hints);

const HintCont = styled.div`
  margin: 16px 0px;
`;

const HintItem = styled(FlexContainer)`
  width: 100%;
  margin-top: 4px;
  margin-bottom: 8px;
  padding-left: ${props => (props.isStudentReport ? "0px" : "34px")};
  justify-content: flex-start;
  align-items: flex-start;

  .hint-label {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 50px;
    color: ${title};
    font-size: 11px;
    span {
      font-size: 12px;
      font-weight: bold;
    }
  }
  .hint-content {
    background: ${greyThemeLighter};
    width: calc(100% - 50px);
    padding: 10px;
    border: none;
    border-radius: 4px;
  }
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
  padding: ${props => (props.isStudentReport ? "1rem 0px" : "1.5rem 0 1rem 11px")};
  margin-bottom: 16px;
  border-bottom: 0.05rem solid ${backgroundGrey};
`;
