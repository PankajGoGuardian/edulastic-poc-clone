import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FlexContainer } from '@edulastic/common';
import { white, greenDark, secondaryTextColor } from '@edulastic/colors';

import { Input, Select } from 'antd';
import { IconHeart, IconShare } from '@edulastic/icons';
import { Photo, selectsData } from '../common';

const Sidebar = ({
  title,
  description,
  onChangeField,
  tags,
  analytics,
  createdBy,
  windowWidth
}) => (
  <FlexContainer flexDirection="column">
    <Block>
      <Photo />
      <FlexContainer>
        <Avatar>
          {createdBy && createdBy.firstName ? createdBy.firstName[0] : 'E'}
        </Avatar>
        <FlexContainer
          flexDirection="column"
          alignItems="flex-start"
          style={{ marginLeft: 20 }}
        >
          <Title>Created by:</Title>
          <TitleContent>
            {createdBy && createdBy.firstName} {createdBy && createdBy.lastName}
          </TitleContent>
        </FlexContainer>
      </FlexContainer>
    </Block>
    <Block>
      <MainTitle>Assessment Name</MainTitle>
      <Input
        value={title}
        data-cy="inputTest"
        onChange={e => onChangeField('title', e.target.value)}
        size="large"
        placeholder="Enter an assessment name"
        style={{ marginBottom: 25 }}
      />
      <MainTitle>Description</MainTitle>
      <Input.TextArea
        value={description}
        onChange={e => onChangeField('description', e.target.value)}
        size="large"
        placeholder="Enter a description"
        style={{ marginBottom: 25 }}
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
      <FlexContainer
        justifyContent="space-between"
        alignItems={windowWidth < 468 && 'self-start'}
        style={{ flexDirection: windowWidth < 468 ? 'column' : 'row' }}
      >
        <FlexContainer style={{ marginBottom: 15 }}>
          <IconHeart color={greenDark} />
          <FlexContainer>
            <Title>Liked:</Title>
            <TitleContent>{analytics && analytics.likes} times</TitleContent>
          </FlexContainer>
        </FlexContainer>
        <FlexContainer style={{ marginBottom: 15 }}>
          <IconShare color={greenDark} />
          <FlexContainer>
            <Title>Shared:</Title>
            <TitleContent>
              {analytics && analytics.usage} times, since July 5, 2016
            </TitleContent>
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
      <FlexContainer>
        <IconHeart color={greenDark} />
        <FlexContainer>
          <Title>Collection:</Title>
          <TitleContent>Public Library</TitleContent>
        </FlexContainer>
      </FlexContainer>
    </Block>
    {/* <Block>
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
    </Block> */}
  </FlexContainer>
);

Sidebar.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  tags: PropTypes.array.isRequired,
  onChangeField: PropTypes.func.isRequired,
  analytics: PropTypes.array.isRequired,
  createdBy: PropTypes.object.isRequired,
  windowWidth: PropTypes.number.isRequired
  // collections: PropTypes.string.isRequired
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

  .ant-input {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.2px;
    color: #434b5d;
    padding-left: 20px;
  }

  .ant-select-selection__choice {
    height: 23px !important;
    border-radius: 5px;
    display: flex;
    align-items: center;
    background: #d1f0ff;
    margin-top: 7px !important;
  }

  .ant-select-selection__rendered {
    padding-left: 20px;
  }

  .ant-select-selection__choice__content {
    font-size: 11px;
    letter-spacing: 0.2px;
    color: #0083be;
    font-weight: bold;
    height: 23px;
    display: flex;
    align-items: center;
  }

  .ant-select-remove-icon svg {
    fill: #0083be;
  }

  textarea {
    height: 116px;
  }
`;

const MainTitle = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: ${secondaryTextColor};
  letter-spacing: 0.2px;
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

const Title = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #4aac8b;
  margin-right: 3px;
`;

const TitleContent = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #444444;
`;
