import React from "react";
import PropTypes from "prop-types";
import { find } from "lodash";
import styled from "styled-components";
import { Select } from "antd";
import CheckedBlock from "./CheckedBlock";

const { Option } = Select;

const ClozeDropDown = ({ resprops = {}, id }) => {
  const { save, options, answers = {}, evaluation = [], checked, item, onInnerClick, uiStyles = {} } = resprops;
  const { dropDowns: _dropDownAnswers = [] } = answers;

  const val = _dropDownAnswers[id] ? _dropDownAnswers[id].value : "";
  const {
    response_ids: { dropDowns }
  } = item;
  const { index } = find(dropDowns, res => res.id === id) || {};

  return checked ? (
    <CheckedBlock
      item={item}
      userAnswer={_dropDownAnswers[id]}
      id={id}
      evaluation={evaluation}
      type="dropDowns"
      onInnerClick={onInnerClick}
    />
  ) : (
    <StyeldSelect onChange={text => save({ value: text, index }, "dropDowns", id)} value={val} style={uiStyles}>
      {options &&
        options[id] &&
        options[id].map((response, respID) => (
          <Option value={response} key={respID}>
            {response}
          </Option>
        ))}
    </StyeldSelect>
  );
};

ClozeDropDown.propTypes = {
  resprops: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired
};

export default ClozeDropDown;

const StyeldSelect = styled(Select)`
  min-width: 120px;
  margin: 0px 4px;
  width: ${({ width }) => (!width ? null : `${width}`)};
  min-height: 35px;
`;
