import React from "react";
import PropTypes from "prop-types";
import { response } from "@edulastic/constants";

import { getStemNumeration } from "../../../utils/helpers";
import { IconWrapper } from "./CheckboxTemplateBoxLayout/styled/IconWrapper";
import { RightIcon } from "./CheckboxTemplateBoxLayout/styled/RightIcon";
import { WrongIcon } from "./CheckboxTemplateBoxLayout/styled/WrongIcon";

// eslint-disable-next-line max-len
const PopoverContent = ({ stemNumeration, index, fontSize, userSelections, status, checkAnswer, isExpressGrader }) => {
  const indexStr = getStemNumeration(stemNumeration, index);
  return (
    <span className="template_box dropdown" style={{ fontSize, padding: 20, overflow: "hidden", margin: "0px 4px" }}>
      <span
        className={`response-btn ${
          userSelections.length > 0 && userSelections[index] ? "check-answer" : ""
        } ${status} show-answer"`}
        style={{ position: "relative" }}
      >
        <span
          className="index index-box"
          style={{ display: checkAnswer && !isExpressGrader ? "none" : "flex", "align-self": "stretch" }}
        >
          {indexStr}
        </span>
        <div className="text container" style={{ maxWidth: response.maxWidth }}>
          <div style={{ whiteSpace: "normal" }}>{userSelections[index]}</div>
          <IconWrapper rightPosition={10} style={{ top: "50%", transform: "translateY(-50%)" }}>
            {userSelections.length > 0 && status === "right" && <RightIcon />}
            {userSelections.length > 0 && status === "wrong" && <WrongIcon />}
          </IconWrapper>
        </div>
      </span>
    </span>
  );
};

PopoverContent.propTypes = {
  stemNumeration: PropTypes.string,
  index: PropTypes.number.isRequired,
  fontSize: PropTypes.number,
  userSelections: PropTypes.array.isRequired,
  status: PropTypes.string.isRequired,
  checkAnswer: PropTypes.bool.isRequired,
  isExpressGrader: PropTypes.bool.isRequired
};

PopoverContent.defaultProps = {
  stemNumeration: "",
  fontSize: 14
};

export default PopoverContent;
