import React from "react";
import PropTypes from "prop-types";

import { Input } from "antd";

const CustomInput = ({ size, type, value, placeholder, onBlur }) => {
  const handleInputBlur = event => onBlur(event.target.value);

  // eslint-disable-next-line max-len
  return <Input size={size} type={type} defaultValue={value} onBlur={handleInputBlur} placeholder={placeholder} />;
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
