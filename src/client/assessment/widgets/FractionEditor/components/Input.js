import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { TextInputStyled } from "../../../styled/InputStyles";

const CustomInput = ({ value, onBlur, id = "defaultId", ...restProps }) => {
  const [inputValue, changeInputValue] = useState(value);

  const handleInputChange = event => {
    changeInputValue(event.target.value);
  };

  useEffect(() => {
    changeInputValue(value);
  }, [value]);

  const handleInputBlur = () => onBlur(inputValue);

  return (
    <TextInputStyled {...restProps} id={id} onChange={handleInputChange} onBlur={handleInputBlur} value={inputValue} />
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
