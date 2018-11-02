import React from 'react';
import styled from 'styled-components';
import { greenDark, darkBlue, blue, mainTextColor } from '@edulastic/colors';
import PropTypes from 'prop-types';
import { FlexContainer } from '@edulastic/common';
import { Select } from 'antd';

const subjects = [{ value: 'sub1', text: 'Sub1' }, { value: 'sub2', text: 'Sub2' }];
const subjects2 = [{ value: 'all', text: 'All subjects' }, { value: 'sub1', text: 'Sub1' }];
const standardSets = [{ value: 'all', text: 'All standard set' }, { value: 'sub1', text: 'Sub1' }];
const collections = [{ value: 'all', text: 'All collections' }, { value: 'sub1', text: 'Sub1' }];
const questionTypes = [{ value: 'all', text: 'All types' }, { value: 'sub1', text: 'Sub1' }];
const knowledges = [
  { value: 'all', text: 'All depth of knowledge' },
  { value: 'sub1', text: 'Sub1' },
];
const difficulties = [{ value: 'all', text: 'All levels' }, { value: 'sub1', text: 'Sub1' }];

const TestFilters = ({ children, onChange }) => (
  <Container>
    <FlexContainer justifyContent="space-between" style={{ marginBottom: 15 }}>
      <Title>Filters</Title>
      <ClearAll>Clear all</ClearAll>
    </FlexContainer>
    {children}
    <SubTitle>Subject</SubTitle>
    <Select
      mode="multiple"
      style={{ width: '100%' }}
      size="large"
      placeholder="Please select"
      defaultValue={['sub1']}
      onChange={value => onChange('subject', value)}
    >
      {subjects.map(({ value, text }) => (
        <Select.Option value={value} key={value}>
          {text}
        </Select.Option>
      ))}
    </Select>

    <SubTitle>Subject</SubTitle>
    <Select
      size="large"
      style={{ width: '100%' }}
      defaultValue="all"
      onChange={value => onChange('subject2', value)}
    >
      {subjects2.map(({ value, text }) => (
        <Select.Option key={value} value={value}>
          {text}
        </Select.Option>
      ))}
    </Select>

    <SubTitle>Standard Set</SubTitle>
    <Select
      size="large"
      style={{ width: '100%' }}
      defaultValue="all"
      onChange={value => onChange('standardSet', value)}
    >
      {standardSets.map(({ value, text }) => (
        <Select.Option key={value} value={value}>
          {text}
        </Select.Option>
      ))}
    </Select>

    <SubTitle>Collection</SubTitle>
    <Select
      size="large"
      style={{ width: '100%' }}
      defaultValue="all"
      onChange={value => onChange('collection', value)}
    >
      {collections.map(({ value, text }) => (
        <Select.Option key={value} value={value}>
          {text}
        </Select.Option>
      ))}
    </Select>

    <SubTitle>Question Types</SubTitle>
    <Select
      size="large"
      style={{ width: '100%' }}
      defaultValue="all"
      onChange={value => onChange('questionType', value)}
    >
      {questionTypes.map(({ value, text }) => (
        <Select.Option key={value} value={value}>
          {text}
        </Select.Option>
      ))}
    </Select>

    <SubTitle>Depth of Knowledge</SubTitle>
    <Select
      size="large"
      style={{ width: '100%' }}
      defaultValue="all"
      onChange={value => onChange('knowledge', value)}
    >
      {knowledges.map(({ value, text }) => (
        <Select.Option key={value} value={value}>
          {text}
        </Select.Option>
      ))}
    </Select>

    <SubTitle>Difficulty</SubTitle>
    <Select
      size="large"
      style={{ width: '100%' }}
      defaultValue="all"
      onChange={value => onChange('difficulty', value)}
    >
      {difficulties.map(({ value, text }) => (
        <Select.Option key={value} value={value}>
          {text}
        </Select.Option>
      ))}
    </Select>
  </Container>
);

TestFilters.propTypes = {
  children: PropTypes.any,
  onChange: PropTypes.func.isRequired,
};

TestFilters.defaultProps = {
  children: null,
};

export default TestFilters;

const Container = styled.div`
  padding: 15px 0;
`;

const Title = styled.span`
  color: ${greenDark};
  font-size: 16px;
`;

const ClearAll = styled.span`
  color: ${darkBlue};
  font-size: 16px;
  cursor: pointer;

  :hover {
    color: ${blue};
  }
`;

const SubTitle = styled.div`
  margin: 15px 0;
  color: ${mainTextColor};
  font-size: 16px;
`;
