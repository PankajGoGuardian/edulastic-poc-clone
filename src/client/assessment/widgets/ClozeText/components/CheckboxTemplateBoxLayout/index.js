import React, { Fragment } from "react";
import PropTypes from "prop-types";

import { IconWrapper } from "./styled/IconWrapper";
import { RightIcon } from "./styled/RightIcon";
import { WrongIcon } from "./styled/WrongIcon";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz";

const CheckboxTemplateBoxLayout = ({ resprops, index: dropTargetIndex }) => {
  dropTargetIndex = parseInt(dropTargetIndex, 10);
  const {
    evaluation,
    showAnswer,
    uiStyle = {},
    responseBtnStyle,
    fontSize,
    userSelections,
    stemNumeration,
    showIndex,
    responsecontainerindividuals
  } = resprops;

  const status = evaluation[dropTargetIndex] ? "right" : "wrong";

  // eslint-disable-next-line no-unused-vars
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
    case "numerical": {
      indexStr = dropTargetIndex + 1;
      break;
    }
    default:
  }

  const btnStyle = {
    width: showAnswer ? "auto" : 140,
    height: 0,
    widthpx: showAnswer ? "auto" : 140,
    heightpx: 0,
    position: "relative"
  };
  if (responsecontainerindividuals && responsecontainerindividuals[dropTargetIndex]) {
    const { widthpx: widthpx1, heightpx: heightpx1 } = responsecontainerindividuals[dropTargetIndex];
    btnStyle.width = widthpx1;
    btnStyle.height = heightpx1;
    btnStyle.widthpx = widthpx1;
    btnStyle.heightpx = heightpx1;
  }
  if (btnStyle && btnStyle.width === 0 && !showAnswer) {
    btnStyle.width = responseBtnStyle.widthpx;
  } else {
    btnStyle.width = btnStyle.widthpx;
  }
  if (btnStyle && btnStyle.height === 0) {
    btnStyle.height = responseBtnStyle.heightpx;
  } else {
    btnStyle.height = btnStyle.heightpx;
  }
  if (uiStyle.widthpx) {
    btnStyle.width = uiStyle.widthpx;
  }

  return (
    <span className="template_box dropdown" style={{ fontSize, padding: 20, overflow: "hidden" }}>
      {showAnswer && (
        <span
          className={`
                    response-btn 
                    ${userSelections.length > 0 && userSelections[dropTargetIndex] ? "check-answer" : ""} 
                    ${status}
                    ${showAnswer ? "show-answer" : ""}`}
          style={btnStyle}
        >
          <span className="index">{dropTargetIndex + 1}</span>
          <span
            className="text"
            style={{
              width: "100%",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden"
            }}
          >
            {userSelections[dropTargetIndex] && userSelections[dropTargetIndex]}
          </span>
          <IconWrapper>
            {userSelections.length > 0 && userSelections[dropTargetIndex] && status === "right" && <RightIcon />}
            {userSelections.length > 0 && userSelections[dropTargetIndex] && status === "wrong" && <WrongIcon />}
          </IconWrapper>
        </span>
      )}
      {!showAnswer && (
        <span
          className={`response-btn 
                ${userSelections.length > 0 && userSelections[dropTargetIndex] ? "check-answer" : ""} 
                ${status}
                `}
          style={{
            ...btnStyle,
            overflow: "hidden"
          }}
        >
          {showIndex && (
            <Fragment>
              <span className="index">{dropTargetIndex + 1}</span>
            </Fragment>
          )}
          <span
            style={{
              width: "100%",
              display: "block",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
              lineHeight: 2.5
            }}
            className="text"
          >
            {userSelections[dropTargetIndex] && userSelections[dropTargetIndex]}
          </span>
          <IconWrapper>
            {userSelections.length > 0 && userSelections[dropTargetIndex] && status === "right" && <RightIcon />}
            {userSelections.length > 0 && userSelections[dropTargetIndex] && status === "wrong" && <WrongIcon />}
          </IconWrapper>
        </span>
      )}
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
