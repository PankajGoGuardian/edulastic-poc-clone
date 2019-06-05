import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Select } from "antd";

const { Option } = Select;

const SelectWrapper = styled.span`
  margin: 0px 4px;
  display: flex;
`;

const ChoicesBox = ({ resprops, index: dropTargetIndex }) => {
  const { userAnswers, btnStyle, placeholder, responses, onChange: changeAnswers } = resprops;

  const selectChange = val => {
    if (changeAnswers) {
      changeAnswers(val, dropTargetIndex);
    }
  };

  return (
    <SelectWrapper>
      <Select
        value={userAnswers[dropTargetIndex]}
        style={{
          ...btnStyle,
          minWidth: 100,
          overflow: "hidden"
        }}
        data-cy="drop_down_select"
        onChange={selectChange}
      >
        <Option value="**default_value**" disabled>
          {placeholder}
        </Option>
        {responses &&
          responses[dropTargetIndex] &&
          responses[dropTargetIndex].map((response, respID) => (
            <Option value={response} key={respID}>
              {response}
            </Option>
          ))}
      </Select>
    </SelectWrapper>
  );
};

ChoicesBox.propTypes = {
  resprops: PropTypes.object,
  index: PropTypes.number.isRequired
};

ChoicesBox.defaultProps = {
  resprops: {}
};

export default ChoicesBox;
