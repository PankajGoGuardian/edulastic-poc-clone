import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Select, Icon } from 'antd';
import { blue } from '@edulastic/colors';
import { questionType as questionTypes } from '@edulastic/constants';
import selectsData from '../TestPage/common/selectsData';

class Search extends Component {
  render() {
    const {
      search: {
        grades,
        subject,
        curriculumId,
        standardIds,
        questionType,
        depthOfKnowledge,
        authorDifficulty
      },
      curriculums,
      onSearchFieldChange,
      curriculumStandards,
      onStandardSearch
    } = this.props;
    const isStandardsDisabled = !curriculumId;
    const standardsPlaceholder = isStandardsDisabled ?
      'Available with Curriculum' : 'Type to Search, for example "k.cc"';
    return (
      <MainFilterItems>
        <Item>
          <ItemHeader>Grades</ItemHeader>
          <ItemBody>
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="All Grades"
              value={grades}
              onChange={onSearchFieldChange('grades')}
            >
              { selectsData.allGrades.map(el => (
                <Select.Option key={el.value} value={el.value}>{el.text}</Select.Option>
              ))}
            </Select>
          </ItemBody>
        </Item>
        <Item>
          <ItemHeader>Subject</ItemHeader>
          <ItemBody>
            <Select
              style={{ width: '100%' }}
              onSelect={onSearchFieldChange('subject')}
              value={subject}
              suffixIcon={
                <Icon type="caret-down" style={{ color: blue, fontSize: 16, marginRight: 5 }} />
              }
            >
              { selectsData.allSubjects.map(el => (
                <Select.Option key={el.value} value={el.value}>{el.text}</Select.Option>
              )) }
            </Select>
          </ItemBody>
        </Item>
        <Item>
          <ItemHeader>Curriculum</ItemHeader>
          <ItemBody>
            <Select
              style={{ width: '100%' }}
              onSelect={onSearchFieldChange('curriculumId')}
              value={curriculumId}
              suffixIcon={
                <Icon type="caret-down" style={{ color: blue, fontSize: 16, marginRight: 5 }} />
              }
            >
              <Select.Option key="" value="">All Curriculums</Select.Option>
              { curriculums.map(el => (
                <Select.Option key={el._id} value={el._id}>{el.curriculum}</Select.Option>
              )) }
            </Select>
          </ItemBody>
        </Item>
        <Item>
          <ItemHeader>Standards</ItemHeader>
          <ItemBody>
            <Select
              style={{ width: '100%' }}
              onSearch={onStandardSearch}
              mode="multiple"
              placeholder={standardsPlaceholder}
              onChange={onSearchFieldChange('standardIds')}
              filterOption={false}
              value={standardIds}
              disabled={isStandardsDisabled}
              suffixIcon={
                <Icon type="caret-down" style={{ color: blue, fontSize: 16, marginRight: 5 }} />
              }
            >
              { curriculumStandards.map(el => (
                <Select.Option key={el.identifier} value={el.identifier}>
                  {`${el.identifier}: ${el.description}`}
                </Select.Option>
              )) }
            </Select>
          </ItemBody>
        </Item>
        <Item>
          <ItemHeader>Question Type</ItemHeader>
          <ItemBody>
            <Select
              style={{ width: '100%' }}
              onSelect={onSearchFieldChange('questionType')}
              value={questionType}
              suffixIcon={
                <Icon type="caret-down" style={{ color: blue, fontSize: 16, marginRight: 5 }} />
              }
            >
              { questionTypes.selectsData.map(el => (
                <Select.Option key={el.value} value={el.value}>{el.text}</Select.Option>
              )) }
            </Select>
          </ItemBody>
        </Item>
        <Item>
          <ItemHeader>Depth of Knowledge</ItemHeader>
          <ItemBody>
            <Select
              style={{ width: '100%' }}
              onSelect={onSearchFieldChange('depthOfKnowledge')}
              value={depthOfKnowledge}
              suffixIcon={
                <Icon type="caret-down" style={{ color: blue, fontSize: 16, marginRight: 5 }} />
              }
            >
              { selectsData.allDepthOfKnowledge.map(el => (
                <Select.Option key={el.value} value={el.value}>{el.text}</Select.Option>
              )) }
            </Select>
          </ItemBody>
        </Item>
        <Item>
          <ItemHeader>Difficulty</ItemHeader>
          <ItemBody>
            <Select
              style={{ width: '100%' }}
              onSelect={onSearchFieldChange('authorDifficulty')}
              value={authorDifficulty}
              suffixIcon={
                <Icon type="caret-down" style={{ color: blue, fontSize: 16, marginRight: 5 }} />
              }
            >
              { selectsData.allAuthorDifficulty.map(el => (
                <Select.Option key={el.value} value={el.value}>{el.text}</Select.Option>
              )) }
            </Select>
          </ItemBody>
        </Item>
        <Item>
          <ItemHeader>Author</ItemHeader>
          <ItemBody>
            <Select
              style={{ width: '100%' }}
              defaultValue="All Authors"
              suffixIcon={
                <Icon type="caret-down" style={{ color: blue, fontSize: 16, marginRight: 5 }} />
              }
            >
              <Select.Option value="">All Authors</Select.Option>
              <Select.Option value="author1">Author 1</Select.Option>
              <Select.Option value="author2">Author 2</Select.Option>
            </Select>
          </ItemBody>
        </Item>
        <Item>
          <ItemHeader>Owner</ItemHeader>
          <ItemBody>
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="All Owners"
              defaultValue={[]}
            >
              <Select.Option value="owner1">Owner 1</Select.Option>
              <Select.Option value="owner2">Owner 2</Select.Option>
              <Select.Option value="owner3">Owner 3</Select.Option>
            </Select>
          </ItemBody>
        </Item>
      </MainFilterItems>
    );
  }
}

Search.propTypes = {
  search: PropTypes.object.isRequired,
  curriculums: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    curriculum: PropTypes.string.isRequired,
    grades: PropTypes.array.isRequired,
    subject: PropTypes.string.isRequired
  })).isRequired,
  onSearchFieldChange: PropTypes.func.isRequired,
  curriculumStandards: PropTypes.array.isRequired,
  onStandardSearch: PropTypes.func.isRequired
};

export default Search;

const MainFilterItems = styled.div`
  margin-top: 4px;
`;

const Item = styled.div`
  margin-top: 13px;
`;

const ItemHeader = styled.span`
  font-size: 13px;
  color: #757d8e;
  font-weight: 600;
  letter-spacing: 0.2px;
`;

const ItemBody = styled.div`
  margin-top: 11px;
  height: 40px;

  .ant-select-selection {
    height: 40px;
    background: transparent;
    padding-top: 4px;
  }

  .ant-select-selection__choice {
    border-radius: 5px;
    border: solid 1px #444444;
  }

  .ant-select-selection__choice__content {
    font-size: 9px;
    font-weight: bold;
    color: #434b5d;
  }

  .ant-select-selection-selected-value {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.2px;
    color: #434b5d;
  }

  .ant-select-selection__rendered {
    margin-left: 22px;
  }

  .ant-select-arrow-icon {
    color: ${blue};
  }
`;
