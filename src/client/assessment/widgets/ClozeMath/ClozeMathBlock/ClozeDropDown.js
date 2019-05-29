import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Select } from "antd";

const { Option } = Select;

const ClozeDropDown = ({ key, handleAddAnswer, optionsIndex, options }) => (
  <StyeldSelect key={key} onChange={text => handleAddAnswer(text, optionsIndex, "dropDown")}>
    {options &&
      options[optionsIndex] &&
      options[optionsIndex].map((response, respID) => (
        <Option value={response} key={respID}>
          {response}
        </Option>
      ))}
  </StyeldSelect>
);

ClozeDropDown.propTypes = {
  key: PropTypes.string.isRequired,
  optionsIndex: PropTypes.number.isRequired,
  options: PropTypes.array.isRequired,
  handleAddAnswer: PropTypes.func.isRequired
};

export default ClozeDropDown;

const StyeldSelect = styled(Select)`
  min-width: 80px;
  margin: 0px 4px;
`;
