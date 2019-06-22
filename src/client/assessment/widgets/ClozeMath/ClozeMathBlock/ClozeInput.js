import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { find } from "lodash";
import { Input } from "antd";
import CheckedBlock from "./CheckedBlock";

const ClozeInput = ({ id, resprops = {} }) => {
  const { save, answers = {}, evaluation = [], checked, item, onInnerClick } = resprops;
  const { inputs: _inputsAnwers = [] } = answers;
  const val = _inputsAnwers[id] ? _inputsAnwers[id].value : "";
  const {
    response_ids: { inputs }
  } = item;
  const { index } = find(inputs, res => res.id === id) || {};
  // const isChecked = checked && !isEmpty(evaluation);
  const { ui_style: uiStyle } = item;
  const width = uiStyle[id] ? `${uiStyle[id].widthpx}px` : `${uiStyle.min_width}px`;
  return checked ? (
    <CheckedBlock
      evaluation={evaluation}
      userAnswer={_inputsAnwers[id]}
      id={id}
      item={item}
      type="inputs"
      onInnerClick={onInnerClick}
      width={width || "auto"}
    />
  ) : (
    <InputDiv>
      <Input onChange={e => save({ value: e.target.value, index }, "inputs", id)} value={val} />
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
  display: inline-block;
  margin: 0px 4px;
  min-height: 35px;
`;
