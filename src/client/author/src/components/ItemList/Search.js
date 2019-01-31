import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Select, Icon } from 'antd';
import { blue, secondaryTextColor, mainTextColor } from '@edulastic/colors';
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
    const standardsPlaceholder = isStandardsDisabled
      ? 'Available with Curriculum'
      : 'Type to Search, for example "k.cc"';
    return (
      <MainFilterItems>
        <Item>
          <ItemHeader>Grades</ItemHeader>
          <ItemBody>
            <DropDown
              mode="multiple"
              placeholder="All Grades"
              value={grades}
              onChange={onSearchFieldChange('grades')}
            >
              {selectsData.allGrades.map(el => (
                <Select.Option key={el.value} value={el.value}>
                  {el.text}
                </Select.Option>
              ))}
            </DropDown>
          </ItemBody>
        </Item>
        <Item>
          <ItemHeader>Subject</ItemHeader>
          <ItemBody>
            <DropDown
              onSelect={onSearchFieldChange('subject')}
              value={subject}
              suffixIcon={<IconCaret type="caret-down" />}
            >
              {selectsData.allSubjects.map(el => (
                <Select.Option key={el.value} value={el.value}>
                  {el.text}
                </Select.Option>
              ))}
            </DropDown>
          </ItemBody>
        </Item>
        <Item>
          <ItemHeader>Curriculum</ItemHeader>
          <ItemBody>
            <DropDown
              onSelect={onSearchFieldChange('curriculumId')}
              value={curriculumId}
              suffixIcon={<IconCaret type="caret-down" />}
            >
              <Select.Option key="" value="">
                All Curriculums
              </Select.Option>
              {curriculums.map(el => (
                <Select.Option key={el._id} value={el._id}>
                  {el.curriculum}
                </Select.Option>
              ))}
            </DropDown>
          </ItemBody>
        </Item>
        <Item>
          <ItemHeader>Standards</ItemHeader>
          <ItemBody>
            <DropDown
              onSearch={onStandardSearch}
              mode="multiple"
              placeholder={standardsPlaceholder}
              onChange={onSearchFieldChange('standardIds')}
              filterOption={false}
              value={standardIds}
              disabled={isStandardsDisabled}
              suffixIcon={<IconCaret type="caret-down" />}
            >
              {curriculumStandards.map(el => (
                <Select.Option key={el.identifier} value={el.identifier}>
                  {`${el.identifier}: ${el.description}`}
                </Select.Option>
              ))}
            </DropDown>
          </ItemBody>
        </Item>
        <Item>
          <ItemHeader>Question Type</ItemHeader>
          <ItemBody>
            <DropDown
              onSelect={onSearchFieldChange('questionType')}
              value={questionType}
              suffixIcon={<IconCaret type="caret-down" />}
            >
              {questionTypes.selectsData.map(el => (
                <Select.Option key={el.value} value={el.value}>
                  {el.text}
                </Select.Option>
              ))}
            </DropDown>
          </ItemBody>
        </Item>
        <Item>
          <ItemHeader>Depth of Knowledge</ItemHeader>
          <ItemBody>
            <DropDown
              onSelect={onSearchFieldChange('depthOfKnowledge')}
              value={depthOfKnowledge}
              suffixIcon={<IconCaret type="caret-down" />}
            >
              {selectsData.allDepthOfKnowledge.map(el => (
                <Select.Option key={el.value} value={el.value}>
                  {el.text}
                </Select.Option>
              ))}
            </DropDown>
          </ItemBody>
        </Item>
        <Item>
          <ItemHeader>Difficulty</ItemHeader>
          <ItemBody>
            <DropDown
              onSelect={onSearchFieldChange('authorDifficulty')}
              value={authorDifficulty}
              suffixIcon={<IconCaret type="caret-down" />}
            >
              {selectsData.allAuthorDifficulty.map(el => (
                <Select.Option key={el.value} value={el.value}>
                  {el.text}
                </Select.Option>
              ))}
            </DropDown>
          </ItemBody>
        </Item>
        <Item>
          <ItemHeader>Author</ItemHeader>
          <ItemBody>
            <DropDown
              defaultValue="All Authors"
              suffixIcon={<IconCaret type="caret-down" />}
            >
              <Select.Option value="">All Authors</Select.Option>
              <Select.Option value="author1">Author 1</Select.Option>
              <Select.Option value="author2">Author 2</Select.Option>
            </DropDown>
          </ItemBody>
        </Item>
        <Item>
          <ItemHeader>Owner</ItemHeader>
          <ItemBody>
            <DropDown
              mode="multiple"
              placeholder="All Owners"
              defaultValue={[]}
            >
              <Select.Option value="owner1">Owner 1</Select.Option>
              <Select.Option value="owner2">Owner 2</Select.Option>
              <Select.Option value="owner3">Owner 3</Select.Option>
            </DropDown>
          </ItemBody>
        </Item>
      </MainFilterItems>
    );
  }
}

Search.propTypes = {
  search: PropTypes.object.isRequired,
  curriculums: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      curriculum: PropTypes.string.isRequired,
      grades: PropTypes.array.isRequired,
      subject: PropTypes.string.isRequired
    })
  ).isRequired,
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
  color: ${secondaryTextColor};
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
    border: solid 1px ${mainTextColor};
  }

  .ant-select-selection__choice__content {
    font-size: 9px;
    font-weight: bold;
    color: ${secondaryTextColor};
  }

  .ant-select-selection-selected-value {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.2px;
    color: ${secondaryTextColor};
  }

  .ant-select-selection__rendered {
    margin-left: 22px;
  }

  .ant-select-arrow-icon {
    color: ${blue};
  }
`;

const DropDown = styled(Select)`
  width: 100%;
`;

const IconCaret = styled(Icon)`
  color: ${blue};
  font-size: 16px;
  margin-right: 5px;
`;
