import React, { useState } from "react";
import PropTypes from "prop-types";
import { Popover } from "antd";

import { response } from "@edulastic/constants";
import { Pointer } from "../../../../../styled/Pointer";
import { Point } from "../../../../../styled/Point";
import { Triangle } from "../../../../../styled/Triangle";
import { IconWrapper } from "../styled/IconWrapper";
import { RightIcon } from "../styled/RightIcon";
import { WrongIcon } from "../styled/WrongIcon";
import PopoverContent from "../../PopoverContent";

const Response = ({
  showAnswer,
  checkAnswer,
  responseContainer,
  btnStyle,
  userSelections,
  onClickHandler,
  status,
  dropTargetIndex,
  indexStr,
  lessMinWidth,
  isExpressGrader
}) => {
  const [showIndex, toggleIndexVisibility] = useState(!lessMinWidth);
  const handleHover = () => {
    if (showAnswer && lessMinWidth) {
      toggleIndexVisibility(!showIndex);
    }
  };
  const textStyle = {
    maxWidth: showAnswer && showIndex ? "50%" : "75%"
  };

  const className = `imagelabeldragdrop-droppable active ${
    userSelections.length > 0 ? "check-answer" : "noAnswer"
  } ${status} show-answer`;

  const popoverContent = (
    <PopoverContent
      // stemNumeration={stemNumeration}
      index={dropTargetIndex}
      // fontSize={fontSize}
      userSelections={userSelections}
      status={status}
      btnStyle={{ ...btnStyle, position: "unset" }}
      // textContainerStyle={textContainerStyle}
      textStyle={textStyle}
      checkAnswer={checkAnswer}
      className={className}
      isExpressGrader={isExpressGrader}
    />
  );

  const content = (
    <div
      key={dropTargetIndex}
      style={{ ...btnStyle, minHeight: `${response.minHeight}px` }}
      className={className}
      onClick={onClickHandler}
      onMouseEnter={handleHover}
      onMouseLeave={handleHover}
    >
      <span className="index index-box" style={{ display: checkAnswer || lessMinWidth ? "none" : "flex" }}>
        {indexStr}
      </span>
      <div className="text container" style={{ padding: lessMinWidth ? "0 0 0 4px" : null }}>
        <div className="clipText" style={textStyle}>
          {userSelections[dropTargetIndex]}
        </div>
        {(checkAnswer || (showAnswer && !lessMinWidth)) && (
          <div>
            <IconWrapper rightPosition={10}>
              {userSelections.length > 0 && status === "right" && <RightIcon />}
              {userSelections.length > 0 && status === "wrong" && <WrongIcon />}
            </IconWrapper>
            <Pointer className={responseContainer.pointerPosition} width={responseContainer.width}>
              <Point />
              <Triangle />
            </Pointer>
          </div>
        )}
      </div>
    </div>
  );

  return lessMinWidth ? <Popover content={popoverContent}>{content}</Popover> : content;
};

Response.propTypes = {
  showAnswer: PropTypes.bool.isRequired,
  checkAnswer: PropTypes.bool.isRequired,
  responseContainer: PropTypes.object.isRequired,
  btnStyle: PropTypes.object,
  userSelections: PropTypes.array.isRequired,
  onClickHandler: PropTypes.func.isRequired,
  status: PropTypes.string,
  dropTargetIndex: PropTypes.number.isRequired,
  indexStr: PropTypes.string,
  lessMinWidth: PropTypes.bool,
  isExpressGrader: PropTypes.bool.isRequired
};

Response.defaultProps = {
  btnStyle: {},
  status: "",
  indexStr: "",
  lessMinWidth: false
};

export default Response;
