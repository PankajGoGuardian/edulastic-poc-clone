import React from "react";
import PropTypes from "prop-types";

import { Input } from "antd";

const CustomInput = ({ size, style, type, value, placeholder, onChange }) => {
  const handleInputChange = event => onChange(event.target.value);
  // eslint-disable-next-line max-len
  return (
    <Input size={size} style={style} type={type} value={value} onChange={handleInputChange} placeholder={placeholder} />
  );
};

CustomInput.propTypes = {
  size: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.number.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  style: PropTypes.object
};

CustomInput.defaultProps = {
  size: "default",
  type: "text",
  placeholder: "",
  style: {}
};

export default CustomInput;
