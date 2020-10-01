import React from "react";
import { FroalaEditor } from "@edulastic/common";
import PropTypes from "prop-types";
import styled from "styled-components";

const Instruction = ({ instruction = "", updateTestData }) => {
  const onChange = value => {
    updateTestData("instruction")(value);
  };

  return (
    <StyledEditor
      toolbarId="test-instruction"
      value={instruction}
      onChange={onChange}
      placeholder="Instruction for the test"
      border="border"
      toolbarSize="SM"
    />
  );
};

Instruction.propTypes = {
  instruction: PropTypes.string,
  updateTestData: PropTypes.func.isRequired
};

Instruction.defaultProps = {
  instruction: ""
};

export default Instruction;

const StyledEditor = styled(FroalaEditor)`
  .fr-box {
    border-radius: 2px;
    min-height: 40px;
  }
`;
