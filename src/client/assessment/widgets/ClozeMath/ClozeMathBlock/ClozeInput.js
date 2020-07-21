import React, { useMemo } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { find } from "lodash";
import { lightGrey12 } from "@edulastic/colors";
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
    disableResponse,
    isPrintPreview
  } = resprops;
  const { inputs: _inputsAnwers = [] } = answers;
  const {
    responseIds: { inputs }
  } = item;
  const val = _inputsAnwers[id]?.value || "";
  const { index } = find(inputs, res => res.id === id) || {};

  const inputBoxStyle = useMemo(() => {
    const response = find(responseContainers, cont => cont.id === id);
    const individualWidth = response?.widthpx || 0;
    const individualHeight = response?.heightpx || 0;
    const { heightpx: globalHeight = 0, widthpx: globalWidth = 0, minHeight, minWidth } = item.uiStyle || {};
    const width = individualWidth || Math.max(parseInt(globalWidth, 10), parseInt(minWidth, 10));
    const height = individualHeight || Math.max(parseInt(globalHeight, 10), parseInt(minHeight, 10));
    return {
      ...uiStyles,
      width: !width ? "auto" : `${width}px`,
      height: !height ? "auto" : `${height}px`
    };
  }, [uiStyles, item]);

  return checked ? (
    <CheckedBlock
      width={inputBoxStyle.width}
      height={inputBoxStyle.height}
      evaluation={evaluation}
      showIndex={showIndex}
      userAnswer={_inputsAnwers[id]}
      id={id}
      item={item}
      type="inputs"
      onInnerClick={onInnerClick}
      isPrintPreview={isPrintPreview}
    />
  ) : (
    <InputDiv>
      <InputBox
        disabled={disableResponse}
        onChange={e => save({ value: e.target.value, index }, "inputs", id)}
        value={val}
        {...inputBoxStyle}
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

const InputBox = styled(TextInputStyled)`
  text-align: center;
  min-width: ${({ minWidth }) => minWidth};
  &.ant-input {
    border: 1px solid ${lightGrey12};
  }
`;
