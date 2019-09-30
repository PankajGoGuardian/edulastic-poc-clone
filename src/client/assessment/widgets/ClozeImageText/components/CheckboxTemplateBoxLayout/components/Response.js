import React, { useState } from "react";
import PropTypes from "prop-types";
import { Tooltip } from "antd";

import { response } from "@edulastic/constants";
import { Pointer } from "../../../../../styled/Pointer";
import { Point } from "../../../../../styled/Point";
import { Triangle } from "../../../../../styled/Triangle";
import { IconWrapper } from "../styled/IconWrapper";
import { RightIcon } from "../styled/RightIcon";
import { WrongIcon } from "../styled/WrongIcon";

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
  lessMinWidth
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
  return (
    <Tooltip title={userSelections?.[dropTargetIndex]}>
      <div
        key={dropTargetIndex}
        style={{ ...btnStyle, minHeight: `${response.minHeight}px` }}
        className={`
                        imagelabeldragdrop-droppable 
                        active 
                        ${userSelections.length > 0 ? "check-answer" : "noAnswer"}
                        ${status} 
                        show-answer`}
        onClick={onClickHandler}
        onMouseEnter={handleHover}
        onMouseLeave={handleHover}
      >
        {showAnswer && showIndex && (
          <span
            className="index index-box"
            style={{
              width: Math.max(responseContainer.width / 2, 20),
              maxWidth: "33%"
            }}
          >
            {indexStr}
          </span>
        )}
        <div className="text container" style={{ padding: lessMinWidth ? "0 0 0 4px" : null }}>
          <div className="clipText" style={textStyle}>
            {userSelections[dropTargetIndex]}
          </div>
          {(checkAnswer || (showAnswer && showIndex)) && (
            <div>
              <IconWrapper rightPosition={Math.min(responseContainer.width / 6, 1)}>
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
    </Tooltip>
  );
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
  lessMinWidth: PropTypes.bool
};

Response.defaultProps = {
  btnStyle: {},
  status: "",
  indexStr: "",
  lessMinWidth: false
};

export default Response;
