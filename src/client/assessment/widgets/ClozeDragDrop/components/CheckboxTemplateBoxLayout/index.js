import React, { useState } from "react";
import PropTypes from "prop-types";
import { MathSpan } from "@edulastic/common";
import { Tooltip } from "antd";
import { response as dimensions } from "@edulastic/constants";
import Draggable from "../Draggable";
import Droppable from "../Droppable";
import { getStemNumeration } from "../../../../utils/helpers";
import { CheckboxContainer } from "./styled/CheckboxContainer";
import { CheckBoxTemplateBox } from "./styled/CheckBoxTemplateBox";
import { IconWrapper } from "./styled/IconWrapper";
import { RightIcon } from "./styled/RightIcon";
import { WrongIcon } from "./styled/WrongIcon";

const CheckboxTemplateBoxLayout = ({ resprops, id }) => {
  const {
    showAnswer,
    options = [],
    hasGroupResponses = false,
    responsecontainerindividuals = [],
    responseBtnStyle = {},
    userSelections = [],
    stemNumeration = "numerical",
    evaluation = [],
    onDropHandler = () => {},
    responseIDs,
    globalSettings
  } = resprops;
  const { index: dropTargetIndex } = (responseIDs && responseIDs.find(response => response.id === id)) || {};
  const status =
    userSelections.length > 0 && evaluation.length > 0 ? (evaluation[dropTargetIndex] ? "right" : "wrong") : null;

  const choiceAttempted = userSelections.length > 0 ? !!userSelections[dropTargetIndex] : null;

  const indexStr = getStemNumeration(stemNumeration, dropTargetIndex);

  const btnStyle = { ...responseBtnStyle };
  const response = responsecontainerindividuals.find(resp => resp.id === id) || {};
  const heightpx = response && response.heightpx;
  const widthpx = response && response.widthpx;
  btnStyle.width = !globalSettings
    ? widthpx
      ? `${widthpx}px`
      : `${btnStyle.widthpx}px` || "auto"
    : `${btnStyle.widthpx}px` || "auto";
  btnStyle.height = !globalSettings
    ? heightpx
      ? `${heightpx}px`
      : `${btnStyle.heightpx}px` || "auto"
    : `${btnStyle.heightpx}px` || "auto";

  if (globalSettings) {
    btnStyle.maxWidth = "400px";
  }

  const lessMinWidth = parseInt(btnStyle.width, 10) < dimensions.minWidthShowAnswer;
  const [showIndex, toggleIndexVisibility] = useState(!lessMinWidth);

  const indexStyle = {};
  if (lessMinWidth) {
    btnStyle.minWidth = "unset";
    indexStyle.width = "10px";
    indexStyle.minWidth = "unset";
  }

  const getFormulaLabel = () => {
    let formulaLabel = "";
    if (!hasGroupResponses && userSelections[dropTargetIndex]) {
      const foundedItem = options.find(option => option.value === userSelections[dropTargetIndex]);
      if (foundedItem) {
        formulaLabel = foundedItem.label;
      }
    } else if (userSelections[dropTargetIndex] && userSelections[dropTargetIndex].data) {
      const foundedGroup = options.find(option =>
        option.options.find(inOption => inOption.value === userSelections[dropTargetIndex].data)
      );
      if (foundedGroup) {
        const foundItem = foundedGroup.options.find(
          inOption => inOption.value === userSelections[dropTargetIndex].data
        );
        if (foundItem) {
          formulaLabel = foundItem.label;
        }
      }
    }
    return formulaLabel;
  };

  const getLabel = () => {
    return (
      <CheckboxContainer width={btnStyle.width}>
        <MathSpan className="clipText" dangerouslySetInnerHTML={{ __html: getFormulaLabel() }} />
      </CheckboxContainer>
    );
  };

  const handleHover = () => {
    if (showAnswer && lessMinWidth) {
      toggleIndexVisibility(!showIndex);
    }
  };
  return (
    <CheckBoxTemplateBox>
      {hasGroupResponses && (
        <Droppable drop={() => ({ dropTargetIndex })}>
          <Draggable
            onDrop={onDropHandler}
            data={`${getLabel(dropTargetIndex)}_${userSelections[dropTargetIndex] &&
              userSelections[dropTargetIndex].group}_${dropTargetIndex}_fromResp`}
          >
            <div
              className={`
            response-btn 
            ${choiceAttempted ? "check-answer" : ""}
            ${status} 
            ${showAnswer ? "show-answer" : ""}`}
              style={btnStyle}
              onMouseEnter={handleHover}
              onMouseLeave={handleHover}
            >
              <Tooltip overlayClassName="customTooltip" title={getLabel(dropTargetIndex)}>
                {showAnswer && (
                  <span style={indexStyle} className="index">
                    {indexStr}
                  </span>
                )}

                <span
                  style={{
                    padding: lessMinWidth ? "8px 0px" : null,
                    maxWidth: showAnswer && lessMinWidth ? "50%" : null
                  }}
                  className="text"
                >
                  {getLabel(dropTargetIndex)}
                </span>
              </Tooltip>

              <IconWrapper rightPosition={lessMinWidth ? "0" : "8"}>
                {choiceAttempted && status === "right" && <RightIcon />}
                {choiceAttempted && status === "wrong" && <WrongIcon />}
              </IconWrapper>
            </div>
          </Draggable>
        </Droppable>
      )}
      {!hasGroupResponses && (
        <Droppable drop={() => ({ dropTargetIndex })}>
          <Draggable
            onDrop={onDropHandler}
            data={`${getLabel(dropTargetIndex)}_${userSelections[dropTargetIndex] &&
              userSelections[dropTargetIndex].group}_${dropTargetIndex}_fromResp`}
          >
            <div
              className={`
            response-btn 
            ${choiceAttempted ? "check-answer" : ""} 
            ${status} 
            ${showAnswer ? "show-answer" : ""}`}
              style={btnStyle}
              onMouseEnter={handleHover}
              onMouseLeave={handleHover}
            >
              {showAnswer && showIndex && (
                <span style={indexStyle} className="index">
                  {indexStr}
                </span>
              )}
              <Tooltip overlayClassName="customTooltip" title={getLabel(dropTargetIndex)}>
                <span
                  className="text"
                  style={{
                    padding: lessMinWidth ? "8px 0px" : null
                  }}
                >
                  {getLabel(dropTargetIndex)}
                </span>
              </Tooltip>
              {(!showAnswer || (showAnswer && showIndex)) && (
                <IconWrapper rightPosition={lessMinWidth ? "0" : "8"}>
                  {choiceAttempted && status === "right" && <RightIcon />}
                  {choiceAttempted && status === "wrong" && <WrongIcon />}
                </IconWrapper>
              )}
            </div>
          </Draggable>
        </Droppable>
      )}
    </CheckBoxTemplateBox>
  );
};

CheckboxTemplateBoxLayout.propTypes = {
  resprops: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired
};

export default React.memo(CheckboxTemplateBoxLayout);
