import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import { withTheme } from "styled-components";
import { get, isNull } from "lodash";

import { response } from "@edulastic/constants";
import DropContainer from "../DropContainer";
import TextContainer from "./TextContainer";

import { Pointer } from "../../../../styled/Pointer";
import { Point } from "../../../../styled/Point";
import { Triangle } from "../../../../styled/Triangle";

import { IconWrapper } from "./styled/IconWrapper";
import { RightIcon } from "./styled/RightIcon";
import { WrongIcon } from "./styled/WrongIcon";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz";

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
  drop,
  onDropHandler,
  theme,
  showBorder,
  disableResponse,
  isSnapFitValues
}) => {
  const [hideIndexBox, updateVisibility] = useState(null);

  const updateIndexBoxVisibility = visibility => {
    if (isNull(hideIndexBox)) {
      updateVisibility(visibility);
    }
  };

  const status = evaluation[index] ? "right" : "wrong";
  const isChecked =
    get(userSelections, `[${index}].responseBoxID`, false) && !!get(userSelections, `[${index}].value`, []).length;

  const btnStyle = {
    widthpx: responseContainer.width,
    top: responseContainer.top,
    left: responseContainer.left,
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
    padding: 5,
    display: "inline-flex",
    alignItems: "center",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    width: "max-content",
    minWidth: response.minWidth,
    maxWidth: "80%",
    overflow: "hidden"
  };

  const dropContainerStyle = {
    ...btnStyle,
    width: responseContainer.width,
    height: responseContainer.height,
    minWidth: response.minWidth,
    maxWidth: response.maxWidth,
    background: !isChecked && !isSnapFitValues && (checkAnswer || showAnswer) ? "lightgray" : null
  };

  let containerClassName = `imagelabeldragdrop-droppable active ${isChecked ? "check-answer" : "noAnswer"} ${status}`;
  containerClassName = showAnswer || checkAnswer ? `${containerClassName} show-answer` : containerClassName;

  const icons = !hideIndexBox && (
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

  const responseBoxIndex = !hideIndexBox && showAnswer && (
    <div style={{ alignSelf: "stretch", height: "auto" }} className="index index-box" ref={indexBoxRef}>
      {indexStr}
    </div>
  );

  return (
    <DropContainer
      index={index}
      style={dropContainerStyle}
      className={containerClassName}
      drop={drop}
      disableResponse={disableResponse}
    >
      {!isSnapFitValues ? ((isChecked && status === "right") || showAnswer) && responseBoxIndex : responseBoxIndex}
      <TextContainer
        dropTargetIndex={index}
        userSelections={userSelections}
        isSnapFitValues={isSnapFitValues}
        showAnswer={showAnswer}
        checkAnswer={checkAnswer}
        dragItemStyle={dragItemStyle}
        onDropHandler={onDropHandler}
        disableResponse={disableResponse}
        dropContainerWidth={dropContainerStyle.width}
        indexBoxRef={indexBoxRef}
        onHideIndexBox={updateIndexBoxVisibility}
        style={
          hideIndexBox || checkAnswer
            ? {
                borderRadius: 5,
                justifyContent: hideIndexBox && "center",
                width: responseContainer.width,
                height: responseContainer.height
              }
            : { width: responseContainer.width, height: responseContainer.height }
        }
      />
      {isSnapFitValues && icons}
    </DropContainer>
  );
};

const CheckboxTemplateBoxLayout = props => {
  const { checkAnswer, responseContainers, annotations, image, snapItems, isSnapFitValues, showDropItemBorder } = props;
  return (
    <>
      {annotations}
      {image}
      {snapItems}
      {responseContainers.map((responseContainer, index) => {
        if (!isSnapFitValues && checkAnswer && !showDropItemBorder) {
          return null;
        }
        return <CheckboxTemplateBox key={index} index={index} responseContainer={responseContainer} {...props} />;
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
  drop: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  disableResponse: PropTypes.bool.isRequired,
  showBorder: PropTypes.bool.isRequired,
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
