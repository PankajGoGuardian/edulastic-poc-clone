import React from "react";
import PropTypes from "prop-types";
import { find } from "lodash";
import styled from "styled-components";
import { Select } from "antd";
import CheckedBlock from "./CheckedBlock";

const { Option } = Select;

const ClozeDropDown = ({ resprops = {}, id }) => {
  const { save, options, answers = {}, evaluation = [], checked, item } = resprops;
  const { dropDowns: _dropDownAnswers = [] } = answers;

  const val = _dropDownAnswers[id] ? _dropDownAnswers[id].value : "";
  const {
    response_ids: { dropDowns }
  } = item;
  const { index } = find(dropDowns, res => res.id === id);
  // const isChecked = checked && !isEmpty(evaluation);
  return checked ? (
    <CheckedBlock
      item={item}
      userAnswer={_dropDownAnswers[id]}
      id={id}
      width={item.ui_style.widthpx}
      evaluation={evaluation}
      type="dropDowns"
    />
  ) : (
    <StyeldSelect
      onChange={text => save({ value: text, index }, "dropDowns", id)}
      value={val}
      width={item.ui_style.widthpx}
    >
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
  min-width: 80px;
  margin: 0px 4px;
  width: ${({ width }) => (!width ? null : `${width}px`)};
`;
