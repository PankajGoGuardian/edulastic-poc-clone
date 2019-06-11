import React from "react";
import PropTypes from "prop-types";
// import { isEmpty } from "lodash";
import styled from "styled-components";
import { Select } from "antd";
import CheckedBlock from "./CheckedBlock";

const { Option } = Select;

const ClozeDropDown = ({ index, targetindex, resprops = {} }) => {
  const { save, options, answers = {}, evaluation = [], checked } = resprops;
  const { dropDown: _dropDownAnswers = [] } = answers;

  const val = _dropDownAnswers[targetindex] ? _dropDownAnswers[targetindex].value : "";

  // const isChecked = checked && !isEmpty(evaluation);

  return checked ? (
    <CheckedBlock isCorrect={evaluation[index]} userAnswer={_dropDownAnswers[targetindex]} index={index} />
  ) : (
    <StyeldSelect onChange={text => save({ value: text, index, type: "dropDown" }, targetindex)} value={val}>
      {options &&
        options[targetindex] &&
        options[targetindex].map((response, respID) => (
          <Option value={response} key={respID}>
            {response}
          </Option>
        ))}
    </StyeldSelect>
  );
};

ClozeDropDown.propTypes = {
  index: PropTypes.number.isRequired,
  targetindex: PropTypes.number.isRequired,
  resprops: PropTypes.object.isRequired
};

export default ClozeDropDown;

const StyeldSelect = styled(Select)`
  min-width: 80px;
  margin: 0px 4px;
`;
