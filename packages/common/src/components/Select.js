import PropTypes from "prop-types";
import React from "react";
import { SelectInputStyled } from "../../../../src/client/assessment/styled/InputStyles";

const Select = ({ onChange, options, value, style }) => (
  <SelectInputStyled
    onChange={e => onChange(e)}
    defaultValue={value}
    data-cy="selectStyle"
    borderRadius={style.borderRadius}
  >
    {options.map((item, index) => (
      <option data-cy={item.value} key={index} value={item.value}>
        {item.label}
      </option>
    ))}
  </SelectInputStyled>
);

Select.propTypes = {
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  style: PropTypes.object
};

Select.defaultProps = {
  style: {}
};

export default Select;
