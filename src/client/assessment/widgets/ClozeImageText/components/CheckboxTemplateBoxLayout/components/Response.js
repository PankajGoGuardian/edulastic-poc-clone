import React from "react";
import PropTypes from "prop-types";
import { Popover } from "antd";
import { measureText } from "@edulastic/common";
import { response } from "@edulastic/constants";
import { white } from "@edulastic/colors";
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
  isExpressGrader,
  isPrintPreview
}) => {
  const { width: contentWidth } = measureText(userSelections[dropTargetIndex], btnStyle); // returns number

  const padding = lessMinWidth ? 4 : 30;
  const indexWidth = showAnswer ? 40 : 0;
  const boxWidth = parseInt(btnStyle.width, 10); // need to convert string to number ( "159px" => 159 ) for comparing
  /**
   *
   * content entered by user cannot be shown completely in the box
   * need to show ellipsis in the box
   * show entire entire answer in a popover on hover over the box
   *
   */
  const isOverConent = boxWidth < contentWidth + padding + indexWidth;
  const hasAnswered = userSelections?.[dropTargetIndex];

  const className = `imagelabeldragdrop-droppable active ${
    hasAnswered ? "check-answer" : "noAnswer"
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
    >
      <span className="index index-box" style={{ display: checkAnswer || lessMinWidth ? "none" : "flex" }}>
        {indexStr}
      </span>
      <div
        className="text container"
        style={{ padding: lessMinWidth ? "0 0 0 4px" : null, background: isPrintPreview && white }}
      >
        <div className="clipText">{userSelections[dropTargetIndex]}</div>
        {(checkAnswer || showAnswer) && (
          <div>
            {hasAnswered && (
              <IconWrapper>
                {status === "right" && <RightIcon />}
                {status === "wrong" && <WrongIcon />}
              </IconWrapper>
            )}
            <Pointer className={responseContainer.pointerPosition} width={responseContainer.width}>
              <Point />
              <Triangle />
            </Pointer>
          </div>
        )}
      </div>
    </div>
  );

  // eslint-disable-next-line max-len
  return (isOverConent || lessMinWidth) && hasAnswered ? (
    <Popover content={popoverContent}>{content}</Popover>
  ) : (
    content
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
