import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { find } from "lodash";
import { Input } from "antd";
import CheckedBlock from "./CheckedBlock";

const ClozeInput = ({ id, resprops = {} }) => {
  const {
    response_containers,
    save,
    answers = {},
    evaluation = [],
    checked,
    item,
    onInnerClick,
    uiStyles = {}
  } = resprops;
  const { inputs: _inputsAnwers = [] } = answers;
  const val = _inputsAnwers[id] ? _inputsAnwers[id].value : "";
  const {
    response_ids: { inputs }
  } = item;
  const { index } = find(inputs, res => res.id === id) || {};
  const response = find(response_containers, cont => cont.id === id);
  const width = response && response.widthpx ? `${response.widthpx}px` : `${item.ui_style.min_width}px` || "auto";
  const height = response && response.heightpx ? `${response.heightpx}px` : "auto";
  return checked ? (
    <CheckedBlock
      width={width}
      height={height}
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
        style={{
          ...uiStyles,
          width: !width ? "auto" : width,
          height: !height ? "auto" : height
        }}
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
`;
