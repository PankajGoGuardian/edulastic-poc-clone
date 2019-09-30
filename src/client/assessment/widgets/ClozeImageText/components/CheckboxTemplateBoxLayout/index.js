import React from "react";
import PropTypes from "prop-types";
import { Tooltip } from "antd";

import { helpers } from "@edulastic/common";

import { response } from "@edulastic/constants";
import { Pointer } from "../../../../styled/Pointer";
import { Point } from "../../../../styled/Point";
import { Triangle } from "../../../../styled/Triangle";

import { IconWrapper } from "./styled/IconWrapper";
import { RightIcon } from "./styled/RightIcon";
import { WrongIcon } from "./styled/WrongIcon";
import { StyledPreviewImage } from "../../styled/StyledPreviewImage";
import { StyledPreviewTemplateBox } from "../../styled/StyledPreviewTemplateBox";
import { StyledPreviewContainer } from "../../styled/StyledPreviewContainer";

import Response from "./components/Response";

const CheckboxTemplateBoxLayout = ({
  showAnswer,
  checkAnswer,
  responseContainers,
  imageAlterText,
  responseBtnStyle,
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
  uiStyle,
  responsecontainerindividuals,
  onClickHandler
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
          borderRadius: 5
        };

        const indexStr = helpers.getNumeration(dropTargetIndex, stemNumeration);
        const status = evaluation[dropTargetIndex] ? "right" : "wrong";
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
          />
        );
      })}
    </StyledPreviewContainer>
  </StyledPreviewTemplateBox>
);
CheckboxTemplateBoxLayout.propTypes = {
  responsecontainerindividuals: PropTypes.array.isRequired,
  fontSize: PropTypes.string.isRequired,
  responseContainers: PropTypes.array.isRequired,
  imageOptions: PropTypes.object.isRequired,
  responseBtnStyle: PropTypes.object.isRequired,
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
  uiStyle: PropTypes.object.isRequired
};

export default React.memo(CheckboxTemplateBoxLayout);
