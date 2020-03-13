import React from "react";
import PropTypes from "prop-types";
import { StyledRadioGroup, StyledRadio } from "../../styled";
import { StyledSubtitle } from "./styled";

const OptionGroup = ({ title, onChange, value, options }) => {
  return (
    <div>
      <StyledSubtitle>{title}</StyledSubtitle>
      <StyledRadioGroup onChange={onChange} value={value}>
        {options.map(option => (
          <StyledRadio key={option} value={option}>
            {option}
          </StyledRadio>
        ))}
      </StyledRadioGroup>
    </div>
  );
};

OptionGroup.propTypes = {
  title: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.string)
};
export default OptionGroup;
