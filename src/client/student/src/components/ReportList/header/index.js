import React, { memo } from 'react';
import styled from 'styled-components';
import { white } from '@edulastic/colors';
import { Select, Button, Icon } from 'antd';
import HeaderWrapper from '../../../headerWrapper';

const options = [
  'Question 1/10',
  'Question 2/10',
  'Question 3/10',
  'Question 4/10'
];
const { Option } = Select;

const ReportListHeader = () => (
  <HeaderWrapper>
    <Title>Reports</Title>
    <QuestionSelect>
      <SelectBtn defaultValue="Question 1/10">
        {options.map((option, index) => (
          <Option key={index}> {option} </Option>
        ))}
      </SelectBtn>
      <ButtonLeft type="primary">
        <Icon type="left" />
      </ButtonLeft>
      <ButtonLeft type="primary">
        <Icon type="right" />
      </ButtonLeft>
    </QuestionSelect>
  </HeaderWrapper>
);

export default memo(ReportListHeader);

const Title = styled.h1`
  color: ${white};
  font-size: 22px;
  font-weight: bold;
  margin: 0;
  padding: 0;
`;

const ButtonLeft = styled(Button)`
  backgroundcolor: 'rgb(31,227,161)';
`;

const SelectBtn = styled(Select)`
  width: 60%;
`;

const QuestionSelect = styled.div`
  display: flex;
  width: 30%;
  justify-content: space-between;
`;
