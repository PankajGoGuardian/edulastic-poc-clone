import React from "react";
import PropTypes from "prop-types";

import { IconWrapper } from "./styled/IconWrapper";
import { RightIcon } from "./styled/RightIcon";
import { WrongIcon } from "./styled/WrongIcon";
import { CheckBox } from "./styled/CheckBox";

const CheckedInput = ({ isCorrect, userAnswer, index }) => (
  <CheckBox className={isCorrect ? "right" : "wrong"} key={`input_${index}`}>
    <span className="index">{index + 1}</span>
    <span className="value">{userAnswer}</span>
    <IconWrapper>{isCorrect ? <RightIcon /> : <WrongIcon />}</IconWrapper>
  </CheckBox>
);

CheckedInput.propTypes = {
  isCorrect: PropTypes.bool,
  userAnswer: PropTypes.any,
  index: PropTypes.number.isRequired
};

CheckedInput.defaultProps = {
  isCorrect: false,
  userAnswer: ""
};

export default CheckedInput;
