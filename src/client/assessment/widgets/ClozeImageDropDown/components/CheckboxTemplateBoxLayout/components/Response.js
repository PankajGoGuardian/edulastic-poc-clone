import React from "react";
import Proptypes from "prop-types";
import { Popover } from "antd";
import { measureText } from "@edulastic/common";
import { Pointer } from "../../../../../styled/Pointer";
import { Point } from "../../../../../styled/Point";
import { Triangle } from "../../../../../styled/Triangle";
import { IconWrapper } from "../styled/IconWrapper";
import { WrongIcon } from "../styled/WrongIcon";
import { RightIcon } from "../styled/RightIcon";
import PopoverContent from "../../PopoverContent";

const Response = ({
  lessMinWidth,
  showAnswer,
  checkAnswer,
  btnStyle,
  responseContainer,
  userSelections,
  status,
  onClickHandler,
  indexStr,
  dropTargetIndex,
  isExpressGrader
}) => {
  const textContainerStyle = {
    minwidth: "100%",
    padding: lessMinWidth ? "0 1px" : null,
    justifyContent: "flex-start",
    alignItems: "center"
  };

  const answered = userSelections[dropTargetIndex];
  const classNames = `imagelabeldragdrop-droppable active ${answered ? "check-answer" : "noAnswer"} ${status}`;

  const { width: contentWidth } = measureText(userSelections[dropTargetIndex], btnStyle);
  const textPadding = lessMinWidth ? 2 : 20;
  const indexBoxWidth = showAnswer ? 40 : 0;
  const isOverContent = btnStyle.width < contentWidth + textPadding + indexBoxWidth;
  const popoverContent = (
    <PopoverContent
      index={dropTargetIndex}
      userSelections={userSelections}
      status={status}
      isExpressGrader={isExpressGrader}
      checkAnswer={checkAnswer}
    />
  );
  const content = (
    <div style={btnStyle} className={`${classNames} show-answer`} onClick={onClickHandler}>
      <span
        className="index index-box"
        style={{ display: !checkAnswer && (showAnswer && !lessMinWidth) ? "flex" : "none" }}
      >
        {indexStr}
      </span>
      <div className="text container" style={textContainerStyle}>
        <div className="clipText">{userSelections[dropTargetIndex]}</div>
        <div
          style={{
            display: checkAnswer || (showAnswer && !lessMinWidth) ? "flex" : "none"
          }}
        >
          <IconWrapper rightPosition={lessMinWidth ? "5" : "10"}>
            {answered && status === "right" && <RightIcon />}
            {answered && status === "wrong" && <WrongIcon />}
          </IconWrapper>
          <Pointer className={responseContainer.pointerPosition} width={responseContainer.width}>
            <Point />
            <Triangle />
          </Pointer>
        </div>
      </div>
    </div>
  );
  return answered && (isOverContent || lessMinWidth) ? <Popover content={popoverContent}>{content}</Popover> : content;
};

Response.propTypes = {
  lessMinWidth: Proptypes.bool,
  showAnswer: Proptypes.bool,
  checkAnswer: Proptypes.bool,
  btnStyle: Proptypes.object,
  responseContainer: Proptypes.object.isRequired,
  userSelections: Proptypes.array.isRequired,
  status: Proptypes.string.isRequired,
  onClickHandler: Proptypes.func.isRequired,
  indexStr: Proptypes.string.isRequired,
  dropTargetIndex: Proptypes.number.isRequired,
  isExpressGrader: Proptypes.bool.isRequired
};

Response.defaultProps = {
  lessMinWidth: false,
  showAnswer: false,
  checkAnswer: false,
  btnStyle: {}
};

export default Response;
