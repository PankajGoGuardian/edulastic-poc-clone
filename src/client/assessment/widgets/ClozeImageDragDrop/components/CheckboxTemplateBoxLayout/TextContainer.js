import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import striptags from "striptags";
import { MathSpan } from "@edulastic/common";
import { Tooltip } from "antd";

import DragItem from "../DragItem";
import Container from "./styled/Container";

const TextContainer = ({
  dropTargetIndex,
  userSelections,
  isSnapFitValues,
  showAnswer,
  checkAnswer,
  dragItemStyle,
  onDropHandler,
  disableResponse,
  dropContainerWidth,
  indexBoxRef,
  onHideIndexBox,
  style
}) => {
  const answerContainer = useRef();

  useEffect(() => {
    if (!answerContainer.current) {
      return;
    }
    setTimeout(() => {
      const indexWidth = indexBoxRef.current ? indexBoxRef.current.clientWidth : 0;
      const textContainerWidth = answerContainer.current.clientWidth;
      const requiredWidth = indexWidth + textContainerWidth + 25; // 25 is wrong/correct mark width.
      if (requiredWidth > dropContainerWidth) {
        onHideIndexBox(true);
      } else {
        onHideIndexBox(false);
      }
    });
  }, []);
  return (
    <div className="text container" style={showAnswer || checkAnswer ? { ...style, padding: "0px" } : {}}>
      {userSelections[dropTargetIndex] &&
        userSelections[dropTargetIndex].value.map((answer, user_select_index) => {
          const userAnswer =
            userSelections[dropTargetIndex].responseBoxID && isSnapFitValues
              ? answer.replace("<p>", "<p class='clipText'>") || ""
              : "";
          const title = <MathSpan dangerouslySetInnerHTML={{ __html: answer }} />;

          return (
            <div ref={answerContainer} style={{ ...style, width: "100%" }}>
              <DragItem
                key={user_select_index}
                index={user_select_index}
                data={`${answer}_${dropTargetIndex}_${user_select_index}`}
                style={dragItemStyle}
                item={answer}
                onDrop={onDropHandler}
                disable={!isSnapFitValues}
                disableResponse={disableResponse}
              >
                <Container width="100%">
                  <Container width="100%" height="100%">
                    <Tooltip overlayClassName="customTooltip" placement="right" title={title}>
                      <MathSpan dangerouslySetInnerHTML={{ __html: userAnswer }} />
                    </Tooltip>
                  </Container>
                </Container>
              </DragItem>
            </div>
          );
        })}
    </div>
  );
};

TextContainer.propTypes = {
  dropTargetIndex: PropTypes.number.isRequired,
  userSelections: PropTypes.array.isRequired,
  checkAnswer: PropTypes.bool.isRequired,
  showAnswer: PropTypes.bool.isRequired,
  dragItemStyle: PropTypes.object.isRequired,
  onHideIndexBox: PropTypes.func.isRequired,
  onDropHandler: PropTypes.func.isRequired,
  disableResponse: PropTypes.bool.isRequired,
  isSnapFitValues: PropTypes.bool.isRequired,
  dropContainerWidth: PropTypes.number.isRequired,
  indexBoxRef: PropTypes.any.isRequired,
  style: PropTypes.object.isRequired
};

export default TextContainer;
