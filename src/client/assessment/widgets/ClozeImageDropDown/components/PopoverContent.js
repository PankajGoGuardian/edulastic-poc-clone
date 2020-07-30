import React from "react";
import PropTypes from "prop-types";
import { response } from "@edulastic/constants";
import { MathSpan } from "@edulastic/common";

import { IconWrapper } from "./CheckboxTemplateBoxLayout/styled/IconWrapper";
import { RightIcon } from "./CheckboxTemplateBoxLayout/styled/RightIcon";
import { WrongIcon } from "./CheckboxTemplateBoxLayout/styled/WrongIcon";

// eslint-disable-next-line max-len
const PopoverContent = ({ indexStr, fontSize, answered, status, checkAnswer, isExpressGrader }) => (
  <span className="template_box dropdown" style={{ fontSize, padding: 20, overflow: "hidden", margin: "0px 4px" }}>
    <span
      className={`response-btn ${answered ? "check-answer" : ""} ${status} show-answer"`}
      style={{ position: "relative" }}
    >
      <span
        className="index index-box"
        style={{ display: checkAnswer && !isExpressGrader ? "none" : "flex", "align-self": "stretch" }}
      >
        {indexStr}
      </span>
      <div className="text container" style={{ maxWidth: response.maxWidth }}>
        <div style={{ whiteSpace: "normal" }}>
          <MathSpan dangerouslySetInnerHTML={{ __html: answered }} />
        </div>
        {answered && (
          <IconWrapper rightPosition={10} style={{ top: "50%", transform: "translateY(-50%)" }}>
            {status === "right" && <RightIcon />}
            {status === "wrong" && <WrongIcon />}
          </IconWrapper>
        )}
      </div>
    </span>
  </span>
);

PopoverContent.propTypes = {
  fontSize: PropTypes.number,
  status: PropTypes.string.isRequired,
  checkAnswer: PropTypes.bool.isRequired,
  isExpressGrader: PropTypes.bool.isRequired
};

PopoverContent.defaultProps = {
  fontSize: 14
};

export default PopoverContent;
