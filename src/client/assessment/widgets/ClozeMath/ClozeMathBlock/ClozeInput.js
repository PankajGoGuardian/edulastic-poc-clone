import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { find } from "lodash";
import { Input } from "antd";
import CheckedBlock from "./CheckedBlock";

const ClozeInput = ({ id, resprops = {} }) => {
  const { save, answers = {}, evaluation = [], checked, item, onInnerClick, uiStyles = {} } = resprops;
  const { inputs: _inputsAnwers = [] } = answers;
  const val = _inputsAnwers[id] ? _inputsAnwers[id].value : "";
  const {
    response_ids: { inputs }
  } = item;
  const { index } = find(inputs, res => res.id === id) || {};
  const width = item.ui_style[id] && `${item.ui_style[id].widthpx}`;
  return checked ? (
    <CheckedBlock
      width={width}
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
        onChange={e => save({ value: e.target.value, index }, "inputs", id)}
        value={val}
        style={{ ...uiStyles, width: `${!width ? "auto" : width}px` }}
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
  display: inline-block;
  margin: 0px 4px;
  min-height: 35px;
`;
