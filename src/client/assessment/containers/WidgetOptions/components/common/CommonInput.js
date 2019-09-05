import React from "react";
import PropTypes from "prop-types";
import { Input } from "antd";

const CommonInput = ({ onChange, value, size, type }) => (
  <Input onChange={e => onChange(e.target.value)} type={type} value={value} size={size} />
);

CommonInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  value: PropTypes.any,
  size: PropTypes.oneOf(["default", "large", "small"])
};

CommonInput.defaultProps = {
  value: "",
  type: "text",
  size: "large"
};

export default CommonInput;
