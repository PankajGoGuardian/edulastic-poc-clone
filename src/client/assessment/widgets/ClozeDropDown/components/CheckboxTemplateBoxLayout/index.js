import React from "react";
import PropTypes from "prop-types";
import { isUndefined } from "lodash";

import { IconWrapper } from "./styled/IconWrapper";
import { RightIcon } from "./styled/RightIcon";
import { WrongIcon } from "./styled/WrongIcon";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz";

const CheckboxTemplateBoxLayout = ({ resprops, index: dropTargetIndex }) => {
  const {
    showIndex,
    responsecontainerindividuals,
    responseBtnStyle,
    stemNumeration,
    fontSize,
    showAnswer,
    userSelections,
    evaluation,
    hasGroupResponses = false
  } = resprops;
  // eslint-disable-next-line no-unused-vars
  let indexStr;
  console.log(showIndex);
  const status =
    userSelections.length > 0 && evaluation.length > 0 ? (evaluation[dropTargetIndex] ? "right" : "wrong") : "wrong";
  const choiceAttempted = userSelections.length > 0 ? !!userSelections[dropTargetIndex] : null;
  let btnStyle = responsecontainerindividuals && responsecontainerindividuals[dropTargetIndex];

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

  if (btnStyle === undefined) {
    btnStyle = responseBtnStyle;
  }
  if (btnStyle && btnStyle.widthpx === 0) {
    btnStyle.widthpx = responseBtnStyle.widthpx;
  }
  if (btnStyle && btnStyle.heightpx === 0) {
    btnStyle.heightpx = responseBtnStyle.heightpx;
  }
  if (btnStyle && isUndefined(btnStyle.wordwrap) && !isUndefined(responseBtnStyle.wordwrap)) {
    btnStyle.wordwrap = responseBtnStyle.wordwrap;
  }

  return (
    <span className="template_box" style={{ fontSize, padding: 20 }}>
      {showAnswer && hasGroupResponses && (
        <span
          className={`
            response-btn 
            ${choiceAttempted ? "check-answer" : ""} 
            ${status} 
            ${showAnswer ? "show-answer" : ""}`}
          style={{
            ...btnStyle,
            minWidth: `${btnStyle.widthpx}px`
          }}
        >
          <span className="index">{dropTargetIndex + 1}</span>
          <span className="text">{userSelections[dropTargetIndex] && userSelections[dropTargetIndex].data}</span>

          <IconWrapper>
            {choiceAttempted && status === "right" && <RightIcon />}
            {choiceAttempted && status === "wrong" && <WrongIcon />}
          </IconWrapper>
        </span>
      )}
      {showAnswer && !hasGroupResponses && (
        <span
          className={`
            response-btn 
            ${choiceAttempted ? "check-answer" : ""} 
            ${status} 
            ${showAnswer ? "show-answer" : ""}`}
          style={{
            ...btnStyle,
            minWidth: `${btnStyle.widthpx}px`
          }}
        >
          <span className="index">{dropTargetIndex + 1}</span>
          <span className="text">{userSelections[dropTargetIndex] && userSelections[dropTargetIndex]}</span>

          <IconWrapper>
            {choiceAttempted && status === "right" && <RightIcon />}
            {choiceAttempted && status === "wrong" && <WrongIcon />}
          </IconWrapper>
        </span>
      )}
      <span
        style={{
          top: -5,
          display: "inline-flex"
        }}
      >
        {!showAnswer && hasGroupResponses && (
          <span
            className={`
                response-btn 
                ${choiceAttempted ? "check-answer" : ""} 
                ${status}`}
            style={{
              ...btnStyle,
              minWidth: `${btnStyle.widthpx}px`
            }}
          >
            {showIndex && <span className="index">{dropTargetIndex + 1}</span>}
            <span className="text">{userSelections[dropTargetIndex] && userSelections[dropTargetIndex].data}</span>

            <IconWrapper>
              {choiceAttempted && status === "right" && <RightIcon />}
              {choiceAttempted && status === "wrong" && <WrongIcon />}
            </IconWrapper>
          </span>
        )}
        {!showAnswer && !hasGroupResponses && (
          <span
            className={`
                response-btn 
                ${choiceAttempted ? "check-answer" : ""} 
                ${status}`}
            style={{
              ...btnStyle,
              minWidth: `${btnStyle.widthpx}px`
            }}
          >
            {showIndex && <span className="index">{dropTargetIndex + 1}</span>}
            <span className="text">{userSelections[dropTargetIndex] && userSelections[dropTargetIndex]}</span>

            <IconWrapper>
              {choiceAttempted && status === "right" && <RightIcon />}
              {choiceAttempted && status === "wrong" && <WrongIcon />}
            </IconWrapper>
          </span>
        )}
      </span>
    </span>
  );
};

CheckboxTemplateBoxLayout.propTypes = {
  resprops: PropTypes.object,
  index: PropTypes.number.isRequired
};

CheckboxTemplateBoxLayout.defaultProps = {
  resprops: {}
};

export default React.memo(CheckboxTemplateBoxLayout);
