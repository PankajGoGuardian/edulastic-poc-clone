import React from "react";
import PropTypes from "prop-types";
import { Tooltip } from "antd";

import { clozeImage, response } from "@edulastic/constants";
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
  userSelections = [],
  stemNumeration,
  // uiStyle,
  // imagescale,
  evaluation,
  maxHeight,
  maxWidth,
  minWidth,
  minWidthShowAnswer,
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
          position: "absolute",
          top: responseContainer.top,
          left: responseContainer.left,
          height: responseContainer.height,
          width: responseContainer.width,
          borderRadius: 5
        };
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
        let status = "";
        if (userSelections[dropTargetIndex]) {
          status = evaluation[dropTargetIndex] ? "right" : "wrong";
        }
        const hasAnswered = userSelections?.[dropTargetIndex];

        const lessMinWidth = parseInt(responseContainer.width, 10) < minWidthShowAnswer;
        const indexStyle = {};
        if (lessMinWidth) {
          indexStyle["width"] = "20px";
        }

        return (
          <React.Fragment key={index}>
            {(showAnswer || checkAnswer) && (
              <div
                style={{
                  ...btnStyle,
                  minWidth: lessMinWidth ? responseContainer.width + response.indexSizeSmallBox : minWidthShowAnswer,
                  minHeight,
                  background: !hasAnswered ? "rgba(225,225,225,0.75)" : null
                }}
                className={`
                testing
                imagelabeldragdrop-droppable 
                active
                ${userSelections.length > 0 ? "check-answer" : "noAnswer"} 
                ${status} 
                show-answer`}
                onClick={onClickHandler}
              >
                {showAnswer && (
                  <span className="index index-box" style={indexStyle}>
                    {indexStr}
                  </span>
                )}
                <div
                  className="text container"
                  style={{ minwidth: "100%", maxWidth, padding: lessMinWidth ? "0 0 0 4px" : null }}
                >
                  <Tooltip title={userSelections?.[dropTargetIndex]}>
                    <div className="clipText" style={{ minwidth: "100%" }}>
                      {userSelections[dropTargetIndex]}
                    </div>
                  </Tooltip>
                  <div>
                    <IconWrapper>
                      {userSelections.length > 0 && status === "right" && <RightIcon />}
                      {userSelections.length > 0 && status === "wrong" && <WrongIcon />}
                    </IconWrapper>
                    <Pointer className={responseContainer.pointerPosition} width={responseContainer.width}>
                      <Point />
                      <Triangle />
                    </Pointer>
                  </div>
                </div>
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
  stemNumeration: PropTypes.string.isRequired,
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
