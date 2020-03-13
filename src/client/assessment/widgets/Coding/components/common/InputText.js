import React from "react";
import PropTypes from "prop-types";
import { Input } from "antd";
import { StyledSubtitle } from "./styled";

const InputText = ({ title, onChange, value, placeholder }) => {
  return (
    <div>
      <StyledSubtitle>{title}</StyledSubtitle>
      <Input value={value} onChange={onChange} placeholder={placeholder} />
    </div>
  );
};

InputText.propTypes = {
  title: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  placeholder: PropTypes.string
};

export default InputText;
