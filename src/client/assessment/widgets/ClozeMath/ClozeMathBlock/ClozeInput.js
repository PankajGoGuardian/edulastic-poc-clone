import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Input } from "antd";

const ClozeInput = ({ handleAddAnswer, targetIndex, emkey }) => (
  <InputDiv key={emkey}>
    <Input onChange={e => handleAddAnswer(e.target.value, targetIndex, "inputs")} />
  </InputDiv>
);

ClozeInput.propTypes = {
  handleAddAnswer: PropTypes.func.isRequired,
  targetIndex: PropTypes.number.isRequired,
  emkey: PropTypes.string.isRequired
};

export default ClozeInput;

const InputDiv = styled.div`
  min-width: 80px;
  max-width: 120px;
  display: inline-block;
  margin: 0px 4px;
`;
