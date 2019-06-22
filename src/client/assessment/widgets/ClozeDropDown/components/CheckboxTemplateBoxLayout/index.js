import React from "react";
import PropTypes from "prop-types";
import { isUndefined, find } from "lodash";

import { IconWrapper } from "./styled/IconWrapper";
import { RightIcon } from "./styled/RightIcon";
import { WrongIcon } from "./styled/WrongIcon";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz";

const CheckboxTemplateBoxLayout = ({ resprops, id }) => {
  if (!id) {
    return null;
  }

  const {
    showIndex,
    responsecontainerindividuals,
    responseBtnStyle,
    stemNumeration,
    fontSize,
    showAnswer,
    userSelections,
    evaluation,
    hasGroupResponses = false,
    item: { response_ids }
  } = resprops;

  const { index, id: answerId } = find(response_ids, response => response.id === id);
  const userSelection = find(userSelections, selection => (selection ? selection.id : "") === id);

  // eslint-disable-next-line no-unused-vars
  let indexStr;
  const status = userSelections && evaluation ? (evaluation[answerId] ? "right" : "wrong") : "wrong";
  const choiceAttempted = userSelections.length > 0 ? !!userSelections[index] : null;
  let btnStyle = responsecontainerindividuals && responsecontainerindividuals[index];

  switch (stemNumeration) {
    case "lowercase": {
      indexStr = ALPHABET[index];
      break;
    }
    case "uppercase": {
      indexStr = ALPHABET[index].toUpperCase();
      break;
    }
    case "numerical": {
      indexStr = index + 1;
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
          <span className="index">{index + 1}</span>
          <span className="text">{userSelection && userSelection.value}</span>

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
          <span className="index">{index + 1}</span>
          <span className="text">{userSelection && userSelection.value}</span>

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
            {showIndex && <span className="index">{index + 1}</span>}
            <span className="text">{userSelection && userSelection.value}</span>

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
            {showIndex && <span className="index">{index + 1}</span>}
            <span className="text">{userSelection && userSelection.value}</span>

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
  id: PropTypes.string.isRequired
};

CheckboxTemplateBoxLayout.defaultProps = {
  resprops: {}
};

export default React.memo(CheckboxTemplateBoxLayout);
