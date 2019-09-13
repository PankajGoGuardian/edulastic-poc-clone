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

const CheckboxTemplateBoxLayout = ({
  showAnswer,
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
        if (responsecontainerindividuals && responsecontainerindividuals[dropTargetIndex]) {
          const { width } = responsecontainerindividuals[dropTargetIndex];
          btnStyle.width = width;
        }
        if (btnStyle && btnStyle.width === 0) {
          btnStyle.width = responseBtnStyle.width;
        } else {
          btnStyle.width = btnStyle.width;
        }
        const indexStr = helpers.getNumeration(dropTargetIndex, stemNumeration);
        const status = evaluation[dropTargetIndex] ? "right" : "wrong";
        return (
          <React.Fragment key={index}>
            {!showAnswer && (
              <div
                style={{
                  ...btnStyle,
                  height: `${parseInt(responseContainer.height, 10)}px`,
                  width: `${parseInt(responseContainer.width, 10)}px`,
                  minHeight: `${response.minHeight}px`,
                  minWidth: `${response.minWidth}px`
                }}
                className={`
                    imagelabeldragdrop-droppable 
                    active 
                    check-answer
                    ${evaluation[dropTargetIndex] ? "right" : "wrong"}`}
                onClick={onClickHandler}
              >
                {showAnswer && <span className="index index-box">{indexStr}</span>}
                <div className="text container" title={userSelections[dropTargetIndex]}>
                  <div className="clipText" style={{ maxWidth: `${uiStyle.widthpx}px` }}>
                    {userSelections[dropTargetIndex]}
                  </div>
                </div>
                <IconWrapper rightPosition={20}>
                  {status === "right" && <RightIcon />}
                  {status === "wrong" && <WrongIcon />}
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
                  height: `${parseInt(responseContainer.height, 10)}px`,
                  width: `${parseInt(responseContainer.width, 10)}px`,
                  minHeight: `${response.minHeight}px`,
                  minWidth: `${response.minWidthShowAnswer}px`
                }}
                className={`
                    imagelabeldragdrop-droppable 
                    active 
                    ${userSelections.length > 0 ? "check-answer" : "noAnswer"}
                    ${status} 
                    show-answer`}
                onClick={onClickHandler}
              >
                {showAnswer && <span className="index index-box">{indexStr}</span>}
                <div className="text container">
                  <Tooltip title={userSelections?.[dropTargetIndex]}>
                    <div className="clipText" style={{ minWidth: "100%", maxWidth: `${uiStyle.widthpx}px` }}>
                      {userSelections[dropTargetIndex]}
                    </div>
                  </Tooltip>

                  <div>
                    <IconWrapper rightPosition="0">
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
