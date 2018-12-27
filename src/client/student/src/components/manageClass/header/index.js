import React, { memo } from 'react';
import styled from 'styled-components';
import { white } from '@edulastic/colors';
import { Select } from 'antd';
import HeaderWrapper from '../../../headerWrapper';

const options = ['ARCHIVE(0)', 'ARCHIVE(1)', 'ARCHIVE(2)', 'ARCHIVE(3)'];
const { Option } = Select;

const ManageClassHeader = () => (
  <HeaderWrapper>
    <Title>Manage Class</Title>
    <QuestionSelect>
      <FilterBtn>
        <span>Show</span>
      </FilterBtn>
      <SelectBtn defaultValue="Question 1/10">
        {options.map((option, index) => (
          <Option key={index}> {option} </Option>
        ))}
      </SelectBtn>
    </QuestionSelect>
  </HeaderWrapper>
);

export default memo(ManageClassHeader);

const Title = styled.h1`
  color: ${white};
  font-size: 22px;
  font-weight: bold;
  margin: 0;
  padding: 0;
`;

const SelectBtn = styled(Select)`
  width: 70%;
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
