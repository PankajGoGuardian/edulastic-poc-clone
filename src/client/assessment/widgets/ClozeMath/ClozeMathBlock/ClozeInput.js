import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
// import { isEmpty } from "lodash";
import { Input } from "antd";
import CheckedBlock from "./CheckedBlock";

const ClozeInput = ({ index, targetindex, resprops = {} }) => {
  const { save, answers = {}, evaluation = [], checked } = resprops;
  const { inputs: _inputsAnwers = [] } = answers;
  const [val, setVal] = useState(_inputsAnwers[targetindex] ? _inputsAnwers[targetindex].value : "");

  // const isChecked = checked && !isEmpty(evaluation);

  return checked ? (
    <CheckedBlock isCorrect={evaluation[index]} userAnswer={_inputsAnwers[targetindex]} index={index} />
  ) : (
    <InputDiv>
      <Input
        onChange={e => setVal(e.target.value)}
        onBlur={() => save({ value: val, index, type: "inputs" }, targetindex)}
        value={val}
      />
    </InputDiv>
  );
};

ClozeInput.propTypes = {
  resprops: PropTypes.object.isRequired,
  targetindex: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired
};

export default ClozeInput;

const InputDiv = styled.div`
  min-width: 80px;
  max-width: 120px;
  display: inline-block;
  margin: 0px 4px;
`;
