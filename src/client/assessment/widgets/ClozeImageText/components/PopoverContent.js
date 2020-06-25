import React from "react";
import PropTypes from "prop-types";
import { response } from "@edulastic/constants";

import { IconWrapper } from "./CheckboxTemplateBoxLayout/styled/IconWrapper";
import { RightIcon } from "./CheckboxTemplateBoxLayout/styled/RightIcon";
import { WrongIcon } from "./CheckboxTemplateBoxLayout/styled/WrongIcon";

const PopoverContent = ({ indexStr, fontSize, userAnswer, hasAnswered, status, checkAnswer, isExpressGrader }) => (
  <span className="template_box dropdown" style={{ fontSize, padding: 20, overflow: "hidden", margin: "0px 4px" }}>
    <span
      className={`response-btn ${hasAnswered ? "check-answer" : ""} ${status} show-answer"`}
      style={{ position: "relative" }}
    >
      <span
        className="index index-box"
        style={{ display: checkAnswer && !isExpressGrader ? "none" : "flex", alignSelf: "stretch" }}
      >
        {indexStr}
      </span>
      <div className="text container" style={{ maxWidth: response.maxWidth }}>
        <div style={{ whiteSpace: "normal" }}>{userAnswer}</div>
        <IconWrapper rightPosition={5}>
          {hasAnswered && status === "right" && <RightIcon />}
          {hasAnswered && status === "wrong" && <WrongIcon />}
        </IconWrapper>
      </div>
    </span>
  </span>
);

PopoverContent.propTypes = {
  fontSize: PropTypes.number,
  userAnswer: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  checkAnswer: PropTypes.bool.isRequired,
  isExpressGrader: PropTypes.bool.isRequired
};

PopoverContent.defaultProps = {
  fontSize: 14
};

export default PopoverContent;
