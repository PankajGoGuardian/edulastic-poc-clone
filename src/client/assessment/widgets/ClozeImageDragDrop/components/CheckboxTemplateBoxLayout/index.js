import React from "react";
import PropTypes from "prop-types";
import { withTheme } from "styled-components";
import { get } from "lodash";

import { MathSpan } from "@edulastic/common";

import striptags from "striptags";
import { response } from "@edulastic/constants";
import DropContainer from "../DropContainer";
import DragItem from "../DragItem";

import { Pointer } from "../../../../styled/Pointer";
import { Point } from "../../../../styled/Point";
import { Triangle } from "../../../../styled/Triangle";

import { IconWrapper } from "./styled/IconWrapper";
import { RightIcon } from "./styled/RightIcon";
import { WrongIcon } from "./styled/WrongIcon";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz";

const CheckboxTemplateBoxLayout = ({
  showAnswer,
  checkAnswer,
  responseContainers,
  annotations,
  image,
  snapItems,
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
  isSnapFitValues,
  showDropItemBorder
}) => (
  <>
    {annotations}
    {image}
    {snapItems}
    {responseContainers.map((responseContainer, index) => {
      if (!isSnapFitValues && checkAnswer && !showDropItemBorder) {
        return null;
      }
      const dropTargetIndex = index;
      const btnStyle = {
        widthpx: responseContainer.width,
        width: responseContainer.width,
        top: responseContainer.top,
        left: responseContainer.left,
        height: responseContainer.height,
        position: "absolute",
        borderRadius: 5
      };

      if (responseBtnStyle && responseBtnStyle) {
        btnStyle.width = responseBtnStyle.widthpx;
      } else {
        btnStyle.width = btnStyle.widthpx;
      }

      if (responsecontainerindividuals && responsecontainerindividuals[dropTargetIndex]) {
        const { widthpx } = responsecontainerindividuals[dropTargetIndex];
        btnStyle.width = widthpx;
        btnStyle.widthpx = widthpx;
      }

      let indexStr = "";
      switch (stemNumeration) {
        case "lowercase": {
          indexStr = ALPHABET[dropTargetIndex];
          break;
        }
        case "uppercase": {
          indexStr = ALPHABET[dropTargetIndex].toUpperCase();
          break;
        }
        default:
          indexStr = dropTargetIndex + 1;
      }
      const status = evaluation[dropTargetIndex] ? "right" : "wrong";
      const isChecked =
        get(userSelections, `[${dropTargetIndex}].responseBoxID`, false) &&
        !!get(userSelections, `[${dropTargetIndex}].value`, []).length;

      const dragItemStyle = {
        border: `${showBorder ? `solid 1px ${theme.widgets.clozeImageDragDrop.dragItemBorderColor}` : null}`,
        margin: 5,
        padding: 5,
        display: "inline-block",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        width: "max-content",
        minWidth: response.minWidth,
        maxWidth: response.maxWidth,
        overflow: "hidden"
      };

      const dropContainerStyle = {
        ...btnStyle,
        width: responseContainer.width || "max-content",
        height: responseContainer.height,
        minWidth: response.minWidth,
        maxWidth: response.maxWidth,
        background: !isChecked && !isSnapFitValues && (checkAnswer || showAnswer) ? "lightgray" : null
      };

      let containerClassName = `imagelabeldragdrop-droppable active ${
        isChecked ? "check-answer" : "noAnswer"
      } ${status}`;
      containerClassName = showAnswer || checkAnswer ? `${containerClassName} show-answer` : containerClassName;

      const icons = (
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

      const responseBoxIndex = showAnswer && (
        <div style={{ alignSelf: "stretch", height: "auto" }} className="index index-box">
          {indexStr}
        </div>
      );

      return (
        <React.Fragment key={index}>
          <DropContainer
            index={index}
            style={dropContainerStyle}
            className={containerClassName}
            drop={drop}
            disableResponse={disableResponse}
          >
            {!isSnapFitValues
              ? ((isChecked && status === "right") || showAnswer) && responseBoxIndex
              : responseBoxIndex}
            <div className="text container" style={showAnswer || checkAnswer ? { padding: "0px" } : {}}>
              {userSelections[dropTargetIndex] &&
                userSelections[dropTargetIndex].value.map((answer, user_select_index) => {
                  const title = striptags(answer) || null;
                  const userAnswer =
                    userSelections[dropTargetIndex].responseBoxID && isSnapFitValues
                      ? answer.replace("<p>", "<p class='clipText'>") || ""
                      : "";
                  return (
                    <DragItem
                      key={user_select_index}
                      index={user_select_index}
                      data={`${answer}_${dropTargetIndex}_${user_select_index}`}
                      style={dragItemStyle}
                      item={answer}
                      onDrop={onDropHandler}
                      disable={!isSnapFitValues}
                      disableResponse={disableResponse}
                    >
                      <div title={title}>
                        <MathSpan dangerouslySetInnerHTML={{ __html: userAnswer }} />
                      </div>
                    </DragItem>
                  );
                })}
            </div>
            {isSnapFitValues && icons}
          </DropContainer>
        </React.Fragment>
      );
    })}
  </>
);

CheckboxTemplateBoxLayout.propTypes = {
  responsecontainerindividuals: PropTypes.array.isRequired,
  responseContainers: PropTypes.array.isRequired,
  responseBtnStyle: PropTypes.object.isRequired,
  userSelections: PropTypes.array.isRequired,
  stemNumeration: PropTypes.string.isRequired,
  evaluation: PropTypes.array.isRequired,
  showAnswer: PropTypes.bool.isRequired,
  checkAnswer: PropTypes.bool.isRequired,
  onDropHandler: PropTypes.func.isRequired,
  annotations: PropTypes.any.isRequired,
  image: PropTypes.any.isRequired,
  snapItems: PropTypes.any.isRequired,
  drop: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
  disableResponse: PropTypes.bool.isRequired,
  showBorder: PropTypes.bool.isRequired,
  isSnapFitValues: PropTypes.bool.isRequired,
  showDropItemBorder: PropTypes.bool.isRequired
};

export default withTheme(React.memo(CheckboxTemplateBoxLayout));
