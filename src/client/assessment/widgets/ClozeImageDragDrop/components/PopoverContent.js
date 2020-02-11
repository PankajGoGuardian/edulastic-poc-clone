import React from "react";
import PropTypes from "prop-types";
import { response } from "@edulastic/constants";

import { getStemNumeration } from "../../../utils/helpers";
import { IconWrapper } from "./CheckboxTemplateBoxLayout/styled/IconWrapper";
import { RightIcon } from "./CheckboxTemplateBoxLayout/styled/RightIcon";
import { WrongIcon } from "./CheckboxTemplateBoxLayout/styled/WrongIcon";

// eslint-disable-next-line max-len
const PopoverContent = ({
  stemNumeration,
  index,
  fontSize,
  answer,
  status,
  className,
  checkAnswer,
  isExpressGrader
}) => {
  const indexStr = getStemNumeration(stemNumeration, index);
  return (
    <div fontSize={fontSize} className={className} style={{ position: "relative", "max-width": response.maxWidth }}>
      <div
        className="index index-box"
        style={{ display: checkAnswer && !isExpressGrader ? "none" : "flex", alignSelf: "stretch", height: "auto" }}
      >
        {indexStr}
      </div>
      <div className="text container">
        <div className="clipText">{answer}</div>
        <IconWrapper rightPosition={10}>
          {answer && status === "right" && <RightIcon />}
          {answer && status === "wrong" && <WrongIcon />}
        </IconWrapper>
      </div>
    </div>
  );
};

PopoverContent.propTypes = {
  stemNumeration: PropTypes.string,
  index: PropTypes.number.isRequired,
  fontSize: PropTypes.number,
  status: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  answer: PropTypes.any.isRequired,
  checkAnswer: PropTypes.bool.isRequired,
  isExpressGrader: PropTypes.bool.isRequired
};

PopoverContent.defaultProps = {
  stemNumeration: "",
  fontSize: 14
};

export default PopoverContent;
