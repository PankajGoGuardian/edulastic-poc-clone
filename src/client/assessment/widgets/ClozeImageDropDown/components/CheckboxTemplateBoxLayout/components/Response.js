import React from "react";
import Proptypes from "prop-types";
import { Popover } from "antd";
import { measureText, MathSpan } from "@edulastic/common";
import { white } from "@edulastic/colors";
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
  status,
  onClickHandler,
  indexStr,
  answered,
  isExpressGrader,
  isPrintPreview,
  imageHeight,
  imageWidth
}) => {
  const textContainerStyle = {
    minwidth: "100%",
    padding: lessMinWidth ? "0 1px" : null,
    justifyContent: "flex-start",
    alignItems: "center",
    background: isPrintPreview && white
  };

  const classNames = `imagelabeldragdrop-droppable active ${answered ? "check-answer" : "noAnswer"} ${status}`;

  const { width: contentWidth } = measureText(answered, btnStyle);
  const textPadding = lessMinWidth ? 2 : 30;
  const indexBoxWidth = showAnswer ? 40 : 0;
  const isOverContent = btnStyle.width < contentWidth + textPadding + indexBoxWidth;

  const modifiedDimesion = {};
  if (isPrintPreview) {
    modifiedDimesion.width = `${(btnStyle.width / imageWidth) * 100}%`;
    modifiedDimesion.height = `${(btnStyle.height / imageHeight) * 100}%`;
  }

  const popoverContent = (
    <PopoverContent
      indexStr={indexStr}
      answered={answered}
      status={status}
      isExpressGrader={isExpressGrader}
      checkAnswer={checkAnswer}
    />
  );

  const content = (
    <div style={{ ...btnStyle, ...modifiedDimesion }} className={`${classNames} show-answer`} onClick={onClickHandler}>
      <span
        className="index index-box"
        style={{ display: !checkAnswer && (showAnswer && !lessMinWidth) ? "flex" : "none" }}
      >
        {indexStr}
      </span>
      <div className="text container" style={textContainerStyle}>
        <div className="clipText">
          <MathSpan dangerouslySetInnerHTML={{ __html: answered || "" }} />
        </div>
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
  status: Proptypes.string.isRequired,
  onClickHandler: Proptypes.func.isRequired,
  indexStr: Proptypes.string.isRequired,
  isExpressGrader: Proptypes.bool.isRequired
};

Response.defaultProps = {
  lessMinWidth: false,
  showAnswer: false,
  checkAnswer: false,
  btnStyle: {}
};

export default Response;
