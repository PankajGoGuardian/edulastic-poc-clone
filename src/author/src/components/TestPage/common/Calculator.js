import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { white } from '@edulastic/colors';
import { FlexContainer } from '@edulastic/common';
import { Select } from 'antd';

import Summary from './Summary';
import selectsData from './selectsData';
import Title from './Title';

const Calculator = ({
  totalPoints,
  questionsCount,
  grades,
  subjects,
  onChangeGrade,
  onChangeSubjects,
  tableData,
  children,
}) => (
  <Container>
    {children}

    <div>
      <Item>
        <Item>
          <Title>Grade</Title>
        </Item>
        <Select
          mode="multiple"
          size="large"
          style={{ width: '100%' }}
          placeholder="Please select"
          defaultValue={grades}
          onChange={onChangeGrade}
        >
          {selectsData.allGrades.map(({ value, text }) => (
            <Select.Option key={value} value={value}>
              {text}
            </Select.Option>
          ))}
        </Select>
      </Item>

      <Item>
        <Item>
          <Title>Subject</Title>
        </Item>
        <Select
          mode="multiple"
          size="large"
          style={{ width: '100%' }}
          placeholder="Please select"
          defaultValue={subjects}
          onChange={onChangeSubjects}
        >
          {selectsData.allSubjects.map(({ value, text }) => (
            <Select.Option key={value} value={value}>
              {text}
            </Select.Option>
          ))}
        </Select>
      </Item>

      <Item>
        <Title>Summary</Title>
      </Item>
      <Summary total={totalPoints} questionsCount={questionsCount} tableData={tableData} />
    </div>
  </Container>
);

Calculator.propTypes = {
  totalPoints: PropTypes.number.isRequired,
  grades: PropTypes.array.isRequired,
  subjects: PropTypes.array.isRequired,
  onChangeGrade: PropTypes.func.isRequired,
  onChangeSubjects: PropTypes.func.isRequired,
  tableData: PropTypes.array.isRequired,
  questionsCount: PropTypes.any.isRequired,
  children: PropTypes.any,
};

Calculator.defaultProps = {
  children: null,
};

export default Calculator;

const Container = styled.div`
  padding: 15px;
  background: ${white};
`;

const Item = styled(FlexContainer)`
  margin-bottom: 15px;
  flex-direction: column;
  align-items: flex-start;
`;
