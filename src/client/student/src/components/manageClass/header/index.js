import React, { memo } from 'react';
import styled from 'styled-components';
import { darkBlueSecondary, white } from '@edulastic/colors';
import { Affix, Select } from 'antd';

const options = ['ARCHIVE(0)', 'ARCHIVE(1)', 'ARCHIVE(2)', 'ARCHIVE(3)'];
const { Option } = Select;

const ManageClassHeader = () => (
  <Affix>
    <Container>
      <Title>Manage Class</Title>
      <QuestionSelect>
        <FilterBtn>
          <span>Show</span>
        </FilterBtn>
        <Select defaultValue="Question 1/10" style={{ width: '70%' }}>
          {options.map((option, index) => (
            <Option key={index}> {option} </Option>
          ))}
        </Select>
      </QuestionSelect>
    </Container>
  </Affix>
);

export default memo(ManageClassHeader);

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
const FilterBtn = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  & span {
    font-family: Open Sans;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 1px;
    color: #ffffff;
  }
`;
