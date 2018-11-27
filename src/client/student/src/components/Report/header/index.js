import React, { memo } from 'react';
import styled from 'styled-components';
import { IconCaretDown } from '@edulastic/icons';
import { darkBlueSecondary, white } from '@edulastic/colors';
import { Affix } from 'antd';
import ClassLabel from '../../commonStyle/classLabel';
import AssignmentSelectClass from '../../commonStyle/assignmentSelectClass';
import SelectStyle from '../../commonStyle/selectStyle';

const options = ['FFC1', 'FFC2', 'FFC3', 'FFC4', 'FFC5', 'FFC6'];

const AssignmentSelect = () => (
  <AssignmentSelectClass>
    <ClassLabel>class</ClassLabel>
    <SelectStyle>
      {options.map((option, index) => (
        <option key={index}> {option} </option>
      ))}
    </SelectStyle>
    <Icon />
  </AssignmentSelectClass>
);

const ReportHeader = () => (
  <Affix>
    <Container>
      <Title>Reports</Title>
      <AssignmentSelect />
    </Container>
  </Affix>
);

export default memo(ReportHeader);

const Container = styled.div`
  height: 89px;
  padding: 0px 40px;
  background: ${darkBlueSecondary};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  color: ${white};
  font-size: 22px;
  font-weight: bold;
  margin: 0;
  padding: 0;
`;
const Icon = styled(IconCaretDown)`
  position: absolute;
  left: 11rem;
  top: 0.9rem;
  fill: #12a6e8;
  width: 11px !important;
  height: 11px !important;

  @media (max-width: 900px) {
    left: 10.5rem;
    top: 1.05rem;
  }
  @media (max-width: 425px) {
    left: 8.5rem;
    top: 1.05rem;
  }
  @media (max-width: 320px) {
    left: 8rem;
    top: 1.05rem;
  }
`;
