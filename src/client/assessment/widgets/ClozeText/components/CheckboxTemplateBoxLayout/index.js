import React, { Fragment } from "react";
import { find } from "lodash";
import PropTypes from "prop-types";

import { IconWrapper } from "./styled/IconWrapper";
import { RightIcon } from "./styled/RightIcon";
import { WrongIcon } from "./styled/WrongIcon";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz";

const CheckboxTemplateBoxLayout = ({ resprops, id }) => {
  if (!id) {
    return null;
  }
  const {
    evaluation,
    showAnswer,
    uiStyle = {},
    responseBtnStyle,
    fontSize,
    userSelections,
    stemNumeration,
    showIndex,
    responsecontainerindividuals,
    responseIds
  } = resprops;
  const { id: choiceId, index } = find(responseIds, res => res.id === id);

  const status = evaluation[choiceId] ? "right" : "wrong";
  // eslint-disable-next-line no-unused-vars
  let indexStr = "";

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

  const btnStyle = {
    height: 0,
    widthpx: showAnswer ? "auto" : 140,
    heightpx: 0,
    position: "relative"
  };
  if (responsecontainerindividuals && responsecontainerindividuals[index]) {
    const { widthpx: widthpx1, heightpx: heightpx1 } = responsecontainerindividuals[index];
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

  const response = find(responsecontainerindividuals, resp => resp.index === index);

  btnStyle.width =
    userSelections[index] && userSelections[index].value
      ? (response && response.previewWidth) || uiStyle.widthpx
      : uiStyle.widthpx;

  return (
    <span className="template_box dropdown" style={{ fontSize, padding: 20, overflow: "hidden" }}>
      {showAnswer && (
        <span
          className={`
                    response-btn 
                    ${userSelections.length > 0 && userSelections[index] ? "check-answer" : ""} 
                    ${status}
                    ${showAnswer ? "show-answer" : ""}`}
          style={btnStyle}
          title={userSelections[index] && userSelections[index].value}
        >
          <span className="index">{index + 1}</span>
          <span
            className="text"
            style={{
              width: "100%",
              display: "block",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden"
            }}
          >
            {userSelections[index] && userSelections[index].value}&nbsp;
          </span>
          <IconWrapper>
            {userSelections.length > 0 && userSelections[index] && status === "right" && <RightIcon />}
            {userSelections.length > 0 && userSelections[index] && status === "wrong" && <WrongIcon />}
          </IconWrapper>
        </span>
      )}
      {!showAnswer && (
        <span
          className={`response-btn 
                ${userSelections.length > 0 && userSelections[index] ? "check-answer" : ""} 
                ${status}`}
          style={btnStyle}
          title={userSelections[index] && userSelections[index].value}
        >
          {showIndex && (
            <Fragment>
              <span className="index">{index + 1}</span>
            </Fragment>
          )}
          <span
            style={{
              width: "100%",
              display: "block",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden"
            }}
            className="text"
          >
            {userSelections[index] && userSelections[index].value}&nbsp;
          </span>
          <IconWrapper>
            {userSelections.length > 0 && userSelections[index] && status === "right" && <RightIcon />}
            {userSelections.length > 0 && userSelections[index] && status === "wrong" && <WrongIcon />}
          </IconWrapper>
        </span>
      )}
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
