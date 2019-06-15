import React from "react";
import PropTypes from "prop-types";
import { find } from "lodash";
import styled from "styled-components";
import { Select } from "antd";

const { Option } = Select;

const SelectWrapper = styled.span`
  margin: 0px 4px;
  display: flex;
`;

const ChoicesBox = ({ resprops, id }) => {
  const { userAnswers, btnStyle, placeholder, options, onChange: changeAnswers, item } = resprops;
  if (!id) return null;
  const { response_ids } = item;
  const { index } = find(response_ids, response => response.id === id);
  const userAnswer = find(userAnswers, answer => (answer ? answer.id : "") === id);

  const selectChange = val => {
    if (changeAnswers) {
      changeAnswers(val, index, id);
    }
  };

  return (
    <SelectWrapper>
      <Select
        value={userAnswer ? userAnswer.value : ""}
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
        {options &&
          options[id] &&
          options[id].map((response, respID) => (
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
  id: PropTypes.string.isRequired
};

ChoicesBox.defaultProps = {
  resprops: {}
};

export default ChoicesBox;
