import React, { useState } from "react";
import PropTypes from "prop-types";

import { TextInputStyled } from "../../../styled/InputStyles";

const CustomInput = ({ size, type, value, placeholder, onBlur, style }) => {
  const [inputValue, changeInputValue] = useState(value);

  const handleInputChange = event => {
    changeInputValue(event.target.value);
  };

  const handleInputBlur = () => onBlur(inputValue);

  return (
    <TextInputStyled
      size={size}
      type={type}
      onChange={handleInputChange}
      onBlur={handleInputBlur}
      value={inputValue}
      placeholder={placeholder}
      style={style}
    />
  );
};

CustomInput.propTypes = {
  size: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.number.isRequired,
  placeholder: PropTypes.string,
  onBlur: PropTypes.func,
  style: PropTypes.object
};

CustomInput.defaultProps = {
  size: "default",
  type: "text",
  placeholder: "",
  onBlur: () => {},
  style: {}
};

export default CustomInput;
