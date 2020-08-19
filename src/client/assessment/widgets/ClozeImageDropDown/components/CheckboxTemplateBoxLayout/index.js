/* eslint-disable react/prop-types */
import React from "react";
import PropTypes from "prop-types";
import { smallDesktopWidth } from "@edulastic/colors";

import { withTheme } from "styled-components";
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
  userSelections = {},
  stemNumeration,
  evaluation,
  maxHeight,
  minWidthShowAnswer,
  imageOptions,
  canvasHeight,
  checkAnswer,
  onClickHandler,
  isExpressGrader,
  item,
  isPrintPreview
}) => {
  const widthGreaterThanWindowWidth = window.innerWidth > parseInt(smallDesktopWidth.replace("px", ""), 10);
  return (
    <StyledTemplateBox fontSize={fontSize}>
      <TemplateCover height={isPrintPreview ? "" : canvasHeight > maxHeight ? canvasHeight : maxHeight}>
        {isPrintPreview ? (
          <img
            src={imageUrl}
            alt={imageAlterText}
            style={{
              width: "100%"
            }}
          />
        ) : (
          <StyledPreviewImage
            imageSrc={imageUrl || ""}
            width={widthGreaterThanWindowWidth ? imageWidth : ""}
            height={imageHeight}
            heighcanvasDimensionst={imageHeight}
            alt={imageAlterText}
            style={{
              position: "absolute",
              top: widthGreaterThanWindowWidth ? imageOptions.y || 0 : 0,
              left: widthGreaterThanWindowWidth ? imageOptions.x || 0 : 0
            }}
          />
        )}
        {responseContainers.map((responseContainer, index) => {
          const dropTargetIndex = index;
          const responseId = responseContainer.id;
          const top = widthGreaterThanWindowWidth ? responseContainer.top : responseContainer.top - imageOptions.y;
          const left = widthGreaterThanWindowWidth ? responseContainer.left : responseContainer.left - imageOptions.x;
          const btnStyle = {
            position: "absolute",
            top: isPrintPreview ? `${(top / imageHeight) * 100}%` : top,
            left: isPrintPreview ? `${(left / imageWidth) * 100}%` : left,
            height: responseContainer.height,
            width: responseContainer.width
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
          const userAnswer = userSelections[responseId];
          if (userAnswer && evaluation[responseId] !== undefined) {
            status = evaluation[responseId] ? "right" : "wrong";
          }
          const lessMinWidth = parseInt(responseContainer.width, 10) < minWidthShowAnswer;
          return (
            <Response
              lessMinWidth={lessMinWidth}
              showAnswer={showAnswer}
              checkAnswer={checkAnswer}
              btnStyle={btnStyle}
              responseContainer={responseContainer}
              answered={userAnswer}
              status={status}
              onClickHandler={onClickHandler}
              indexStr={indexStr}
              isExpressGrader={isExpressGrader}
              item={item}
              isPrintPreview={isPrintPreview}
              imageWidth={imageWidth}
              imageHeight={imageHeight}
            />
          );
        })}
      </TemplateCover>
    </StyledTemplateBox>
  );
};

CheckboxTemplateBoxLayout.propTypes = {
  fontSize: PropTypes.string.isRequired,
  responseContainers: PropTypes.array.isRequired,
  userSelections: PropTypes.object.isRequired,
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
  canvasHeight: PropTypes.number.isRequired,
  onClickHandler: PropTypes.func.isRequired,
  isExpressGrader: PropTypes.bool
};

CheckboxTemplateBoxLayout.defaultProps = {
  imageOptions: {},
  isExpressGrader: false
};

export default withTheme(React.memo(CheckboxTemplateBoxLayout));
