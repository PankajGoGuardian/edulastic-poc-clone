import React, { useState } from "react";
import Proptypes from "prop-types";
import { Popover } from "antd";

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
  const [showIndex, toggleIndexVisibility] = useState(!lessMinWidth);
  const hoverProps = {};
  if ((showAnswer || isExpressGrader) && lessMinWidth) {
    hoverProps.onMouseEnter = () => toggleIndexVisibility(!showIndex);
    hoverProps.onMouseLeave = () => toggleIndexVisibility(!showIndex);
  }
  const textContainerStyle = {
    minwidth: "100%",
    padding: lessMinWidth ? "0 1px" : null,
    justifyContent: "flex-start",
    alignItems: "center"
  };
  const classNames = `
            testing
            imagelabeldragdrop-droppable 
            active
            ${userSelections.length > 0 ? "check-answer" : "noAnswer"} 
            ${status} 
            show-answer`;

  const popoverContent = (
    // eslint-disable-next-line max-len
    <PopoverContent
      index={dropTargetIndex}
      userSelections={userSelections}
      status={status}
      isExpressGrader={isExpressGrader}
      checkAnswer={checkAnswer}
    />
  );
  const content = (
    <div style={btnStyle} className={classNames} onClick={onClickHandler} {...hoverProps}>
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
          <IconWrapper rightPosition={lessMinWidth ? "1" : "10"}>
            {userSelections.length > 0 && status === "right" && <RightIcon />}
            {userSelections.length > 0 && status === "wrong" && <WrongIcon />}
          </IconWrapper>
          <Pointer className={responseContainer.pointerPosition} width={responseContainer.width}>
            <Point />
            <Triangle />
          </Pointer>
        </div>
      </div>
    </div>
  );
  return lessMinWidth ? <Popover content={popoverContent}>{content}</Popover> : content;
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
