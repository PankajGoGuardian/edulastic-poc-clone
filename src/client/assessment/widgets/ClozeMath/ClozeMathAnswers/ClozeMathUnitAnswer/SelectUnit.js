import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Select } from "antd";
import { MathKeyboard } from "@edulastic/common";

const { Option } = Select;

const SelectUnit = ({ onChange, unit, customUnits, keypadMode }) => {
  let allBtns = MathKeyboard.KEYBOARD_BUTTONS.filter(btn => btn.types.includes(keypadMode));

  if (keypadMode === "custom") {
    allBtns = customUnits
      .split(",")
      .filter(u => !!u)
      .map(u => ({ label: u.trim(), handler: u.trim() }));
  }

  const onChangeUnit = v => {
    onChange("unit", v);
  };

  return (
    <StyledSelect onChange={onChangeUnit} value={unit}>
      {allBtns.map((btn, i) => (
        <Option value={btn.handler} key={i}>
          {btn.label}
        </Option>
      ))}
    </StyledSelect>
  );
};

SelectUnit.propTypes = {
  onChange: PropTypes.func.isRequired,
  keypadMode: PropTypes.string.isRequired,
  unit: PropTypes.string.isRequired,
  customUnits: PropTypes.string
};

SelectUnit.defaultProps = {
  customUnits: ""
};

export default SelectUnit;

const StyledSelect = styled(Select)`
  min-width: 80px;
  margin-left: 24px;
  .ant-select-selection {
    padding: 5px 2px;
  }
  svg {
    display: inline-block;
  }
`;
