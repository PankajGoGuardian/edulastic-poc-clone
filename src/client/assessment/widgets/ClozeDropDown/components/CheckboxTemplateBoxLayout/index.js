import React, { useState } from "react";
import { Tooltip } from "antd";
import PropTypes from "prop-types";
import { isUndefined, find } from "lodash";
import { response } from "@edulastic/constants";
import { getStemNumeration } from "../../../../utils/helpers";
import { IconWrapper } from "./styled/IconWrapper";
import { RightIcon } from "./styled/RightIcon";
import { WrongIcon } from "./styled/WrongIcon";
import { CLEAR } from "../../../../constants/constantsForQuestions";

const CheckboxTemplateBoxLayout = ({ resprops, id }) => {
  if (!id) {
    return null;
  }

  const {
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
  const { index, id: answerId } = find(responseIds, _response => _response.id === id);
  const userSelection = find(userSelections, selection => (selection ? selection.id : "") === id);
  const indexStr = getStemNumeration(stemNumeration, index);
  const status = userSelections && evaluation ? (evaluation[answerId] ? "right" : "wrong") : "wrong";
  const choiceAttempted = userSelections.length > 0 ? !!userSelections[index] : null;
  let btnStyle =
    (responsecontainerindividuals && responsecontainerindividuals.find(resp => resp.id === answerId)) ||
    responseBtnStyle;

  const handleClick = () => {
    if (previewTab !== CLEAR && !disableResponse) {
      changePreviewTab(CLEAR);
    }
  };

  const _btnStyle = {
    ...btnStyle,
    width: btnStyle.widthpx,
    height: btnStyle.heightpx,
    minWidth: "unset"
  };
  console.log("_btstyle", _btnStyle);
  const lessMinWidth = parseInt(btnStyle.width, 10) < response.minWidthShowAnswer;
  const indexStyle = lessMinWidth ? { width: response.indexSizeSmallBox, padding: "8px", minWidth: "unset" } : {};
  const textStyle = lessMinWidth ? { maxWidth: "80%" } : {};
  const [showIndex, toggleIndexVisibility] = useState(!lessMinWidth);
  const handleHover = () => {
    if (showAnswer && lessMinWidth) {
      toggleIndexVisibility(!showIndex);
    }
  };
  return (
    <span className="template_box" style={{ fontSize, padding: 20 }}>
      {hasGroupResponses && (
        <span
          className={`
            response-btn 
            ${choiceAttempted ? "check-answer" : ""} 
            ${status} 
            ${showAnswer ? "show-answer" : ""}`}
          style={_btnStyle}
          onClick={handleClick}
          onMouseEnter={handleHover}
          onMouseLeave={handleHover}
        >
          {showAnswer && (
            <span className="index" style={indexStyle}>
              {indexStr}
            </span>
          )}
          <Tooltip title={userSelection?.value}>
            <span className="text container" style={{ padding: lessMinWidth ? "8px 2px" : null }}>
              <span style={{ ...textStyle, fontWeight: "normal" }} className="clipText">
                {userSelection?.value}
              </span>
            </span>
          </Tooltip>

          <IconWrapper rightPosition={lessMinWidth ? 1 : 8}>
            {choiceAttempted && status === "right" && <RightIcon />}
            {choiceAttempted && status === "wrong" && <WrongIcon />}
          </IconWrapper>
        </span>
      )}
      {!hasGroupResponses && (
        <span
          className={`
            response-btn 
            ${choiceAttempted ? "check-answer" : ""} 
            ${status} 
            ${showAnswer ? "show-answer" : ""}`}
          style={_btnStyle}
          onClick={handleClick}
          onMouseEnter={handleHover}
          onMouseLeave={handleHover}
        >
          {showAnswer && showIndex && (
            <span className="index" style={indexStyle}>
              {indexStr}
            </span>
          )}
          <Tooltip title={userSelection?.value}>
            <div className="text container" style={{ padding: lessMinWidth ? "8px 2px" : null }}>
              <div className="clipText" style={{ ...textStyle, fontWeight: "normal" }}>
                {userSelection && userSelection.value}
              </div>
            </div>
          </Tooltip>

          <IconWrapper rightPosition={lessMinWidth ? 1 : 8}>
            {choiceAttempted && status === "right" && <RightIcon />}
            {choiceAttempted && status === "wrong" && <WrongIcon />}
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
