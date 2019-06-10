import React from "react";
import PropTypes from "prop-types";

import { Pointer } from "../../../../styled/Pointer";
import { Point } from "../../../../styled/Point";
import { Triangle } from "../../../../styled/Triangle";

import { IconWrapper } from "./styled/IconWrapper";
import { StyledTemplateBox } from "./styled/StyledTemplateBox";
import { TemplateCover } from "./styled/TemplateCover";
import { RightIcon } from "./styled/RightIcon";
import { WrongIcon } from "./styled/WrongIcon";
import { calculateRatio } from "../../../../utils/helpers";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz";

const CheckboxTemplateBoxLayout = ({
  showAnswer,
  responseContainers,
  imageUrl,
  imageWidth,
  imageHeight,
  imageAlterText,
  responsecontainerindividuals,
  responseBtnStyle,
  fontSize,
  userSelections,
  stemnumeration,
  uiStyle,
  imagescale,
  evaluation,
  maxHeight,
  maxWidth,
  minWidth,
  minHeight,
  imageOptions
}) => (
  <StyledTemplateBox fontSize={fontSize} maxHeight={maxHeight} maxWidth={maxWidth} margin={"auto"}>
    <TemplateCover
      width={calculateRatio(imagescale, uiStyle.fontsize, imageWidth)}
      maxHeight={maxHeight}
      maxWidth={maxWidth}
    >
      <img
        src={imageUrl}
        style={{
          height: `${imageOptions.height}px`,
          maxWidth,
          maxHeight,
          width: `${imageOptions.width}px`,
          top: imageOptions.y,
          left: imageOptions.x,
          userSelect: "none",
          pointerEvents: "none"
        }}
        alt={imageAlterText}
      />
      {responseContainers.map((responseContainer, index) => {
        const dropTargetIndex = index;
        const btnStyle = {
          width: `${parseInt(responseContainer.width)}px`,
          top: responseContainer.top,
          left: responseContainer.left,
          height: `${parseInt(responseContainer.height)}px`,
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
              <div
                style={{
                  ...btnStyle,
                  height: `${parseInt(responseContainer.height)}px`,
                  width: `${parseInt(responseContainer.width)}px`,
                  minWidth,
                  minHeight
                }}
                className={`
                imagelabeldragdrop-droppable 
                active 
                ${userSelections.length > 0 && userSelections[dropTargetIndex] ? "check-answer" : "noAnswer"} 
                ${status}`}
              >
                <div className="text container">{userSelections[dropTargetIndex]}</div>
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
            {showAnswer && (
              <div
                style={{
                  ...btnStyle,
                  height: `${parseInt(responseContainer.height)}px`,
                  width: `${parseInt(responseContainer.width)}px`,
                  minWidth,
                  minHeight
                }}
                className={`
                imagelabeldragdrop-droppable 
                active
                ${userSelections.length > 0 && userSelections[dropTargetIndex] ? "check-answer" : "noAnswer"} 
                ${status} 
                show-answer`}
              >
                <span className="index index-box">{indexStr}</span>
                <div className="text container">{userSelections[dropTargetIndex]}</div>
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
  uiStyle: PropTypes.any,
  imagescale: PropTypes.bool,
  showAnswer: PropTypes.bool.isRequired,
  imageUrl: PropTypes.string.isRequired,
  imageAlterText: PropTypes.string.isRequired,
  imageWidth: PropTypes.number.isRequired
};

CheckboxTemplateBoxLayout.defaultProps = {
  uiStyle: {
    fontsize: "normal"
  },
  imagescale: false
};

export default React.memo(CheckboxTemplateBoxLayout);
