import React from "react";
import PropTypes from "prop-types";
import { clozeImage } from "@edulastic/constants";
import { Pointer } from "../../../../styled/Pointer";
import { Point } from "../../../../styled/Point";
import { Triangle } from "../../../../styled/Triangle";

import { IconWrapper } from "./styled/IconWrapper";
import { StyledTemplateBox } from "./styled/StyledTemplateBox";
import { TemplateCover } from "./styled/TemplateCover";
import { RightIcon } from "./styled/RightIcon";
import { WrongIcon } from "./styled/WrongIcon";
// import { calculateRatio } from "../../../../utils/helpers";
import { StyledPreviewImage } from "../../styled/StyledPreviewImage";

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
  // uiStyle,
  // imagescale,
  evaluation,
  maxHeight,
  minWidth,
  minHeight,
  imageOptions,
  canvasHeight,
  canvasWidth,
  checkAnswer,
  onClickHandler
}) => (
  <StyledTemplateBox fontSize={fontSize}>
    <TemplateCover
      width={canvasWidth > clozeImage.maxWidth ? canvasWidth : clozeImage.maxWidth}
      height={canvasHeight > maxHeight ? canvasHeight : maxHeight}
    >
      <StyledPreviewImage
        imageSrc={imageUrl || ""}
        width={imageWidth}
        height={imageHeight}
        heighcanvasDimensionst={imageHeight}
        alt={imageAlterText}
        style={{
          position: "absolute",
          top: imageOptions.y || 0,
          left: imageOptions.x || 0
        }}
      />
      {responseContainers.map((responseContainer, index) => {
        const dropTargetIndex = index;
        const btnStyle = {
          width: `${parseInt(responseContainer.width, 10)}px`,
          top: responseContainer.top,
          left: responseContainer.left,
          height: `${parseInt(responseContainer.height, 10)}px`,
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
        let status = "";
        if (userSelections[dropTargetIndex]) {
          status = evaluation[dropTargetIndex] ? "right" : "wrong";
        }
        return (
          <React.Fragment key={index}>
            {!showAnswer && !checkAnswer && (
              <div
                style={{
                  ...btnStyle,
                  height: `${parseInt(responseContainer.height, 10)}px`,
                  width: `${parseInt(responseContainer.width, 10)}px`,
                  minWidth,
                  minHeight
                }}
                className={`
                imagelabeldragdrop-droppable 
                active 
                check-answer
                ${status}`}
                onClick={onClickHandler}
              >
                <div className="text container">{userSelections[dropTargetIndex]}</div>
                <IconWrapper>
                  {status === "right" && <RightIcon />}
                  {status === "wrong" && <WrongIcon />}
                </IconWrapper>
                <Pointer className={responseContainer.pointerPosition} width={responseContainer.width}>
                  <Point />
                  <Triangle />
                </Pointer>
              </div>
            )}
            {(showAnswer || checkAnswer) && (
              <div
                style={{
                  ...btnStyle,
                  height: `${parseInt(responseContainer.height, 10)}px`,
                  width: `${parseInt(responseContainer.width, 10)}px`,
                  minWidth,
                  minHeight
                }}
                className={`
                imagelabeldragdrop-droppable 
                active
                ${userSelections.length > 0 ? "check-answer" : "noAnswer"} 
                ${status} 
                show-answer`}
                onClick={onClickHandler}
              >
                <span className="index index-box">{indexStr}</span>
                <div className="text container">{userSelections[dropTargetIndex]}</div>
                <IconWrapper>
                  {userSelections.length > 0 && status === "right" && <RightIcon />}
                  {userSelections.length > 0 && status === "wrong" && <WrongIcon />}
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
  // uiStyle: PropTypes.any,
  // imagescale: PropTypes.bool,
  showAnswer: PropTypes.bool.isRequired,
  checkAnswer: PropTypes.bool.isRequired,
  imageUrl: PropTypes.string.isRequired,
  imageAlterText: PropTypes.string.isRequired,
  imageHeight: PropTypes.number.isRequired,
  imageWidth: PropTypes.number.isRequired,
  maxHeight: PropTypes.number.isRequired,
  minWidth: PropTypes.number.isRequired,
  minHeight: PropTypes.number.isRequired,
  imageOptions: PropTypes.object,
  canvasWidth: PropTypes.number.isRequired,
  canvasHeight: PropTypes.number.isRequired,
  onClickHandler: PropTypes.func.isRequired
};

CheckboxTemplateBoxLayout.defaultProps = {
  // uiStyle: {
  //   fontsize: "normal"
  // },
  // imagescale: false
  imageOptions: {}
};

export default React.memo(CheckboxTemplateBoxLayout);
