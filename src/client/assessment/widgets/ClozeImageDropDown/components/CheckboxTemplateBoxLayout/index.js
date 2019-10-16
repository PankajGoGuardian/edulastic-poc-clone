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
import Response from "./components/Response";

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
  onClickHandler,
  isExpressGrader
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
        const lessMinWidth = parseInt(responseContainer.width, 10) < minWidthShowAnswer;
        return (
          <Response
            lessMinWidth={lessMinWidth}
            showAnswer={showAnswer}
            checkAnswer={checkAnswer}
            btnStyle={btnStyle}
            responseContainer={responseContainer}
            userSelections={userSelections}
            status={status}
            onClickHandler={onClickHandler}
            indexStr={indexStr}
            dropTargetIndex={dropTargetIndex}
            isExpressGrader={isExpressGrader}
          />
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
  onClickHandler: PropTypes.func.isRequired,
  isExpressGrader: PropTypes.bool
};

CheckboxTemplateBoxLayout.defaultProps = {
  // uiStyle: {
  //   fontsize: "normal"
  // },
  // imagescale: false
  imageOptions: {},
  isExpressGrader: false
};

export default React.memo(CheckboxTemplateBoxLayout);
