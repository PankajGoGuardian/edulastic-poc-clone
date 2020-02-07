import React from "react";
import PropTypes from "prop-types";
import { TextInputStyled } from "../../../../styled/InputStyles";

const CommonInput = ({ onChange, value, size, type, shadedCellsCount = false }) => (
  /**
   * FIXME: this is used as common text for all. `shadedCellsCount` seems like a specific behavior
   */
  <TextInputStyled
    onChange={e => onChange(e.target.value > shadedCellsCount || !shadedCellsCount ? e.target.value : shadedCellsCount)}
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
