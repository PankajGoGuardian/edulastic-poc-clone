import React from "react";
import PropTypes from "prop-types";
import { Input } from "antd";

const CommonInput = ({ onChange, value, size, type, shadedCellsCount = 0 }) => (
  <Input
    onChange={e => onChange(e.target.value > shadedCellsCount ? e.target.value : shadedCellsCount)}
    type={type}
    value={value}
    size={size}
    min={shadedCellsCount}
  />
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
