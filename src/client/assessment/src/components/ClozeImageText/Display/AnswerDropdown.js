import PropTypes from 'prop-types';
import React from 'react';
import { Select } from 'antd';
import styled from 'styled-components';

const SelectContainer = styled.div`
  position: relative;
  width: 200px;
  display: flex;
  align-items: center;
  border: none;

  .ant-select {
    height: 40px;
    width: 100%;
    &::selection {
      background: transparent;
    }
  }
  .ant-select-selection {
    display: flex;
    align-items: center;
    padding-left: 10px;
    border: 1px solid;
    border-color: transparent;

    &:hover {
      border: 1px solid;
      border-color: transparent;
    }
  }
  .ant-select-selection-selected-value {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.2px;
    color: #434b5d;
  }
  .anticon-down {
    svg {
      fill: #00b0ff;
    }
  }
  @media (max-width: 760px) {
    height: 52px;
    width: 188px;
  }
`;

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
