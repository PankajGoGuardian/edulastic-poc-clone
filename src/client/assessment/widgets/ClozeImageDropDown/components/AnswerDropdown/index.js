import PropTypes from "prop-types";
import React from "react";
import { Select } from "antd";

import { SelectContainer } from "./styled/SelectContainer";

const AnswerDropdown = ({
  responseIndex,
  style,
  dropdownStyle,
  backgroundColor,
  onChange,
  disabled,
  options,
  defaultValue,
  placeholder
}) => (
  <SelectContainer style={style} backgroundColor={backgroundColor}>
    <Select
      style={style}
      placeholder={placeholder}
      disabled={disabled}
      data-cy={`dropdown-res-${responseIndex}`}
      getPopupContainer={triggerNode => triggerNode.parentNode}
      value={defaultValue || undefined} // placeholder doesn't work if value is empty string
      dropdownStyle={dropdownStyle}
      onChange={value => {
        onChange(value);
      }}
    >
      {options.map((item, index) => (
        <Select.Option data-cy={`dropdown-res-item-${responseIndex}-${index}`} key={index} value={item.value}>
          {item.label}
        </Select.Option>
      ))}
    </Select>
  </SelectContainer>
);

AnswerDropdown.propTypes = {
  responseIndex: PropTypes.number,
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  defaultValue: PropTypes.string,
  style: PropTypes.object.isRequired,
  backgroundColor: PropTypes.string.isRequired,
  placeholder: PropTypes.string
};

AnswerDropdown.defaultProps = {
  defaultValue: "",
  responseIndex: 0,
  placeholder: ""
};

export default AnswerDropdown;
