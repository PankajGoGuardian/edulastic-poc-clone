import PropTypes from 'prop-types';
import React from 'react';
import { Select } from 'antd';

import { SelectContainer } from './styled/SelectContainer';

const AnswerDropdown = ({ style, onChange, options, defaultValue }) => (
  <SelectContainer style={style}>
    <Select
      defaultValue={defaultValue}
      onChange={(value) => {
        onChange(value);
      }}
    >
      {options.map((item, index) => (
        <Select.Option key={index} value={item.value}>
          {item.label}
        </Select.Option>
      ))}
    </Select>
  </SelectContainer>
);

AnswerDropdown.propTypes = {
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  defaultValue: PropTypes.string,
  style: PropTypes.object.isRequired
};

AnswerDropdown.defaultProps = {
  defaultValue: ''
};

export default AnswerDropdown;
