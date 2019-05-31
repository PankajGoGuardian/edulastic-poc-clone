import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";
import { Input } from "antd";
import CheckedBlock from "./CheckedBlock";

const ClozeInput = ({ save, index, answers, evaluation, checked }) => {
  const { inputs: _inputsAnwers = [] } = answers;
  const [val, setVal] = useState(_inputsAnwers[index]);

  const { inputsResults: checkResult = {} } = evaluation;
  const isChecked = checked && !isEmpty(checkResult);

  return isChecked ? (
    <CheckedBlock isCorrect={checkResult.evaluation[index]} userAnswer={_inputsAnwers[index]} index={index} />
  ) : (
    <InputDiv>
      <Input onChange={e => setVal(e.target.value)} onBlur={() => save(val, index, "inputs")} value={val} />
    </InputDiv>
  );
};

ClozeInput.propTypes = {
  save: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  checked: PropTypes.bool.isRequired,
  evaluation: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  answers: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired
};

export default ClozeInput;

const InputDiv = styled.div`
  min-width: 80px;
  max-width: 120px;
  display: inline-block;
  margin: 0px 4px;
`;
