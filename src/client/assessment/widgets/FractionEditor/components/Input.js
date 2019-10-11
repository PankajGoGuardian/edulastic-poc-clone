import React, { useState } from "react";
import PropTypes from "prop-types";

import { Input, message } from "antd";

const CustomInput = ({ size, type, value, placeholder, onBlur }) => {
  const [inputValue, changeInputValue] = useState(value);

  const handleInputChange = event => {
    changeInputValue(event.target.value);
  };

  const handleInputBlur = () => {
    if (type === "number") {
      const regex = new RegExp("^[1-9]+([0-9]*)$", "g");
      if (!regex.test(inputValue)) {
        message.error("Values can only be natural numbers greater than 0");
        return null;
      }
    }
    onBlur(inputValue);
  };

  return (
    <Input
      size={size}
      onChange={handleInputChange}
      onBlur={handleInputBlur}
      value={inputValue}
      placeholder={placeholder}
    />
  );
};

CustomInput.propTypes = {
  size: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.number.isRequired,
  placeholder: PropTypes.string,
  onBlur: PropTypes.func
};

CustomInput.defaultProps = {
  size: "default",
  type: "text",
  placeholder: "",
  onBlur: () => {}
};

export default CustomInput;
