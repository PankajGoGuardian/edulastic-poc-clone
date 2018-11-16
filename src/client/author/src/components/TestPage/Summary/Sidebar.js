import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FlexContainer } from '@edulastic/common';
import { white, greenDark, textColor } from '@edulastic/colors';

import { Input, Select } from 'antd';
import { IconHeart, IconShare } from '@edulastic/icons';
import { Title, Photo, selectsData } from '../common';

const Sidebar = ({
  title,
  description,
  onChangeField,
  tags,
  analytics,
  collections,
  createdBy
}) => (
  <FlexContainer flexDirection="column">
    <Block>
      <Photo />
      <FlexContainer>
        <Avatar>{createdBy.firstName ? createdBy.firstName[0] : 'E'}</Avatar>
        <FlexContainer flexDirection="column" alignItems="flex-start">
          <Title>Created by:</Title>
          <span>
            {createdBy.firstName} {createdBy.lastName}
          </span>
        </FlexContainer>
      </FlexContainer>
    </Block>
    <Block>
      <MainTitle>Assessment name</MainTitle>
      <Input
        value={title}
        onChange={e => onChangeField('title', e.target.value)}
        size="large"
        placeholder="Enter an assessment name"
        style={{ marginBottom: 40 }}
      />
      <MainTitle>Description</MainTitle>
      <Input.TextArea
        value={description}
        onChange={e => onChangeField('description', e.target.value)}
        size="large"
        placeholder="Enter a description"
        style={{ marginBottom: 40 }}
      />
      <MainTitle>Tags</MainTitle>
      <Select
        mode="multiple"
        size="large"
        style={{ width: '100%' }}
        placeholder="Please select"
        defaultValue={tags}
        onChange={value => onChangeField('tags', value)}
      >
        {selectsData.allTags.map(({ value, text }) => (
          <Select.Option key={value} value={value}>
            {text}
          </Select.Option>
        ))}
      </Select>
    </Block>
    <Block>
      <FlexContainer>
        <FlexContainer>
          <IconHeart color={greenDark} />
          <FlexContainer>
            <Title>Liked:</Title> <span>{analytics.likes} times</span>
          </FlexContainer>
        </FlexContainer>
        <FlexContainer>
          <IconShare color={greenDark} />
          <FlexContainer>
            <Title>Shared:</Title>{' '}
            <span>{analytics.usage} times, since July 5, 2016</span>
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
    </Block>
    <Block>
      <FlexContainer style={{ marginBottom: 10 }}>
        <MainTitle style={{ marginBottom: 0 }}>Collection:</MainTitle>{' '}
        <span>{collections}</span>
      </FlexContainer>
      <Select
        size="large"
        style={{ width: '50%' }}
        placeholder="Please select"
        defaultValue={collections}
        onChange={value => onChangeField('collections', value)}
      >
        {selectsData.allCollections.map(({ value, text }) => (
          <Select.Option key={value} value={value}>
            {text}
          </Select.Option>
        ))}
      </Select>
    </Block>
  </FlexContainer>
);

Sidebar.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  tags: PropTypes.array.isRequired,
  onChangeField: PropTypes.func.isRequired,
  analytics: PropTypes.object.isRequired,
  createdBy: PropTypes.object.isRequired,
  collections: PropTypes.string.isRequired
};

export default Sidebar;

const Block = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  border-bottom: 1px solid #dbdbdb;
  padding-bottom: 30px;
  margin-bottom: 25px;

  :last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const MainTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${textColor};
  margin-bottom: 10px;
`;

const Avatar = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  background: ${greenDark};
  color: ${white};
  font-size: 22px;
  font-weight: 700;
`;
