/* eslint-disable react/prop-types */
import React, { useRef } from "react";
import PropTypes from "prop-types";
import { withTheme } from "styled-components";
import { get } from "lodash";
import { response } from "@edulastic/constants";
import { DragDrop } from "@edulastic/common";
import TextContainer from "./TextContainer";

import { Pointer } from "../../../../styled/Pointer";
import { Point } from "../../../../styled/Point";
import { Triangle } from "../../../../styled/Triangle";

import { IconWrapper } from "./styled/IconWrapper";
import { RightIcon } from "./styled/RightIcon";
import { WrongIcon } from "./styled/WrongIcon";
import { WithPopover } from "./WithPopover";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz";
const { DropContainer } = DragDrop;

const CheckboxTemplateBox = ({
  index,
  showAnswer,
  checkAnswer,
  responseContainer,
  responsecontainerindividuals,
  responseBtnStyle,
  userSelections,
  stemNumeration,
  evaluation,
  onDropHandler,
  theme,
  disableResponse,
  isSnapFitValues,
  isExpressGrader,
  lessMinWidth,
  imageWidth,
  imageHeight,
  isPrintMode = false,
  fontSize,
  isPrintPreview = false
}) => {
  const { height: respHeight, width: respWidth, left: respLeft, top: respTop } = responseContainer;

  const status = evaluation[index] ? "right" : "wrong";

  const isChecked =
    get(userSelections, `[${index}].responseBoxID`, false) &&
    !!get(userSelections, `[${index}].value`, []).length &&
    evaluation[index] !== undefined;

  const btnStyle = {
    widthpx: respWidth,
    top: isPrintMode ? `${(respTop / imageHeight) * 100}%` : respTop,
    left: isPrintMode ? `${(respLeft / imageWidth) * 100}%` : respLeft,
    position: "absolute",
    borderRadius: 5
  };

  if (responseBtnStyle && responseBtnStyle) {
    btnStyle.width = responseBtnStyle.widthpx;
  } else {
    btnStyle.width = btnStyle.widthpx;
  }

  if (responsecontainerindividuals && responsecontainerindividuals[index]) {
    const { widthpx } = responsecontainerindividuals[index];
    btnStyle.width = widthpx;
    btnStyle.widthpx = widthpx;
  }

  let indexStr = "";
  switch (stemNumeration) {
    case "lowercase": {
      indexStr = ALPHABET[index];
      break;
    }
    case "uppercase": {
      indexStr = ALPHABET[index].toUpperCase();
      break;
    }
    default:
      indexStr = index + 1;
  }

  const {
    answerBox: { borderWidth, borderStyle, borderColor }
  } = theme;

  const dropContainerStyle = {
    ...btnStyle,
    width: isPrintMode ? `${(respWidth / imageWidth) * 100}%` : respWidth,
    height: isPrintMode ? `${(respHeight / imageHeight) * 100}%` : respHeight,
    minWidth: lessMinWidth ? parseInt(respWidth, 10) + 4 : response.minWidthShowAnswer,
    maxWidth: response.maxWidth,
    background: !isChecked && !isSnapFitValues && (checkAnswer || showAnswer) ? "lightgray" : null,
    border: `${borderWidth} ${borderStyle} ${borderColor}`,
    paddingRight: "25px"
  };

  let containerClassName = `imagelabeldragdrop-droppable active ${isChecked ? "check-answer" : "noAnswer"} ${status}`;
  containerClassName = showAnswer || checkAnswer ? `${containerClassName} show-answer` : containerClassName;

  const icons = (checkAnswer || (showAnswer && !lessMinWidth)) && (
    <>
      <IconWrapper>
        {isChecked && status === "right" && <RightIcon />}
        {isChecked && status === "wrong" && <WrongIcon />}
      </IconWrapper>
      <Pointer className={responseContainer.pointerPosition} width={respWidth}>
        <Point />
        <Triangle />
      </Pointer>
    </>
  );

  const indexBoxRef = useRef();

  const responseBoxIndex = showAnswer && (
    <div
      style={{
        alignSelf: "stretch",
        height: "auto",
        width: lessMinWidth ? "20px" : null,
        maxWidth: lessMinWidth && "20%",
        padding: lessMinWidth && "0 8px",
        display: !lessMinWidth ? "flex" : "none"
      }}
      className="index index-box"
      ref={indexBoxRef}
    >
      {indexStr}
    </div>
  );

  const textContainerStyle = checkAnswer
    ? {
        borderRadius: 5,
        justifyContent: lessMinWidth ? "flex-start" : "center",
        width: isPrintMode ? "" : respWidth,
        height: isPrintMode ? "" : respHeight
      }
    : {
        width: isPrintMode ? "" : respWidth,
        height: isPrintMode ? "" : respHeight,
        background: (isPrintMode || isPrintPreview) && "transparent"
      };

  const userAnswer = userSelections[index]?.value?.join(" ") || "";

  return (
    <WithPopover
      fontSize={fontSize}
      containerDimensions={{ width: respWidth, height: respHeight }}
      index={index}
      userAnswer={userAnswer}
      status={status}
      checkAnswer={checkAnswer}
      className={containerClassName}
      indexStr={indexStr}
    >
      <DropContainer
        index={index}
        style={dropContainerStyle}
        className={containerClassName}
        drop={onDropHandler}
        disableResponse={disableResponse}
      >
        {responseBoxIndex}
        <div
          className="text container"
          style={showAnswer || checkAnswer ? { ...textContainerStyle, padding: !isPrintPreview && "0px" } : {}}
        >
          <TextContainer
            dropTargetIndex={index}
            userSelections={userSelections}
            isSnapFitValues={isSnapFitValues}
            showAnswer={showAnswer}
            checkAnswer={checkAnswer}
            // dragItemStyle={dragItemStyle}
            lessMinWidth={lessMinWidth}
            className={containerClassName}
            status={status}
            isChecked={isChecked}
            style={
              checkAnswer
                ? {
                    borderRadius: 5,
                    justifyContent: lessMinWidth ? "flex-start" : "center",
                    width: isPrintMode ? "" : respWidth,
                    height: isPrintMode ? "" : respHeight
                  }
                : {
                    width: isPrintMode ? "" : respWidth,
                    height: isPrintMode ? "" : respHeight
                  }
            }
            isExpressGrader={isExpressGrader}
            isPrintPreview={isPrintPreview}
          />
        </div>
        {isSnapFitValues && icons}
      </DropContainer>
    </WithPopover>
  );
};

const CheckboxTemplateBoxLayout = props => {
  const { checkAnswer, responseContainers, annotations, image, snapItems, isSnapFitValues, showDropItemBorder } = props;
  const lessMinWidth = responseContainers.some(
    responseContainer => parseInt(responseContainer.width, 10) < response.minWidthShowAnswer
  );
  return (
    <>
      {annotations}
      {image}
      {snapItems}
      {responseContainers.map((responseContainer, index) => {
        if (!isSnapFitValues && checkAnswer && !showDropItemBorder) {
          return null;
        }
        return (
          <CheckboxTemplateBox
            key={index}
            index={index}
            responseContainer={responseContainer}
            {...props}
            lessMinWidth={lessMinWidth}
          />
        );
      })}
    </>
  );
};

CheckboxTemplateBox.propTypes = {
  index: PropTypes.number.isRequired,
  responseContainer: PropTypes.object.isRequired,
  responsecontainerindividuals: PropTypes.array.isRequired,
  responseBtnStyle: PropTypes.object.isRequired,
  userSelections: PropTypes.array.isRequired,
  stemNumeration: PropTypes.string.isRequired,
  evaluation: PropTypes.array.isRequired,
  showAnswer: PropTypes.bool.isRequired,
  checkAnswer: PropTypes.bool.isRequired,
  onDropHandler: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  disableResponse: PropTypes.bool.isRequired,
  lessMinWidth: PropTypes.bool.isRequired,
  isExpressGrader: PropTypes.bool.isRequired,
  isSnapFitValues: PropTypes.bool.isRequired
};

CheckboxTemplateBoxLayout.propTypes = {
  responseContainers: PropTypes.array.isRequired,
  checkAnswer: PropTypes.bool.isRequired,
  annotations: PropTypes.any.isRequired,
  image: PropTypes.any.isRequired,
  snapItems: PropTypes.any.isRequired,
  isSnapFitValues: PropTypes.bool.isRequired,
  showDropItemBorder: PropTypes.bool.isRequired
};

export default withTheme(React.memo(CheckboxTemplateBoxLayout));
