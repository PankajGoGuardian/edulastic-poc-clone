import React from "react";
import { withTheme } from "styled-components";
import { response } from "@edulastic/constants";
import { DragDrop } from "@edulastic/common";
import { get } from "lodash";
import { Pointer } from "../../../styled/Pointer";
import { Point } from "../../../styled/Point";
import { Triangle } from "../../../styled/Triangle";

import AnswerContainer from "../AnswerContainer";
import { Container } from "./Container";

const { DragItem, DropContainer } = DragDrop;

const ResponseContainers = ({
  responseContainers,
  showDropItemBorder,
  smallSize,
  isWrapText,
  transparentBackground,
  theme,
  userAnswers,
  showDashedBorder,
  dragItemStyle,
  onDrop,
  fontSize,
  isPrintMode,
  imageWidth,
  imageHeight
}) => {
  const getContainerStyle = container => {
    const responseContainerLeft = smallSize ? container.left / 2 : container.left;
    const top = smallSize ? container.top / 2 : container.top;
    const width = container.width || response.minWidth;
    const height = isWrapText ? "auto" : container.height || "auto";
    const btnStyle = {
      position: "absolute",
      top: isPrintMode ? `${(top / imageHeight) * 100}%` : top,
      left: isPrintMode ? `${(responseContainerLeft / imageWidth) * 100}%` : responseContainerLeft,
      maxWidth: response.maxWidth,
      width: isPrintMode ? `${(width / imageWidth) * 100}%` : width,
      minHeight: isPrintMode && !`${height}`.includes("auto") ? `${(height / imageHeight) * 100}%` : height,
      background: transparentBackground ? "transparent" : theme.widgets.clozeImageDragDrop.responseBoxBgColor,
      border: showDropItemBorder
        ? showDashedBorder
          ? `dashed 2px ${theme.widgets.clozeImageDragDrop.dropContainerDashedBorderColor}`
          : `solid 1px ${theme.widgets.clozeImageDragDrop.dropContainerSolidBorderColor}`
        : 0,
      borderRadius: 5,
      display: "flex",
      padding: "5px"
    };

    return btnStyle;
  };

  return responseContainers.map((container, index) => {
    const answers = get(userAnswers, `[${index}].value`, []).join(" ");
    return (
      <div style={{ position: "relative" }}>
        <DropContainer key={container.id} style={getContainerStyle(container)} drop={onDrop} index={index}>
          {container.label && (
            <span className="sr-only" role="heading">
              Drop target {container.label}
            </span>
          )}
          <Container
            fontSize={fontSize}
            index={index}
            height={container.height}
            width={container.width}
            answers={answers}
          >
            {get(userAnswers, `[${index}].value`, []).map((answer, item_index) => (
              <DragItem
                style={dragItemStyle}
                key={item_index}
                data={{ option: answer, fromContainerIndex: index, fromRespIndex: item_index }}
              >
                <AnswerContainer
                  height={container.height || "auto"}
                  width={container.width || "auto"}
                  isWrapText={isWrapText}
                  fontSize={fontSize}
                  answer={answer}
                />
              </DragItem>
            ))}
          </Container>
          <Pointer className={container.pointerPosition} width={container.width}>
            <Point />
            <Triangle />
          </Pointer>
        </DropContainer>
      </div>
    );
  });
};

export default withTheme(ResponseContainers);
