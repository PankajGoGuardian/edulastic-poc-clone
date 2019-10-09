import React from "react";
import PropTypes from "prop-types";
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
  style
}) => (
  <div className="text container" style={showAnswer || checkAnswer ? { ...style, padding: "0px" } : {}}>
    {userSelections[dropTargetIndex] &&
      userSelections[dropTargetIndex].value.map((answer, user_select_index) => {
        const userAnswer =
          userSelections[dropTargetIndex].responseBoxID && isSnapFitValues
            ? answer.replace("<p>", "<p class='clipText'>") || ""
            : "";
        const title = <MathSpan dangerouslySetInnerHTML={{ __html: answer }} />;

        return (
          <div style={{ ...style, width: "100%" }}>
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

TextContainer.propTypes = {
  dropTargetIndex: PropTypes.number.isRequired,
  userSelections: PropTypes.array.isRequired,
  checkAnswer: PropTypes.bool.isRequired,
  showAnswer: PropTypes.bool.isRequired,
  dragItemStyle: PropTypes.object.isRequired,
  onDropHandler: PropTypes.func.isRequired,
  disableResponse: PropTypes.bool.isRequired,
  isSnapFitValues: PropTypes.bool.isRequired,
  style: PropTypes.object.isRequired
};

export default TextContainer;
