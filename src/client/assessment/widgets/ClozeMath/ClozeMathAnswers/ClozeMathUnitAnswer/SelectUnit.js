import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Select } from "antd";

const { Option } = Select;

const SelectUnit = ({ onChange, value }) => {
  const onChangeUnit = v => {
    onChange("unit", v);
  };
  return (
    <StyledSelect onChange={onChangeUnit} value={value}>
      <Option value="jack">Jack</Option>
      <Option value="lucy">Lucy</Option>
      <Option value="Yiminghe">yiminghe</Option>
    </StyledSelect>
  );
};

SelectUnit.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired
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
