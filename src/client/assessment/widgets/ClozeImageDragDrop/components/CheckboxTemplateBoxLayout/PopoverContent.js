import React from "react";
import PropTypes from "prop-types";
import { response } from "@edulastic/constants";
import { MathSpan } from "@edulastic/common";

import { IconWrapper } from "./styled/IconWrapper";
import { RightIcon } from "./styled/RightIcon";
import { WrongIcon } from "./styled/WrongIcon";

// eslint-disable-next-line max-len
export function PopoverContent({ fontSize, answer, status, className, checkAnswer, indexStr }) {
  return (
    <div fontSize={fontSize} className={className} style={{ position: "relative", "max-width": response.maxWidth }}>
      <div
        className="index index-box"
        style={{ display: checkAnswer ? "none" : "flex", alignSelf: "stretch", height: "auto" }}
      >
        {indexStr}
      </div>
      <div className="text container" style={{ overflow: "unset" }}>
        <div>
          <MathSpan dangerouslySetInnerHTML={{ __html: answer }} />
        </div>
        <IconWrapper rightPosition={10}>
          {answer && status === "right" && <RightIcon />}
          {answer && status === "wrong" && <WrongIcon />}
        </IconWrapper>
      </div>
    </div>
  );
}

PopoverContent.propTypes = {
  fontSize: PropTypes.number,
  status: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  answer: PropTypes.any.isRequired,
  checkAnswer: PropTypes.bool.isRequired
};

PopoverContent.defaultProps = {
  fontSize: 14
};
