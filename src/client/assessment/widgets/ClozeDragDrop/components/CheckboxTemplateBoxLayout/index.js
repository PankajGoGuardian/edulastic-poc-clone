import React from "react";
import PropTypes from "prop-types";
import striptags from "striptags";
import { MathSpan } from "@edulastic/common";
import Draggable from "../Draggable";
import Droppable from "../Droppable";
import { IconWrapper } from "./styled/IconWrapper";
import { RightIcon } from "./styled/RightIcon";
import { WrongIcon } from "./styled/WrongIcon";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz";

const CheckboxTemplateBoxLayout = ({ index: dropTargetIndex, resprops }) => {
  dropTargetIndex = parseInt(dropTargetIndex, 10);
  const {
    showAnswer,
    options = [],
    hasGroupResponses = false,
    responsecontainerindividuals = [],
    responseBtnStyle = {},
    userSelections = [],
    stemNumeration = "numerical",
    evaluation = [],
    onDropHandler = () => {}
  } = resprops;

  const status =
    userSelections.length > 0 && evaluation.length > 0 ? (evaluation[dropTargetIndex] ? "right" : "wrong") : null;

  const choiceAttempted = userSelections.length > 0 ? !!userSelections[dropTargetIndex] : null;
  // eslint-disable-next-line no-unused-vars
  let indexStr;
  switch (stemNumeration) {
    case "lowercase": {
      indexStr = ALPHABET[dropTargetIndex];
      break;
    }
    case "uppercase": {
      indexStr = ALPHABET[dropTargetIndex].toUpperCase();
      break;
    }
    case "numerical": {
      indexStr = dropTargetIndex + 1;
      break;
    }
    default:
  }

  let btnStyle = responsecontainerindividuals && responsecontainerindividuals[dropTargetIndex];
  if (btnStyle === undefined) {
    btnStyle = responseBtnStyle;
  }
  if (btnStyle && btnStyle.widthpx === 0) {
    btnStyle.widthpx = responseBtnStyle.widthpx;
  }
  if (btnStyle && btnStyle.heightpx === 0) {
    btnStyle.heightpx = responseBtnStyle.heightpx;
  }
  if (btnStyle && btnStyle.wordwrap === undefined && responseBtnStyle.wordwrap) {
    btnStyle.wordwrap = responseBtnStyle.wordwrap;
  }

  const getLabel = () => {
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
    return (
      <MathSpan
        clas="clipText"
        title={striptags(formulaLabel) || null}
        dangerouslySetInnerHTML={{ __html: formulaLabel }}
      />
    );
  };

  return (
    <div>
      {showAnswer && hasGroupResponses && (
        <div
          className={`
            response-btn 
            ${choiceAttempted ? "check-answer" : ""}
            ${status} 
            ${showAnswer ? "show-answer" : ""}`}
          style={btnStyle}
        >
          <span className="index">{dropTargetIndex + 1}</span>
          <span className="text">{getLabel(dropTargetIndex)}</span>

          <IconWrapper>
            {choiceAttempted && status === "right" && <RightIcon />}
            {choiceAttempted && status === "wrong" && <WrongIcon />}
          </IconWrapper>
        </div>
      )}
      {showAnswer && !hasGroupResponses && (
        <div
          className={`
            response-btn 
            ${choiceAttempted ? "check-answer" : ""} 
            ${status} 
            ${showAnswer ? "show-answer" : ""}`}
          style={btnStyle}
        >
          <span className="index">{dropTargetIndex + 1}</span>
          <span className="text">{getLabel(dropTargetIndex)}</span>

          <IconWrapper>
            {choiceAttempted && status === "right" && <RightIcon />}
            {choiceAttempted && status === "wrong" && <WrongIcon />}
          </IconWrapper>
        </div>
      )}
      <Droppable drop={() => ({ dropTargetIndex })}>
        {!showAnswer && hasGroupResponses && (
          <Draggable
            onDrop={onDropHandler}
            data={`${getLabel(dropTargetIndex)}_${userSelections[dropTargetIndex] &&
              userSelections[dropTargetIndex].group}_${dropTargetIndex}_fromResp`}
          >
            <div
              className={`
              response-btn 
              ${choiceAttempted ? "check-answer" : ""} 
              ${status}`}
              style={btnStyle}
            >
              <span className="index">{dropTargetIndex + 1}</span>
              <span className="text">{getLabel(dropTargetIndex)}</span>

              <IconWrapper>
                {choiceAttempted && status === "right" && <RightIcon />}
                {choiceAttempted && status === "wrong" && <WrongIcon />}
              </IconWrapper>
            </div>
          </Draggable>
        )}
        {!showAnswer && !hasGroupResponses && (
          <Draggable onDrop={onDropHandler} data={`${getLabel(dropTargetIndex)}_${dropTargetIndex}_fromResp`}>
            <div
              className={`
              response-btn 
              ${choiceAttempted ? "check-answer" : ""}
              ${status}`}
              style={btnStyle}
            >
              <span className="index">{dropTargetIndex + 1}</span>
              <span className="text">{getLabel(dropTargetIndex)}</span>

              <IconWrapper>
                {choiceAttempted && status === "right" && <RightIcon />}
                {choiceAttempted && status === "wrong" && <WrongIcon />}
              </IconWrapper>
            </div>
          </Draggable>
        )}
      </Droppable>
    </div>
  );
};

CheckboxTemplateBoxLayout.propTypes = {
  index: PropTypes.number.isRequired,
  resprops: PropTypes.object.isRequired
};

export default React.memo(CheckboxTemplateBoxLayout);
