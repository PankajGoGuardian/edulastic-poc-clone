import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Select } from "antd";

import { StyledSubtitle } from "./styled";

const Dropdown = ({ title, onChange, value, placeholder, options, menuClassName }) => {
  return (
    <div>
      <StyledSubtitle>{title}</StyledSubtitle>
      <Select value={value} onChange={onChange} placeholder={placeholder} dropdownClassName={menuClassName} getPopupContainer={triggerNode => triggerNode.parentNode}>
        {options.map(option => (
          <Select.Option key={option} value={option}>
            {option}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};

Dropdown.propTypes = {
  title: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.string),
  menuClassName: PropTypes.string
};

Dropdown.defaultProps = {
  menuClassName: "testcase-category-menu"
};

export default Dropdown;
