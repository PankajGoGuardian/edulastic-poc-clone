import React from "react";
import PropTypes from "prop-types";
import { isEmpty } from "lodash";
import styled from "styled-components";
import { Select } from "antd";
import CheckedBlock from "./CheckedBlock";

const { Option } = Select;

const ClozeDropDown = ({ save, index, options, answers, evaluation, checked }) => {
  const { dropDown: _dropDownAnswers = [] } = answers;

  const { dropDownResults: checkResult = {} } = evaluation;
  const isChecked = checked && !isEmpty(checkResult);

  return isChecked ? (
    <CheckedBlock isCorrect={checkResult.evaluation[index]} userAnswer={_dropDownAnswers[index]} index={index} />
  ) : (
    <StyeldSelect onChange={text => save(text, index, "dropDown")} value={_dropDownAnswers[index]}>
      {options &&
        options[index] &&
        options[index].map((response, respID) => (
          <Option value={response} key={respID}>
            {response}
          </Option>
        ))}
    </StyeldSelect>
  );
};

ClozeDropDown.propTypes = {
  index: PropTypes.number.isRequired,
  options: PropTypes.object.isRequired,
  save: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired,
  evaluation: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  answers: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired
};

export default ClozeDropDown;

const StyeldSelect = styled(Select)`
  min-width: 80px;
  margin: 0px 4px;
`;
