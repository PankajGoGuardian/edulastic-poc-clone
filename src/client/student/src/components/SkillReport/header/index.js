import React, { memo } from 'react';
import styled from 'styled-components';
import { Select } from 'antd';
import AssignmentSelectClass from '../../commonStyle/assignmentSelectClass';
import AssignmentTitle from '../../assignments/common/assignmentTitle';
import HeaderWrapper from '../../../headerWrapper';

const options = ['FFC1', 'FFC2', 'FFC3', 'FFC4', 'FFC5', 'FFC6'];
const { Option } = Select;

const AssignmentSelect = () => (
  <AssignmentSelectClass>
    <ClassLabel>Class</ClassLabel>
    <Select defaultValue="FFC1">
      {options.map((option, i) => (
        <Option key={i} value={option}>
          {option}
        </Option>
      ))}
    </Select>
  </AssignmentSelectClass>
);

const SkillReportHeader = () => (
  <HeaderWrapper>
    <AssignmentTitle>Skill Report</AssignmentTitle>
    <AssignmentSelect />
  </HeaderWrapper>
);

export default memo(SkillReportHeader);

const ClassLabel = styled.span`
  display: flex;
  font-size: 13px;
  font-weight: 600;
  margin-right: 30px;
  align-items: center;
  letter-spacing: 0.2px;

  @media (max-width: 768px) {
    width: 65px;
  }
`;
