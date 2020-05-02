import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { find } from "lodash";
import { TextInputStyled } from "@edulastic/common";
import CheckedBlock from "./CheckedBlock";

const ClozeInput = ({ id, resprops = {} }) => {
  const {
    responseContainers,
    save,
    answers = {},
    evaluation = [],
    checked,
    item,
    onInnerClick,
    uiStyles = {},
    showIndex,
    disableResponse
  } = resprops;
  const { inputs: _inputsAnwers = [] } = answers;
  const {
    responseIds: { inputs }
  } = item;
  const val = _inputsAnwers[id]?.value || "";
  const { index } = find(inputs, res => res.id === id) || {};
  const response = find(responseContainers, cont => cont.id === id);

  const individualWidth = response?.widthpx || 0;
  const individualHeight = response?.heightpx || 0;

  const { heightpx: globalHeight = 0, widthpx: globalWidth = 0, minHeight, minWidth } = item.uiStyle || {};

  const width = individualWidth || Math.max(parseInt(globalWidth, 10), parseInt(minWidth, 10));
  const height = individualHeight || Math.max(parseInt(globalHeight, 10), parseInt(minHeight, 10));

  return checked ? (
    <CheckedBlock
      width={width}
      height={height}
      evaluation={evaluation}
      showIndex={showIndex}
      userAnswer={_inputsAnwers[id]}
      id={id}
      item={item}
      type="inputs"
      onInnerClick={onInnerClick}
    />
  ) : (
    <InputDiv>
      <TextInputStyled
        disabled={disableResponse}
        onChange={e => save({ value: e.target.value, index }, "inputs", id)}
        value={val}
        height={!height ? "auto" : height}
        style={{
          ...uiStyles,
          width: !width ? "auto" : width,
          height: !height ? "auto" : height,
          minHeight: "35px",
          textAlign: "left",
          borderRadius: 0
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
  vertical-align: middle;
`;
