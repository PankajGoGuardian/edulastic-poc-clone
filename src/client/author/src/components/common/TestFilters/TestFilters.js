import React from 'react';
import styled from 'styled-components';
import { blue, secondaryTextColor } from '@edulastic/colors';
import PropTypes from 'prop-types';
import { FlexContainer } from '@edulastic/common';
import { Select } from 'antd';

const subjects = [
  { value: 'sub1', text: 'Sub1' },
  { value: 'sub2', text: 'Sub2' }
];
const subjects2 = [
  { value: 'all', text: 'All subjects' },
  { value: 'sub1', text: 'Sub1' }
];
const standardSets = [
  { value: 'all', text: 'All standard set' },
  { value: 'sub1', text: 'Sub1' }
];
const collections = [
  { value: 'all', text: 'All collections' },
  { value: 'sub1', text: 'Sub1' }
];
const questionTypes = [
  { value: 'all', text: 'All types' },
  { value: 'sub1', text: 'Sub1' }
];
const knowledges = [
  { value: 'all', text: 'All depth of knowledge' },
  { value: 'sub1', text: 'Sub1' }
];
const difficulties = [
  { value: 'all', text: 'All levels' },
  { value: 'sub1', text: 'Sub1' }
];

const TestFilters = ({ children, onChange, style }) => (
  <Container style={style}>
    <FlexContainer justifyContent="space-between" style={{ marginBottom: 26 }}>
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
      onChange={value => onChange('collections', value)}
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
  style: PropTypes.object,
};

TestFilters.defaultProps = {
  children: null,
  style: {},
};

export default TestFilters;

const Container = styled.div`
  padding: 27px 0;

  .ant-select-selection {
    background: transparent;
  }

  .ant-select-lg {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.2px;
    color: #434b5d;
  }

  .ant-select-selection__rendered {
    margin-left: 26px;
  }

  .ant-select-selection__choice {
    border-radius: 5px;
    border: solid 1px #c8e8f6;
    background-color: #c8e8f6;
    height: 23.5px;
  }

  .ant-select-selection__choice__content {
    font-size: 10px;
    font-weight: bold;
    letter-spacing: 0.2px;
    color: #0083be;
    opacity: 1;
  }

  .ant-select-remove-icon {
    svg {
      fill: #0083be;
    }
  }

  .ant-select-arrow-icon {
    font-size: 14px;
    svg {
      fill: #00b0ff;
    }
  }
`;

const Title = styled.span`
  color: #4aac8b;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.3px;
`;

const ClearAll = styled.span`
  color: #00b0ff;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;

  :hover {
    color: ${blue};
  }
`;

const SubTitle = styled.div`
  margin: 12px 0;
  color: ${secondaryTextColor};
  font-size: 13px;
  font-weight: 600;
`;
