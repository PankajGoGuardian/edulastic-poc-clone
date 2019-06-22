import React from "react";
import PropTypes from "prop-types";
import { withTheme } from "styled-components";

import { MathSpan } from "@edulastic/common";

import striptags from "striptags";
import { response, clozeImage } from "@edulastic/constants";
import DropContainer from "../DropContainer";
import DragItem from "../DragItem";

import { Pointer } from "../../../../styled/Pointer";
import { Point } from "../../../../styled/Point";
import { Triangle } from "../../../../styled/Triangle";

import { IconWrapper } from "./styled/IconWrapper";
import { RightIcon } from "./styled/RightIcon";
import { WrongIcon } from "./styled/WrongIcon";

import { StyledPreviewTemplateBox } from "../../styled/StyledPreviewTemplateBox";
import { StyledPreviewContainer } from "../../styled/StyledPreviewContainer";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz";

const CheckboxTemplateBoxLayout = ({
  showAnswer,
  responseContainers,
  image,
  canvasHeight,
  canvasWidth,
  responsecontainerindividuals,
  responseBtnStyle,
  fontSize,
  userSelections,
  stemnumeration,
  evaluation,
  drop,
  onDropHandler,
  theme,
  showBorder
}) => {
  const { maxHeight, maxWidth } = clozeImage;

  return (
    <StyledPreviewTemplateBox fontSize={fontSize} height={canvasHeight > maxHeight ? canvasHeight : maxHeight}>
      <StyledPreviewContainer
        width={canvasWidth > maxWidth ? canvasWidth : maxWidth}
        height={canvasHeight > maxHeight ? canvasHeight : maxHeight}
      >
        {image}
        {responseContainers.map((responseContainer, index) => {
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
          if (responsecontainerindividuals && responsecontainerindividuals[dropTargetIndex]) {
            const { widthpx } = responsecontainerindividuals[dropTargetIndex];
            btnStyle.width = widthpx;
            btnStyle.widthpx = widthpx;
          }
          if (btnStyle && btnStyle.width === 0) {
            btnStyle.width = responseBtnStyle.widthpx;
          } else {
            btnStyle.width = btnStyle.widthpx;
          }
          let indexStr = "";
          switch (stemnumeration) {
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

          return (
            <React.Fragment key={index}>
              {!showAnswer && (
                <DropContainer
                  index={index}
                  style={{
                    ...btnStyle,
                    width: responseContainer.width || "max-content",
                    height: responseContainer.height,
                    minWidth: response.minWidth,
                    maxWidth: response.maxWidth
                  }}
                  className={`
                imagelabeldragdrop-droppable
                active
                ${userSelections.length > 0 && userSelections[dropTargetIndex] ? "check-answer" : "noAnswer"}  
                ${status}`}
                  drop={drop}
                >
                  <div className="text container">
                    {userSelections[dropTargetIndex] &&
                      userSelections[dropTargetIndex].map((answer, user_select_index) => {
                        const title = striptags(answer);
                        return (
                          <DragItem
                            key={user_select_index}
                            index={user_select_index}
                            data={`${answer}_${dropTargetIndex}_fromResp`}
                            style={{
                              border: `${
                                showBorder ? `solid 1px ${theme.widgets.clozeImageDragDrop.dragItemBorderColor}` : null
                              }`,
                              margin: 5,
                              padding: 5,
                              display: "inline-block",
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                              width: "max-content",
                              minWidth: response.minWidth,
                              maxWidth: response.maxWidth,
                              overflow: "hidden"
                            }}
                            item={answer}
                            onDrop={onDropHandler}
                          >
                            <div title={title}>
                              <MathSpan
                                dangerouslySetInnerHTML={{
                                  __html: answer.replace("<p>", "<p class='clipText'>") || ""
                                }}
                              />
                            </div>
                          </DragItem>
                        );
                      })}
                  </div>
                  <IconWrapper>
                    {userSelections.length > 0 && userSelections[dropTargetIndex] && status === "right" && (
                      <RightIcon />
                    )}
                    {userSelections.length > 0 && userSelections[dropTargetIndex] && status === "wrong" && (
                      <WrongIcon />
                    )}
                  </IconWrapper>
                  <Pointer className={responseContainer.pointerPosition} width={responseContainer.width}>
                    <Point />
                    <Triangle />
                  </Pointer>
                </DropContainer>
              )}
              {showAnswer && (
                <div
                  style={{
                    ...btnStyle,
                    width: responseContainer.width || "max-content",
                    height: responseContainer.height || "auto",
                    minWidth: response.minWidth,
                    maxWidth: response.maxWidth
                  }}
                  className={`
                  imagelabeldragdrop-droppable 
                  active 
                  ${userSelections.length > 0 && userSelections[dropTargetIndex] ? "check-answer" : "noAnswer"} 
                  ${status} 
                  show-answer`}
                >
                  <div className="text container" style={{ padding: "0px" }}>
                    <div
                      style={{
                        alignSelf: "stretch",
                        height: "auto"
                      }}
                      className="index index-box"
                    >
                      {indexStr}
                    </div>
                    {userSelections[dropTargetIndex] &&
                      userSelections[dropTargetIndex].map((answer, user_select_index) => {
                        const title = striptags(answer) || null;
                        return (
                          <div
                            title={title}
                            key={user_select_index}
                            style={{
                              border: `${
                                showBorder ? `solid 1px ${theme.widgets.clozeImageDragDrop.dragItemBorderColor}` : null
                              }`,
                              margin: 5,
                              padding: 5,
                              display: "inline-block",
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                              width: "max-content",
                              minWidth: response.minWidth,
                              maxWidth: response.maxWidth,
                              overflow: "hidden"
                            }}
                          >
                            <MathSpan
                              dangerouslySetInnerHTML={{
                                __html: answer.replace("<p>", "<p class='clipText'>") || ""
                              }}
                            />
                          </div>
                        );
                      })}
                    <IconWrapper>
                      {userSelections.length > 0 && userSelections[dropTargetIndex] && status === "right" && (
                        <RightIcon />
                      )}
                      {userSelections.length > 0 && userSelections[dropTargetIndex] && status === "wrong" && (
                        <WrongIcon />
                      )}
                    </IconWrapper>
                  </div>

                  <Pointer className={responseContainer.pointerPosition} width={responseContainer.width}>
                    <Point />
                    <Triangle />
                  </Pointer>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </StyledPreviewContainer>
    </StyledPreviewTemplateBox>
  );
};

CheckboxTemplateBoxLayout.propTypes = {
  responsecontainerindividuals: PropTypes.array.isRequired,
  fontSize: PropTypes.string.isRequired,
  responseContainers: PropTypes.array.isRequired,
  responseBtnStyle: PropTypes.object.isRequired,
  userSelections: PropTypes.array.isRequired,
  stemnumeration: PropTypes.string.isRequired,
  evaluation: PropTypes.array.isRequired,
  showAnswer: PropTypes.bool.isRequired,
  onDropHandler: PropTypes.func.isRequired,
  image: PropTypes.any.isRequired,
  drop: PropTypes.func.isRequired,
  canvasWidth: PropTypes.number.isRequired,
  canvasHeight: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired,
  showBorder: PropTypes.bool.isRequired
};

export default withTheme(React.memo(CheckboxTemplateBoxLayout));
