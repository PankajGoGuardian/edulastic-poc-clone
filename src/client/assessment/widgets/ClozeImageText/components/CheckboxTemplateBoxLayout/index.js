import React from "react";
import PropTypes from "prop-types";
import { helpers } from "@edulastic/common";

import { Pointer } from "../../../../styled/Pointer";
import { Point } from "../../../../styled/Point";
import { Triangle } from "../../../../styled/Triangle";

import { IconWrapper } from "./styled/IconWrapper";
import { StyledTemplateBox } from "./styled/StyledTemplateBox";
import { TemplateCover } from "./styled/TemplateCover";
import { RightIcon } from "./styled/RightIcon";
import { WrongIcon } from "./styled/WrongIcon";

import { response, canvasDimensions } from "@edulastic/constants";

const CheckboxTemplateBoxLayout = ({
  showAnswer,
  responseContainers,
  imageUrl,
  imageWidth,
  imageAlterText,
  responsecontainerindividuals,
  responseBtnStyle,
  fontSize,
  userSelections,
  backgroundColor,
  stemnumeration,
  imageOptions,
  evaluation,
  imageHeight,
  uiStyle
}) => (
  <StyledTemplateBox
    fontSize={fontSize}
    height={canvasDimensions.maxHeight}
    width={canvasDimensions.maxWidth}
    maxHeight={canvasDimensions.maxHeight}
    maxWidth={canvasDimensions.maxWidth}
    margin={"0 auto"}
  >
    <TemplateCover
      width={canvasDimensions.maxWidth}
      maxHeight={canvasDimensions.maxHeight}
      maxWidth={canvasDimensions.maxWidth}
      height={canvasDimensions.maxHeight}
    >
      <img
        src={imageUrl}
        style={{
          position: "absolute",
          top: imageOptions.y || 0,
          left: imageOptions.x || 0,
          width: `${imageWidth}px`,
          height: `${imageHeight}px`
        }}
        alt={imageAlterText}
      />
      {responseContainers.map((responseContainer, index) => {
        const dropTargetIndex = index;
        const btnStyle = {
          width: responseContainer.width,
          top: responseContainer.top,
          left: responseContainer.left,
          height: responseContainer.height,
          position: "absolute",
          backgroundColor,
          borderRadius: 5
        };
        if (responsecontainerindividuals && responsecontainerindividuals[dropTargetIndex]) {
          const { width } = responsecontainerindividuals[dropTargetIndex];
          btnStyle.width = width;
        }
        if (btnStyle && btnStyle.width === 0) {
          btnStyle.width = responseBtnStyle.width;
        } else {
          btnStyle.width = btnStyle.width;
        }
        const indexStr = helpers.getNumeration(dropTargetIndex, stemnumeration);
        const status = evaluation[dropTargetIndex] ? "right" : "wrong";
        return (
          <React.Fragment key={index}>
            {!showAnswer && (
              <div
                style={{
                  ...btnStyle,
                  height: `${parseInt(responseContainer.height)}px`,
                  width: `${parseInt(responseContainer.width)}px`,
                  minHeight: `${response.minHeight}px`,
                  minWidth: `${response.minWidth}px`
                }}
                className={`
                  imagelabeldragdrop-droppable 
                  active 
                  ${userSelections.length > 0 && userSelections[dropTargetIndex] ? "check-answer" : "noAnswer"} 
                  ${evaluation[dropTargetIndex] ? "right" : "wrong"}`}
              >
                <div className="text container" title={userSelections[dropTargetIndex]}>
                  <div className="clipText" style={{ maxWidth: `${uiStyle.widthpx}px` }}>
                    {userSelections[dropTargetIndex]}
                  </div>
                </div>
                <IconWrapper rightPosition={20}>
                  {userSelections.length > 0 && userSelections[dropTargetIndex] && status === "right" && <RightIcon />}
                  {userSelections.length > 0 && userSelections[dropTargetIndex] && status === "wrong" && <WrongIcon />}
                </IconWrapper>
                <Pointer className={responseContainer.pointerPosition} width={responseContainer.width}>
                  <Point />
                  <Triangle />
                </Pointer>
              </div>
            )}
            {showAnswer && (
              <div
                style={{
                  ...btnStyle,
                  height: `${parseInt(responseContainer.height)}px`,
                  width: `${parseInt(responseContainer.width)}px`,
                  minHeight: `${response.minHeight}px`,
                  minWidth: `${response.minWidth}px`
                }}
                className={`
                  imagelabeldragdrop-droppable 
                  active 
                  ${userSelections.length > 0 && userSelections[dropTargetIndex] ? "check-answer" : "noAnswer"}
                  ${status} 
                  show-answer`}
              >
                <span className="index index-box">{indexStr}</span>
                <div className="text container" title={userSelections[dropTargetIndex]}>
                  <div className="clipText" style={{ maxWidth: `${uiStyle.widthpx}px` }}>
                    {userSelections[dropTargetIndex]}
                  </div>
                </div>
                <IconWrapper>
                  {userSelections.length > 0 && userSelections[dropTargetIndex] && status === "right" && <RightIcon />}
                  {userSelections.length > 0 && userSelections[dropTargetIndex] && status === "wrong" && <WrongIcon />}
                </IconWrapper>
                <Pointer className={responseContainer.pointerPosition} width={responseContainer.width}>
                  <Point />
                  <Triangle />
                </Pointer>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </TemplateCover>
  </StyledTemplateBox>
);

CheckboxTemplateBoxLayout.propTypes = {
  responsecontainerindividuals: PropTypes.array.isRequired,
  fontSize: PropTypes.string.isRequired,
  responseContainers: PropTypes.array.isRequired,
  responseBtnStyle: PropTypes.object.isRequired,
  userSelections: PropTypes.array.isRequired,
  stemnumeration: PropTypes.string.isRequired,
  evaluation: PropTypes.array.isRequired,
  showAnswer: PropTypes.bool.isRequired,
  imageUrl: PropTypes.string.isRequired,
  imageAlterText: PropTypes.string.isRequired,
  imageWidth: PropTypes.number.isRequired,
  uiStyle: PropTypes.object
};

export default React.memo(CheckboxTemplateBoxLayout);
