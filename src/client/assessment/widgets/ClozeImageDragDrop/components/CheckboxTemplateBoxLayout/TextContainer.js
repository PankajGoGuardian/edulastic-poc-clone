import React from "react";
import PropTypes from "prop-types";
import { MathSpan, measureText } from "@edulastic/common";
import { Popover } from "antd";

import DragItem from "../DragItem";
import Container from "./styled/Container";
import PopoverContent from "../PopoverContent";

const TextContainer = ({
  dropTargetIndex,
  userSelections,
  isSnapFitValues,
  showAnswer,
  checkAnswer,
  dragItemStyle,
  onDropHandler,
  disableResponse,
  style,
  contWidth,
  lessMinWidth,
  className,
  status,
  isChecked,
  isExpressGrader
}) => (
  <div className="text container" style={showAnswer || checkAnswer ? { ...style, padding: "0px" } : {}}>
    {userSelections[dropTargetIndex] &&
      userSelections[dropTargetIndex].value.map((answer, user_select_index) => {
        const userAnswer =
          userSelections[dropTargetIndex].responseBoxID && isSnapFitValues
            ? answer.replace("<p>", "<p class='clipText'>") || ""
            : "";
        const content = <MathSpan dangerouslySetInnerHTML={{ __html: answer }} />;
        const popoverContent = (
          <PopoverContent
            index={dropTargetIndex}
            answer={content}
            status={status}
            className={className}
            checkAnswer={checkAnswer}
            isExpressGrader={isExpressGrader}
          />
        );
        const { width: contentWidth } = measureText(answer);
        const isOverText = contWidth < contentWidth;

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
                  {lessMinWidth || isOverText ? (
                    <Popover overlayClassName="customTooltip" content={popoverContent} isChecked={isChecked}>
                      <MathSpan dangerouslySetInnerHTML={{ __html: userAnswer }} />
                    </Popover>
                  ) : (
                    <MathSpan dangerouslySetInnerHTML={{ __html: userAnswer }} />
                  )}
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
  style: PropTypes.object.isRequired,
  lessMinWidth: PropTypes.bool,
  className: PropTypes.string,
  status: PropTypes.string,
  isChecked: PropTypes.bool.isRequired,
  isExpressGrader: PropTypes.bool.isRequired
};

TextContainer.defaultProps = {
  lessMinWidth: false,
  className: "",
  status: ""
};

export default TextContainer;
