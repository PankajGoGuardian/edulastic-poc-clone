import React, { useState, Fragment } from 'react';
// import PropTypes from 'prop-types';
import styled from 'styled-components';
import { white, greenDark, green } from '@edulastic/colors';
import { FlexContainer } from '@edulastic/common';
import { IconPensilEdit, IconCheck } from '@edulastic/icons';
import { Select } from 'antd';

import Photo from '../common/Photo';
import Summary from './Summary';

const grades = [
  { value: 'kindergarten', text: 'Kindergarten' },
  { value: 'grade1', text: 'Grade 1' },
  { value: 'grade2', text: 'Grade 2' },
  { value: 'grade3', text: 'Grade 3' },
  { value: 'grade4', text: 'Grade 4' },
  { value: 'grade5', text: 'Grade 5' },
  { value: 'grade6', text: 'Grade 6' },
  { value: 'grade7', text: 'Grade 7' },
  { value: 'grade8', text: 'Grade 8' },
  { value: 'grade9', text: 'Grade 9' },
  { value: 'grade10', text: 'Grade 10' },
  { value: 'grade11', text: 'Grade 11' },
  { value: 'grade12', text: 'Grade 12' },
  { value: 'other', text: 'Other' },
];

const subjects = [
  { value: 'mathematics', text: 'Mathematics' },
  { value: 'ela', text: 'ELA' },
  { value: 'science', text: 'Science' },
  { value: 'socialStudies', text: 'Social Studies' },
  { value: 'other', text: 'Other Subjects' },
];

const Calculator = () => {
  const [showEditGrade, setShowEditGrade] = useState(false);
  const [showEditSubject, setShowEditSubject] = useState(false);

  const handleToggleGrade = () => {
    setShowEditGrade(!showEditGrade);
  };

  const handleToggleSubject = () => {
    setShowEditSubject(!showEditSubject);
  };

  return (
    <Container>
      <Photo />

      <Main>
        <Item>
          <FlexContainer>
            <Title>Grade:</Title>
            {!showEditGrade && (
              <Fragment>
                <span>7.8</span>
                <IconPensilEdit
                  color={greenDark}
                  hoverColor={green}
                  style={{ cursor: 'pointer' }}
                  onClick={handleToggleGrade}
                />
              </Fragment>
            )}
          </FlexContainer>

          {showEditGrade && (
            <Fragment>
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="Please select grades"
                defaultValue={['grade1', 'grade2']}
              >
                {grades.map(({ value, text }) => (
                  <Select.Option key={value}>{text}</Select.Option>
                ))}
              </Select>
              <IconCheck
                color={greenDark}
                hoverColor={green}
                style={{ cursor: 'pointer' }}
                onClick={handleToggleGrade}
              />
            </Fragment>
          )}
        </Item>

        <Item>
          <FlexContainer>
            <Title>Subject:</Title>
            {!showEditSubject && (
              <Fragment>
                <span>Mathematics, Other</span>
                <IconPensilEdit
                  color={greenDark}
                  hoverColor={green}
                  style={{ cursor: 'pointer' }}
                  onClick={handleToggleSubject}
                />
              </Fragment>
            )}
          </FlexContainer>

          {showEditSubject && (
            <Fragment>
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="Please select subjects"
                defaultValue={['mathematics', 'other']}
              >
                {subjects.map(({ value, text }) => (
                  <Select.Option key={value}>{text}</Select.Option>
                ))}
              </Select>
              <IconCheck
                color={greenDark}
                hoverColor={green}
                style={{ cursor: 'pointer' }}
                onClick={handleToggleSubject}
              />
            </Fragment>
          )}
        </Item>

        <Item>
          <Title>Summary</Title>
        </Item>
        <Summary />
      </Main>
    </Container>
  );
};

Calculator.propTypes = {};

export default Calculator;

const Main = styled.div`
  margin-top: 40px;
`;

const Container = styled.div`
  padding: 15px;
  background: ${white};
`;

const Item = styled(FlexContainer)`
  margin-bottom: 15px;
`;

const Title = styled.span`
  color: ${greenDark};
`;
