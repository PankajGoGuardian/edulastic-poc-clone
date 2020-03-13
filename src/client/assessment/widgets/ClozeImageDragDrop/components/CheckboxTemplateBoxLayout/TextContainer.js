import React from "react";
import PropTypes from "prop-types";
import { MathSpan, DragDrop, measureText } from "@edulastic/common";
import Container from "./styled/Container";
import PopoverContent from "../PopoverContent";
import AnswerContent from "./TextContent";

const { DragItem } = DragDrop;
const TextContainer = ({
  dropTargetIndex,
  userSelections,
  isSnapFitValues,
  checkAnswer,
  dragItemStyle,
  style,
  lessMinWidth,
  className,
  status,
  isChecked,
  isExpressGrader,
  showAnswer
}) => (
  <>
    {userSelections[dropTargetIndex] &&
      userSelections[dropTargetIndex].value.map((answer, user_select_index) => {
        const userAnswer = userSelections[dropTargetIndex].responseBoxID && isSnapFitValues ? answer : "";
        const content = <MathSpan dangerouslySetInnerHTML={{ __html: answer }} />;
        const maxWidth = parseInt(dragItemStyle.maxWidth, 10) / 100;
        const padding = lessMinWidth ? 4 : 10;
        const indexWidth = showAnswer ? 40 : 0;
        const { width: contentWidth } = measureText(answer);
        const isOverContent = style.width * maxWidth < contentWidth + padding + indexWidth;
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
        return (
          <div style={{ ...style, width: "100%" }}>
            <DragItem
              style={dragItemStyle}
              key={user_select_index}
              data={{
                option: answer,
                fromContainerIndex: dropTargetIndex,
                fromRespIndex: user_select_index
              }}
            >
              <Container _lineHeight={style.height}>
                <AnswerContent
                  popoverContent={popoverContent}
                  userAnswer={userAnswer}
                  answer={answer}
                  lessMinWidth={lessMinWidth}
                  height={style.height}
                  width={style.width}
                  isChecked={isChecked}
                  isOverContent={isOverContent}
                />
              </Container>
            </DragItem>
          </div>
        );
      })}
  </>
);
TextContainer.propTypes = {
  dropTargetIndex: PropTypes.number.isRequired,
  userSelections: PropTypes.array.isRequired,
  checkAnswer: PropTypes.bool.isRequired,
  dragItemStyle: PropTypes.object.isRequired,
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
