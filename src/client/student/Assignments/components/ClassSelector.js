import React from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// TODO: remove static data
const options = ['FFC1', 'FFC2', 'FFC3', 'FFC4', 'FFC5', 'FFC6'];

const ClassSelector = ({ t }) => (
  <AssignmentSelectClass>
    <ClassLabel>{t('common.classLabel')}</ClassLabel>
    <Select defaultValue="FFC1">
      {options.map((option, i) => (
        <Select.Option key={i} value={option}>
          {option}
        </Select.Option>
      ))}
    </Select>
  </AssignmentSelectClass>
);

ClassSelector.propTypes = {
  t: PropTypes.func.isRequired
};

export default React.memo(ClassSelector);

const ClassLabel = styled.span`
  display: flex;
  font-size: ${props => props.theme.headerClassTitleFontSize};
  color: ${props => props.theme.headerClassTitleColor};
  font-weight: 600;
  margin-right: 30px;
  align-items: center;
  letter-spacing: 0.2px;

  @media (max-width: 768px) {
    width: 65px;
    width: auto;
    margin-right: 10px;
  }
`;

const AssignmentSelectClass = styled.div`
  display: flex;

  .ant-select {
    height: 40px;
    width: 240px;
  }
  .ant-select-selection {
    border: 0px;
    background-color: ${props => props.theme.headerDropdownBgColor};
    color: ${props => props.theme.headerDropdownTextColor};
    font-size: ${props => props.theme.headerDropdownFontSize};
  }
  .ant-select-selection__rendered {
    height: 100%;
    align-items: center;
    display: flex !important;
    padding-left: 10px;
  }
  .anticon-down {
    svg {
      fill: ${props => props.theme.headerDropdownTextColor};
    }
  }
  @media (max-width: 768px) {
    padding-top: 10px;
    width: 100%;
    .ant-select {
      height: 32px;
      flex: 1;
      margin-right: 26px;
      margin-left: 20px;
    }
  }
`;
