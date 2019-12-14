import React, { useState } from "react";
import PropTypes from "prop-types";
import { Select, Row, Col, message } from "antd";
import { uniqBy } from "lodash";
import { ChromePicker } from "react-color";
import { tagsApi } from "@edulastic/api";

import { selectsData } from "../../../common";
import {
  SummaryInput,
  SummarySelect,
  SummaryTextArea,
  SummaryDiv,
  ColorBox,
  SummaryButton
} from "../../common/SummaryForm";
import { Block, MainTitle, MetaTitle, AnalyticsItem, ErrorWrapper } from "./styled";

import { ColorPickerContainer } from "../../../../../../assessment/widgets/ClozeImageText/styled/ColorPickerContainer";
import { ColorPickerWrapper } from "../../../../../../assessment/widgets/ClozeImageText/styled/ColorPickerWrapper";
import SummaryHeader from "../SummaryHeader/SummaryHeader";
import { IPAD_LANDSCAPE_WIDTH } from "../../../../../../assessment/constants/others";

export const renderAnalytics = (title, Icon) => (
  <AnalyticsItem>
    <Icon color="#bbbfc4" width={20} height={20} />
    <MetaTitle>{title}</MetaTitle>
  </AnalyticsItem>
);

const PlayListDescription = ({ onChangeField, description }) => (
  <>
    <MainTitle>Description</MainTitle>
    <SummaryTextArea
      isPlaylist
      value={description}
      onChange={e => onChangeField("description", e.target.value)}
      size="large"
      placeholder="Enter a description"
    />
  </>
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
  textColor,
  addNewTag,
  backgroundColor,
  onChangeColor,
  allPlaylistTagsData,
  isTextColorPickerVisible,
  isBackgroundColorPickerVisible,
  windowWidth,
  isEditable
}) => {
  const newAllTagsData = uniqBy([...allPlaylistTagsData, ...tags], "tagName");
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
          tagType: "playlist"
        });
        newTag = { _id, tagName };
        addNewTag({ tag: newTag, tagType: "playlist" });
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
    <Block>
      <Col span={24}>
        <SummaryHeader
          createdBy={createdBy}
          thumbnail={thumbnail}
          owner={owner}
          windowWidth={windowWidth}
          analytics={analytics}
          onChangeField={onChangeField}
          isEditable={isEditable}
          backgroundColor={backgroundColor}
          textColor={textColor}
        />
      </Col>
      <Row gutter={16}>
        <Col xl={12}>
          <MainTitle>{"Play List Name"}</MainTitle>
          <SummaryInput
            value={title}
            data-cy="testname"
            onChange={e => onChangeField("title", e.target.value)}
            size="large"
            placeholder={`Enter a playlist name`}
          />
          {!title.trim().length && <ErrorWrapper>Test should have title</ErrorWrapper>}
          {windowWidth <= IPAD_LANDSCAPE_WIDTH && (
            <PlayListDescription onChangeField={onChangeField} description={description} />
          )}
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
            style={{ marginBottom: "10px", width: "100%" }}
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
        </Col>
        <Col xl={12}>
          <Row>
            <Col xs={12}>
              <MainTitle>Text Color</MainTitle>
              <SummaryDiv>
                <ColorBox data-cy="image-text-box-color-picker" background={textColor} />
                <SummaryButton onClick={() => onChangeColor("isTextColorPickerVisible", true)}>CHOOSE</SummaryButton>
                {isTextColorPickerVisible && (
                  <ColorPickerContainer data-cy="image-text-box-color-panel">
                    <ColorPickerWrapper onClick={() => onChangeColor("isTextColorPickerVisible", false)} />
                    <ChromePicker color={textColor} onChangeComplete={color => onChangeColor("textColor", color.hex)} />
                  </ColorPickerContainer>
                )}
              </SummaryDiv>
            </Col>
            <Col xs={12}>
              <MainTitle>Background Color</MainTitle>
              <SummaryDiv>
                <ColorBox data-cy="image-text-box-color-picker" background={backgroundColor} />
                <SummaryButton onClick={() => onChangeColor("isBackgroundColorPickerVisible", true)}>
                  CHOOSE
                </SummaryButton>
                {isBackgroundColorPickerVisible && (
                  <ColorPickerContainer data-cy="image-text-box-color-panel">
                    <ColorPickerWrapper onClick={() => onChangeColor("isBackgroundColorPickerVisible", false)} />
                    <ChromePicker
                      color={backgroundColor}
                      onChangeComplete={color => onChangeColor("backgroundColor", color.hex)}
                    />
                  </ColorPickerContainer>
                )}
              </SummaryDiv>
            </Col>
            {windowWidth > IPAD_LANDSCAPE_WIDTH && (
              <PlayListDescription onChangeField={onChangeField} description={description} />
            )}
          </Row>
        </Col>
      </Row>
    </Block>
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
  textColor: PropTypes.string.isRequired,
  createdBy: PropTypes.object,
  thumbnail: PropTypes.string,
  backgroundColor: PropTypes.string,
  onChangeColor: PropTypes.func,
  isTextColorPickerVisible: PropTypes.bool,
  isBackgroundColorPickerVisible: PropTypes.bool,
  onChangeSubjects: PropTypes.func.isRequired
};

export default Sidebar;
