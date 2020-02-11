import { FlexContainer } from "@edulastic/common";
import PropTypes from "prop-types";
import React from "react";
import { TextInputStyled } from "../../../styled/InputStyles";
import { Label } from "../../../styled/WidgetOptions/Label";

const LargeInput = ({ value, onChange, type, label, ...restProps }) => (
  <FlexContainer justifyContent="flex-start">
    <TextInputStyled
      style={{ marginRight: "5px" }}
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      size="large"
      {...restProps}
    />
    <Label style={{ margin: "0px" }}>{label}</Label>
  </FlexContainer>
);

LargeInput.propTypes = {
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired
};

export default LargeInput;
