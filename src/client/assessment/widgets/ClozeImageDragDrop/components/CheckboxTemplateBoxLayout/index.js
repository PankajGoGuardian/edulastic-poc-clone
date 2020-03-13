/* eslint-disable react/prop-types */
import React, { useRef, useState } from "react";
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
  showBorder,
  disableResponse,
  isSnapFitValues,
  isExpressGrader,
  lessMinWidth,
  imageWidth,
  imageHeight,
  isPrintMode
}) => {
  const [showIndex, toggleIndexVisibility] = useState(!lessMinWidth);

  const handleHover = () => {
    if (showAnswer && lessMinWidth) {
      toggleIndexVisibility(!showIndex);
    }
  };

  const status = evaluation[index] ? "right" : "wrong";

  const isChecked =
    get(userSelections, `[${index}].responseBoxID`, false) &&
    !!get(userSelections, `[${index}].value`, []).length &&
    evaluation[index] !== undefined;

  const btnStyle = {
    widthpx: responseContainer.width,
    top: isPrintMode ? `${(responseContainer.top / imageHeight) * 100}%` : responseContainer.top,
    left: isPrintMode ? `${(responseContainer.left / imageWidth) * 100}%` : responseContainer.left,
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

  const dragItemStyle = {
    border: `${showBorder ? `solid 1px ${theme.widgets.clozeImageDragDrop.dragItemBorderColor}` : null}`,
    padding: lessMinWidth ? "0px 2px" : "0px 5px",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    width: "max-content",
    minWidth: response.minWidth,
    maxWidth: lessMinWidth ? "80%" : "90%", // adjusting content(mainly images) alongwith the padding
    overflow: "hidden",
    height: "100%"
  };

  const dropContainerStyle = {
    ...btnStyle,
    width: isPrintMode ? `${(responseContainer.width / imageWidth) * 100}%` : responseContainer.width,
    height: isPrintMode ? `${(responseContainer.height / imageHeight) * 100}%` : responseContainer.height,
    minWidth: lessMinWidth ? parseInt(responseContainer.width, 10) + 4 : response.minWidthShowAnswer,
    maxWidth: response.maxWidth,
    background: !isChecked && !isSnapFitValues && (checkAnswer || showAnswer) ? "lightgray" : null
  };

  let containerClassName = `imagelabeldragdrop-droppable active ${isChecked ? "check-answer" : "noAnswer"} ${status}`;
  containerClassName = showAnswer || checkAnswer ? `${containerClassName} show-answer` : containerClassName;

  const icons = (checkAnswer || (showAnswer && !lessMinWidth)) && (
    <>
      <IconWrapper>
        {isChecked && status === "right" && <RightIcon />}
        {isChecked && status === "wrong" && <WrongIcon />}
      </IconWrapper>
      <Pointer className={responseContainer.pointerPosition} width={responseContainer.width}>
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
        width: isPrintMode ? "" : responseContainer.width,
        height: isPrintMode ? "" : responseContainer.height
      }
    : { width: isPrintMode ? "" : responseContainer.width, height: isPrintMode ? "" : responseContainer.height };

  return (
    <div onMouseEnter={handleHover} onMouseLeave={handleHover}>
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
          style={showAnswer || checkAnswer ? { ...textContainerStyle, padding: "0px" } : {}}
        >
          <TextContainer
            dropTargetIndex={index}
            userSelections={userSelections}
            isSnapFitValues={isSnapFitValues}
            showAnswer={showAnswer}
            checkAnswer={checkAnswer}
            dragItemStyle={dragItemStyle}
            lessMinWidth={lessMinWidth}
            className={containerClassName}
            status={status}
            isChecked={isChecked}
            style={
              checkAnswer
                ? {
                    borderRadius: 5,
                    justifyContent: lessMinWidth ? "flex-start" : "center",
                    width: isPrintMode ? "" : responseContainer.width,
                    height: isPrintMode ? "" : responseContainer.height
                  }
                : {
                    width: isPrintMode ? "" : responseContainer.width,
                    height: isPrintMode ? "" : responseContainer.height
                  }
            }
            isExpressGrader={isExpressGrader}
          />
        </div>
        {isSnapFitValues && icons}
      </DropContainer>
    </div>
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
  showBorder: PropTypes.bool.isRequired,
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
