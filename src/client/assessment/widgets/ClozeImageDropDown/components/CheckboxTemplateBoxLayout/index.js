/* eslint-disable react/prop-types */
import React from "react";
import PropTypes from "prop-types";

import { clozeImage } from "@edulastic/constants";

import { StyledTemplateBox } from "./styled/StyledTemplateBox";
import { TemplateCover } from "./styled/TemplateCover";
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
  fontSize,
  userSelections = [],
  stemNumeration,

  evaluation,
  maxHeight,
  minWidthShowAnswer,
  imageOptions,
  canvasHeight,
  canvasWidth,
  checkAnswer,
  onClickHandler,
  isExpressGrader,
  item
}) => (
  <StyledTemplateBox fontSize={fontSize}>
    <TemplateCover height={canvasHeight > maxHeight ? canvasHeight : maxHeight}>
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
        if (userSelections[dropTargetIndex] && evaluation[dropTargetIndex] !== undefined) {
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
            item={item}
          />
        );
      })}
    </TemplateCover>
  </StyledTemplateBox>
);

CheckboxTemplateBoxLayout.propTypes = {
  fontSize: PropTypes.string.isRequired,
  responseContainers: PropTypes.array.isRequired,
  userSelections: PropTypes.array.isRequired,
  stemNumeration: PropTypes.string.isRequired,
  evaluation: PropTypes.array.isRequired,
  showAnswer: PropTypes.bool.isRequired,
  checkAnswer: PropTypes.bool.isRequired,
  imageUrl: PropTypes.string.isRequired,
  imageAlterText: PropTypes.string.isRequired,
  imageHeight: PropTypes.number.isRequired,
  imageWidth: PropTypes.number.isRequired,
  maxHeight: PropTypes.number.isRequired,
  imageOptions: PropTypes.object,
  canvasWidth: PropTypes.number.isRequired,
  canvasHeight: PropTypes.number.isRequired,
  onClickHandler: PropTypes.func.isRequired,
  isExpressGrader: PropTypes.bool
};

CheckboxTemplateBoxLayout.defaultProps = {
  imageOptions: {},
  isExpressGrader: false
};

export default React.memo(CheckboxTemplateBoxLayout);
