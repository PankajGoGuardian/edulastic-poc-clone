import React from "react";
import Proptypes from "prop-types";
import { Popover } from "antd";
import { measureText, MathSpan } from "@edulastic/common";
import { convertToMathTemplate } from "@edulastic/common/src/utils/mathUtils";
import { Pointer } from "../../../../../styled/Pointer";
import { Point } from "../../../../../styled/Point";
import { Triangle } from "../../../../../styled/Triangle";
import { IconWrapper } from "../styled/IconWrapper";
import { WrongIcon } from "../styled/WrongIcon";
import { RightIcon } from "../styled/RightIcon";
import PopoverContent from "../../PopoverContent";
import { CheckBox } from "../styled/CheckBox";

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
  const userAnswer = convertToMathTemplate(answered);
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
      answered={userAnswer}
      status={status}
      isExpressGrader={isExpressGrader}
      checkAnswer={checkAnswer}
    />
  );

  const content = (
    <CheckBox
      style={{ ...btnStyle, ...modifiedDimesion }}
      onClick={onClickHandler}
      checked={userAnswer}
      correct={status === "right"}
      isPrintPreview={isPrintPreview}
    >
      <span className="index">{indexStr}</span>
      <div className="text">
        <div className="clipText">
          <MathSpan dangerouslySetInnerHTML={{ __html: userAnswer }} />
        </div>
      </div>
      <div className="icons">
        <IconWrapper rightPosition={lessMinWidth ? "5" : "10"}>
          {userAnswer && status === "right" && <RightIcon />}
          {userAnswer && status === "wrong" && <WrongIcon />}
        </IconWrapper>
        <Pointer className={responseContainer.pointerPosition} width={responseContainer.width}>
          <Point />
          <Triangle />
        </Pointer>
      </div>
    </CheckBox>
  );
  return userAnswer && (isOverContent || lessMinWidth) ? (
    <Popover content={popoverContent}>{content}</Popover>
  ) : (
    content
  );
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
