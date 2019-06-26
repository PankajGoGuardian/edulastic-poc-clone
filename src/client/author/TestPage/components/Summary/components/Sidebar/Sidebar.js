import React from "react";
import PropTypes from "prop-types";
import { Select, Col } from "antd";

import { IconHeart, IconShare, IconWorldWide } from "@edulastic/icons";
import { FlexContainer } from "@edulastic/common";

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
import { ChromePicker } from "react-color";

import { ColorPickerContainer } from "../../../../../../assessment/widgets/ClozeImageText/styled/ColorPickerContainer";
import { ColorPickerWrapper } from "../../../../../../assessment/widgets/ClozeImageText/styled/ColorPickerWrapper";
import SummaryHeader from "../SummaryHeader/SummaryHeader";

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
  tags,
  owner,
  analytics,
  grades,
  isPlaylist,
  onChangeGrade,
  description,
  createdBy,
  thumbnail,
  textColor,
  backgroundColor,
  onChangeColor,
  isTextColorPickerVisible,
  isBackgroundColorPickerVisible,
  windowWidth
}) => {
  const subjectsList = selectsData.allSubjects.slice(1);
  return (
    <FlexContainer flexDirection="column">
      <Block>
        <SummaryHeader
          createdBy={createdBy}
          thumbnail={thumbnail}
          owner={owner}
          windowWidth={windowWidth}
          analytics={analytics}
          onChangeField={onChangeField}
        />
        <MainTitle>{isPlaylist ? "Play List Name" : "Assessment Name"}</MainTitle>
        <SummaryInput
          value={title}
          data-cy="testname"
          onChange={e => onChangeField("title", e.target.value)}
          size="large"
          placeholder={isPlaylist ? `Enter a playlist name` : `Enter the test name`}
        />
        {!title && <ErrorWrapper>Test should have title</ErrorWrapper>}
        <MainTitle>Description</MainTitle>
        <SummaryTextArea
          value={description}
          onChange={e => onChangeField("description", e.target.value)}
          size="large"
          placeholder="Enter a description"
          isplaylist={isPlaylist}
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
        >
          {subjectsList.map(({ value, text }) => (
            <Select.Option key={value} value={value}>
              {text}
            </Select.Option>
          ))}
        </SummarySelect>

        {isPlaylist && (
          <div>
            <Col span={windowWidth > 993 ? 12 : 24}>
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
            <Col span={windowWidth > 993 ? 12 : 24}>
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
          </div>
        )}
        <MainTitle>Tags</MainTitle>
        <SummarySelect
          data-cy="tagsSelect"
          mode="tags"
          size="large"
          style={{ marginBottom: 0 }}
          placeholder="Please select"
          defaultValue={tags}
          onChange={value => onChangeField("tags", value)}
        >
          {selectsData.allTags.map(({ value, text }) => (
            <Select.Option key={value} value={value}>
              {text}
            </Select.Option>
          ))}
        </SummarySelect>
        {/* to be done later */}
        {false && (
          <>
            <MainTitle>Collection</MainTitle>
            <SummarySelect
              data-cy="CollectionSelect"
              size="large"
              style={{ width: "100%" }}
              placeholder="Please select"
              defaultValue={subjects}
              onChange={""}
            >
              {selectsData.allCollections.map(({ value, text }) => (
                <Select.Option key={value} value={value}>
                  {text}
                </Select.Option>
              ))}
            </SummarySelect>
          </>
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
  textColor: PropTypes.string.isRequired,
  createdBy: PropTypes.object,
  thumbnail: PropTypes.string,
  backgroundColor: PropTypes.string,
  isPlaylist: PropTypes.bool,
  onChangeColor: PropTypes.func,
  isTextColorPickerVisible: PropTypes.bool,
  isBackgroundColorPickerVisible: PropTypes.bool,
  onChangeSubjects: PropTypes.func.isRequired
};

export default Sidebar;
