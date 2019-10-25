import React, { useState } from "react";
import PropTypes from "prop-types";
import { Select, message } from "antd";
import { uniqBy } from "lodash";

import { FlexContainer } from "@edulastic/common";

import { selectsData } from "../../../common";
import { SummaryInput, SummarySelect, SummaryTextArea } from "../../common/SummaryForm";
import { Block, MainTitle, MetaTitle, AnalyticsItem, ErrorWrapper } from "./styled";

import SummaryHeader from "../SummaryHeader/SummaryHeader";
import { tagsApi } from "@edulastic/api";

export const renderAnalytics = (title, Icon) => (
  <AnalyticsItem>
    <Icon color="#bbbfc4" width={20} height={20} />
    <MetaTitle>{title}</MetaTitle>
  </AnalyticsItem>
);

const Sidebar = ({
  title,
  subjects,
  onChangeSubjects,
  onChangeField,
  tags = [],
  owner,
  analytics,
  grades,
  onChangeGrade,
  description,
  createdBy,
  thumbnail,
  addNewTag,
  allTagsData,
  windowWidth,
  isEditable
}) => {
  const newAllTagsData = uniqBy([...allTagsData, ...tags], "tagName");
  const subjectsList = selectsData.allSubjects.slice(1);
  const [searchValue, setSearchValue] = useState("");
  const selectTags = async id => {
    let newTag = {};
    if (id === searchValue) {
      const tempSearchValue = searchValue;
      setSearchValue("");
      try {
        const { _id, tagName } = await tagsApi.create({
          tagName: tempSearchValue,
          tagType: "test"
        });
        newTag = { _id, tagName };
        addNewTag({ tag: newTag, tagType: "test" });
      } catch (e) {
        message.error("Saving tag failed");
      }
    } else {
      newTag = newAllTagsData.find(tag => tag._id === id);
    }
    const newTags = [...tags, newTag];
    onChangeField("tags", newTags);
    setSearchValue("");
  };

  const deselectTags = id => {
    const newTags = tags.filter(tag => tag._id !== id);
    onChangeField("tags", newTags);
  };

  const searchTags = async value => {
    if (newAllTagsData.some(tag => tag.tagName === value || tag.tagName === value.trim())) {
      setSearchValue("");
    } else {
      setSearchValue(value);
    }
  };
  return (
    <FlexContainer padding="30px" flexDirection="column">
      <Block>
        <SummaryHeader
          createdBy={createdBy}
          thumbnail={thumbnail}
          owner={owner}
          windowWidth={windowWidth}
          analytics={analytics}
          onChangeField={onChangeField}
          isEditable={isEditable}
        />
        <MainTitle>{"Test Name"}</MainTitle>
        <SummaryInput
          value={title}
          data-cy="testname"
          onChange={e => onChangeField("title", e.target.value)}
          size="large"
          placeholder={`Enter the test name`}
        />
        {!title.trim().length && <ErrorWrapper>Test should have title</ErrorWrapper>}
        <MainTitle>Description</MainTitle>
        <SummaryTextArea
          value={description}
          onChange={e => onChangeField("description", e.target.value)}
          size="large"
          placeholder="Enter a description"
        />
        <MainTitle>Grade</MainTitle>
        <SummarySelect
          data-cy="gradeSelect"
          mode="multiple"
          size="large"
          style={{ width: "100%" }}
          placeholder="Please select"
          defaultValue={grades}
          onChange={onChangeGrade}
          optionFilterProp="children"
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {selectsData.allGrades.map(({ value, text }) => (
            <Select.Option key={value} value={value}>
              {text}
            </Select.Option>
          ))}
        </SummarySelect>

        <MainTitle>Subject</MainTitle>
        <SummarySelect
          data-cy="subjectSelect"
          mode="multiple"
          size="large"
          style={{ width: "100%" }}
          placeholder="Please select"
          defaultValue={subjects}
          onChange={onChangeSubjects}
          optionFilterProp="children"
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {subjectsList.map(({ value, text }) => (
            <Select.Option key={value} value={value}>
              {text}
            </Select.Option>
          ))}
        </SummarySelect>
        <MainTitle>Tags</MainTitle>
        <SummarySelect
          data-cy="tagsSelect"
          className="tagsSelect"
          mode="multiple"
          size="large"
          style={{ marginBottom: 0 }}
          optionLabelProp="title"
          placeholder="Please select"
          value={tags.map(t => t._id)}
          onSearch={searchTags}
          onSelect={selectTags}
          onDeselect={deselectTags}
          filterOption={(input, option) => option.props.title.toLowerCase().includes(input.trim().toLowerCase())}
        >
          {!!searchValue.trim() ? (
            <Select.Option key={0} value={searchValue} title={searchValue}>
              {`${searchValue} (Create new Tag)`}
            </Select.Option>
          ) : (
            ""
          )}
          {newAllTagsData.map(({ tagName, _id }, index) => (
            <Select.Option key={_id} value={_id} title={tagName}>
              {tagName}
            </Select.Option>
          ))}
        </SummarySelect>
        {!!searchValue.length && !searchValue.trim().length && (
          <p style={{ color: "red" }}>Please enter valid characters.</p>
        )}
      </Block>
    </FlexContainer>
  );
};

Sidebar.propTypes = {
  title: PropTypes.string.isRequired,
  tags: PropTypes.array.isRequired,
  onChangeField: PropTypes.func.isRequired,
  analytics: PropTypes.array.isRequired,
  grades: PropTypes.array.isRequired,
  onChangeGrade: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
  subjects: PropTypes.array.isRequired,
  owner: PropTypes.bool,
  description: PropTypes.string.isRequired,
  createdBy: PropTypes.object,
  thumbnail: PropTypes.string,
  onChangeSubjects: PropTypes.func.isRequired
};

export default Sidebar;
