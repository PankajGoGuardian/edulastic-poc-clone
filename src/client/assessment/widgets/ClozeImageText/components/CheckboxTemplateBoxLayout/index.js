/* eslint-disable react/prop-types */
import React from "react";
import PropTypes from "prop-types";

import { helpers } from "@edulastic/common";

import { response } from "@edulastic/constants";

import { withTheme } from "styled-components";
import { compose } from "redux";
import { StyledPreviewImage } from "../../styled/StyledPreviewImage";
import { StyledPreviewTemplateBox } from "../../styled/StyledPreviewTemplateBox";
import { StyledPreviewContainer } from "../../styled/StyledPreviewContainer";

import Response from "./components/Response";

const CheckboxTemplateBoxLayout = ({
  showAnswer,
  checkAnswer,
  responseContainers,
  imageAlterText,
  userSelections,
  stemNumeration,
  evaluation,
  fontSize,
  imageUrl,
  imageOptions,
  imageWidth,
  imageHeight,
  canvasHeight,
  canvasWidth,
  backgroundColor,
  onClickHandler,
  isExpressGrader,
  theme: {
    answerBox: { borderWidth, borderStyle, borderColor, borderRadius }
  }
}) => (
  <StyledPreviewTemplateBox fontSize={fontSize} height={canvasHeight}>
    <StyledPreviewContainer data-cy="image-text-preview-board" width={canvasWidth} height={canvasHeight}>
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
          width: responseContainer.width,
          top: responseContainer.top,
          left: responseContainer.left,
          height: responseContainer.height,
          position: "absolute",
          backgroundColor,
          border: `${borderWidth} ${borderStyle} ${borderColor}`,
          borderRadius
        };

        const indexStr = helpers.getNumeration(dropTargetIndex, stemNumeration);
        const status =
          evaluation[dropTargetIndex] !== undefined ? (evaluation[dropTargetIndex] ? "right" : "wrong") : "";
        const lessMinWidth = parseInt(responseContainer.width, 10) < response.minWidthShowAnswer;
        return (
          <Response
            showAnswer={showAnswer}
            responseContainer={responseContainer}
            btnStyle={btnStyle}
            userSelections={userSelections}
            onClickHandler={onClickHandler}
            status={status}
            dropTargetIndex={dropTargetIndex}
            indexStr={indexStr}
            lessMinWidth={lessMinWidth}
            checkAnswer={checkAnswer}
            isExpressGrader={isExpressGrader}
          />
        );
      })}
    </StyledPreviewContainer>
  </StyledPreviewTemplateBox>
);
CheckboxTemplateBoxLayout.propTypes = {
  fontSize: PropTypes.string.isRequired,
  responseContainers: PropTypes.array.isRequired,
  imageOptions: PropTypes.object.isRequired,
  userSelections: PropTypes.array.isRequired,
  stemNumeration: PropTypes.string.isRequired,
  evaluation: PropTypes.array.isRequired,
  showAnswer: PropTypes.bool.isRequired,
  imageUrl: PropTypes.string.isRequired,
  imageAlterText: PropTypes.string.isRequired,
  imageHeight: PropTypes.number.isRequired,
  imageWidth: PropTypes.number.isRequired,
  canvasHeight: PropTypes.number.isRequired,
  canvasWidth: PropTypes.number.isRequired,
  backgroundColor: PropTypes.string.isRequired,
  onClickHandler: PropTypes.func.isRequired,
  isExpressGrader: PropTypes.bool.isRequired
};

const enhance = compose(
  React.memo,
  withTheme
);

export default enhance(CheckboxTemplateBoxLayout);
