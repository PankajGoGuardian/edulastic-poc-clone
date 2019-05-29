import React from "react";
import PropTypes from "prop-types";

import { IconWrapper } from "./styled/IconWrapper";
import { RightIcon } from "./styled/RightIcon";
import { WrongIcon } from "./styled/WrongIcon";
import { CheckBox } from "./styled/CheckBox";

const CheckedDropDown = ({ isCorrect, userAnswer, index }) => (
  <CheckBox className={isCorrect ? "right" : "wrong"} key={`dropdown_${index}`}>
    <span className="index">{index + 1}</span>
    <span className="value">{userAnswer}</span>
    <IconWrapper>{isCorrect ? <RightIcon /> : <WrongIcon />}</IconWrapper>
  </CheckBox>
);

CheckedDropDown.propTypes = {
  isCorrect: PropTypes.bool,
  userAnswer: PropTypes.any,
  index: PropTypes.number.isRequired
};

CheckedDropDown.defaultProps = {
  isCorrect: false,
  userAnswer: ""
};

export default CheckedDropDown;
