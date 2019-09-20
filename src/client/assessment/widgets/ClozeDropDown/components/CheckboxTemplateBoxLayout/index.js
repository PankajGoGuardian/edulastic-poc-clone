import React, { Fragment } from "react";
import { Tooltip } from "antd";
import PropTypes from "prop-types";
import { isUndefined, find } from "lodash";
import { getStemNumeration } from "../../../../utils/helpers";
import { IconWrapper } from "./styled/IconWrapper";
import { RightIcon } from "./styled/RightIcon";
import { WrongIcon } from "./styled/WrongIcon";
import { CLEAR } from "../../../../constants/constantsForQuestions";
import { response } from "@edulastic/constants";

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
    changePreviewTab,
    previewTab,
    disableResponse,
    item: { responseIds }
  } = resprops;

  const { index, id: answerId } = find(responseIds, response => response.id === id);
  const userSelection = find(userSelections, selection => (selection ? selection.id : "") === id);

  const indexStr = getStemNumeration(stemNumeration, index);
  const status = userSelections && evaluation ? (evaluation[answerId] ? "right" : "wrong") : "wrong";
  const choiceAttempted = userSelections.length > 0 ? !!userSelections[index] : null;
  let btnStyle = responsecontainerindividuals && responsecontainerindividuals[index];

  const handleClick = () => {
    if (previewTab !== CLEAR && !disableResponse) {
      changePreviewTab(CLEAR);
    }
  };

  if (btnStyle === undefined) {
    btnStyle = responseBtnStyle;
  }
  if (btnStyle && btnStyle.widthpx !== 0) {
    btnStyle.width = responseBtnStyle.widthpx;
  }
  if (btnStyle && btnStyle.heightpx !== 0) {
    btnStyle.height = responseBtnStyle.heightpx;
  }
  if (btnStyle && isUndefined(btnStyle.wordwrap) && !isUndefined(responseBtnStyle.wordwrap)) {
    btnStyle.wordwrap = responseBtnStyle.wordwrap;
  }

  const _btnStyle = { ...btnStyle };
  let isBoxSizeSmall = false;
  if (showAnswer && btnStyle.width < response.minWidthShowAnswer) {
    isBoxSizeSmall = true;
    _btnStyle.minWidth = btnStyle.width + response.indexSizeSmallBox;
  }

  const indexStyle = isBoxSizeSmall ? { width: response.indexSizeSmallBox, padding: "8px", minWidth: "unset" } : {};
  const textStyle = isBoxSizeSmall ? { padding: "8px 0" } : {};
  return (
    <Fragment>
      <span className="template_box" style={{ fontSize, padding: 20 }}>
        {showAnswer && hasGroupResponses && (
          <span
            className={`
            response-btn 
            ${choiceAttempted ? "check-answer" : ""} 
            ${status} 
            ${showAnswer ? "show-answer" : ""}`}
            style={_btnStyle}
            onClick={handleClick}
          >
            <span className="index" style={indexStyle}>
              {indexStr}
            </span>
            <Tooltip title={userSelection?.value}>
              <span className="text clipText" style={textStyle}>
                {userSelection && userSelection.value}
              </span>
            </Tooltip>

            <IconWrapper rightPosition={isBoxSizeSmall ? 1 : 8}>
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
            style={_btnStyle}
            onClick={handleClick}
          >
            <span className="index" style={indexStyle}>
              {indexStr}
            </span>
            <Tooltip title={userSelection?.value}>
              <span className="text clipText" style={textStyle}>
                {userSelection && userSelection.value}
              </span>
            </Tooltip>

            <IconWrapper rightPosition={isBoxSizeSmall ? 1 : 8}>
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
          onClick={handleClick}
        >
          {!showAnswer && hasGroupResponses && (
            <span
              title={userSelection?.value}
              className={`
                response-btn 
                ${choiceAttempted ? "check-answer" : ""} 
                ${status}`}
              style={{
                ...btnStyle,
                minWidth: `${btnStyle.widthpx}px`
              }}
            >
              {showIndex && <span className="index">{indexStr}</span>}
              <span className="text clipText">{userSelection && userSelection.value}</span>

              <IconWrapper rightPosition={isBoxSizeSmall ? 1 : 8}>
                {choiceAttempted && status === "right" && <RightIcon />}
                {choiceAttempted && status === "wrong" && <WrongIcon />}
              </IconWrapper>
            </span>
          )}
          {!showAnswer && !hasGroupResponses && (
            <span
              title={userSelection?.value}
              className={`
                response-btn 
                ${choiceAttempted ? "check-answer" : ""} 
                ${status}`}
              style={{
                ...btnStyle,
                minWidth: `${btnStyle.widthpx}px`
              }}
            >
              {showIndex && <span className="index">{indexStr}</span>}
              <span className="text clipText">{userSelection && userSelection.value}</span>

              <IconWrapper rightPosition={isBoxSizeSmall ? 1 : 8}>
                {choiceAttempted && status === "right" && <RightIcon />}
                {choiceAttempted && status === "wrong" && <WrongIcon />}
              </IconWrapper>
            </span>
          )}
        </span>
      </span>
    </Fragment>
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
