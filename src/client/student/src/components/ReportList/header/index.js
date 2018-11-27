import React, { memo } from 'react';
import styled from 'styled-components';
import { darkBlueSecondary, white } from '@edulastic/colors';
import { Affix, Select, Button, Icon } from 'antd';

const options = [
  'Question 1/10',
  'Question 2/10',
  'Question 3/10',
  'Question 4/10'
];
const { Option } = Select;

const ReportListHeader = () => (
  <Affix>
    <Container>
      <Title>Reports</Title>
      <QuestionSelect>
        <Select defaultValue="Question 1/10" style={{ width: '60%' }}>
          {options.map((option, index) => (
            <Option key={index}> {option} </Option>
          ))}
        </Select>
        <Button type="primary" style={{ backgroundColor: 'rgb(31,227,161)' }}>
          <Icon type="left" />
        </Button>
        <Button type="primary" style={{ backgroundColor: 'rgb(31,227,161)' }}>
          <Icon type="right" />
        </Button>
      </QuestionSelect>
    </Container>
  </Affix>
);

export default memo(ReportListHeader);

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

const QuestionSelect = styled.div`
  display: flex;
  width: 30%;
  justify-content: space-between;
`;
