import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { find } from "lodash";
import { Input } from "antd";
import CheckedBlock from "./CheckedBlock";

const ClozeInput = ({ id, resprops = {} }) => {
  const { save, answers = {}, evaluation = [], checked, item, onInnerClick } = resprops;
  const { inputs: _inputsAnwers = [] } = answers;
  const [val, setVal] = useState(_inputsAnwers[id] ? _inputsAnwers[id].value : "");
  const {
    response_ids: { inputs }
  } = item;
  const { index } = find(inputs, res => res.id === id);
  // const isChecked = checked && !isEmpty(evaluation);

  return checked ? (
    <CheckedBlock
      evaluation={evaluation}
      userAnswer={_inputsAnwers[id]}
      id={id}
      item={item}
      type="inputs"
      onInnerClick={onInnerClick}
    />
  ) : (
    <InputDiv>
      <Input
        onChange={e => setVal(e.target.value)}
        onBlur={() => save({ value: val, index }, "inputs", id)}
        value={val}
      />
    </InputDiv>
  );
};

ClozeInput.propTypes = {
  resprops: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired
};

export default ClozeInput;

const InputDiv = styled.div`
  min-width: 80px;
  max-width: 120px;
  display: inline-block;
  margin: 0px 4px;
`;
