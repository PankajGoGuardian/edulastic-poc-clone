import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { white, greenDark, green } from '@edulastic/colors';
import { FlexContainer } from '@edulastic/common';
import { IconPensilEdit, IconCheck } from '@edulastic/icons';
import { Select } from 'antd';

import Photo from '../common/Photo';
import Summary from './Summary';

const allGrades = [
  { value: 'k', text: 'Kindergarten' },
  { value: '1', text: 'Grade 1' },
  { value: '2', text: 'Grade 2' },
  { value: '3', text: 'Grade 3' },
  { value: '4', text: 'Grade 4' },
  { value: '5', text: 'Grade 5' },
  { value: '6', text: 'Grade 6' },
  { value: '7', text: 'Grade 7' },
  { value: '8', text: 'Grade 8' },
  { value: '9', text: 'Grade 9' },
  { value: '10', text: 'Grade 10' },
  { value: '11', text: 'Grade 11' },
  { value: '12', text: 'Grade 12' },
  { value: 'other', text: 'Other' },
];

const allSubjects = [
  { value: 'Mathematics', text: 'Mathematics' },
  { value: 'ELA', text: 'ELA' },
  { value: 'Science', text: 'Science' },
  { value: 'Social Studies', text: 'Social Studies' },
  { value: 'Other Subjects', text: 'Other Subjects' },
];

const Calculator = ({
  total,
  grades,
  subjects,
  onChangeGrade,
  onChangeSubjects,
  thumbnail,
  tableData,
}) => {
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
      <Photo url={thumbnail} />

      <Main>
        <Item>
          <FlexContainer>
            <Title>Grade:</Title>
            {!showEditGrade && (
              <Fragment>
                <span>{grades.join(', ')}</span>
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
                onChange={onChangeGrade}
                defaultValue={grades}
              >
                {allGrades.map(({ value, text }) => (
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
                <span>{subjects.join(', ')}</span>
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
                onChange={onChangeSubjects}
                defaultValue={subjects}
              >
                {allSubjects.map(({ value, text }) => (
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
        <Summary total={total} tableData={tableData} />
      </Main>
    </Container>
  );
};

Calculator.propTypes = {
  total: PropTypes.string.isRequired,
  grades: PropTypes.array.isRequired,
  subjects: PropTypes.array.isRequired,
  onChangeGrade: PropTypes.func.isRequired,
  onChangeSubjects: PropTypes.func.isRequired,
  thumbnail: PropTypes.string.isRequired,
  tableData: PropTypes.array.isRequired,
};

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
