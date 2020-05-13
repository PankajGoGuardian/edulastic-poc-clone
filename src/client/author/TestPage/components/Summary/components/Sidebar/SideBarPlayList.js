import { tagsApi } from "@edulastic/api";
import { FieldLabel, SelectInputStyled, TextAreaInputStyled, TextInputStyled } from "@edulastic/common";
import { Col, message, Row, Select } from "antd";
import { uniqBy } from "lodash";
import PropTypes from "prop-types";
import React, { createRef, useEffect, useMemo, useState } from "react";
import { ChromePicker } from "react-color";
import connect from "react-redux/lib/connect/connect";
import { IPAD_LANDSCAPE_WIDTH } from "../../../../../../assessment/constants/others";
import { ColorPickerContainer } from "../../../../../../assessment/widgets/ClozeImageText/styled/ColorPickerContainer";
import { ColorPickerWrapper } from "../../../../../../assessment/widgets/ClozeImageText/styled/ColorPickerWrapper";
import { changePlaylistThemeAction } from "../../../../../PlaylistPage/ducks";
import { selectsData } from "../../../common";
import { ColorBox, SummaryButton, SummaryDiv } from "../../common/SummaryForm";
import SummaryHeader from "../SummaryHeader/SummaryHeader";
import { AnalyticsItem, Block, ErrorWrapper, MetaTitle } from "./styled";
import { sortGrades } from "../../../../utils";

export const renderAnalytics = (title, Icon) => (
  <AnalyticsItem>
    <Icon color="#bbbfc4" width={20} height={20} />
    <MetaTitle>{title}</MetaTitle>
  </AnalyticsItem>
);

const PlayListDescription = ({ onChangeField, description }) => (
  <>
    <FieldLabel>Description</FieldLabel>
    <TextAreaInputStyled
      isPlaylist
      value={description}
      onChange={e => onChangeField("description", e.target.value)}
      size="large"
      placeholder="Enter a description"
      height="187px"
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
  isEditable,
  changePlayListTheme,
  features = {},
  orgCollections,
  onChangeCollection,
  collections = []
}) => {
  const newAllTagsData = uniqBy([...allPlaylistTagsData, ...tags], "tagName");
  const subjectsList = selectsData.allSubjects.slice(1);
  const [searchValue, setSearchValue] = useState("");
  const playListTitleInput = createRef();
  const isPublishers = !!(features.isPublisherAuthor || features.isCurator);

  useEffect(() => {
    if (playListTitleInput.current) {
      playListTitleInput.current.input.focus();
    }
  }, []);

  const filteredCollections = useMemo(() => collections.filter(c => orgCollections.some(o => o._id === c._id)), [
    collections,
    orgCollections
  ]);

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
          <FieldLabel>Playlist Name</FieldLabel>
          <TextInputStyled
            value={title}
            data-cy="testname"
            onChange={e => onChangeField("title", e.target.value)}
            size="large"
            placeholder="Enter a playlist name"
            ref={playListTitleInput}
            margin="0px 0px 15px"
          />
          {title !== undefined && !title.trim().length && <ErrorWrapper>Test should have title</ErrorWrapper>}
          {windowWidth <= IPAD_LANDSCAPE_WIDTH && (
            <PlayListDescription onChangeField={onChangeField} description={description} />
          )}
          <FieldLabel>Grade</FieldLabel>
          <SelectInputStyled
            data-cy="gradeSelect"
            mode="multiple"
            size="large"
            placeholder="Please select"
            value={sortGrades(grades)}
            onChange={onChangeGrade}
            optionFilterProp="children"
            margin="0px 0px 15px"
            getPopupContainer={triggerNode => triggerNode.parentNode}
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {selectsData.allGrades.map(({ value, text }) => (
              <Select.Option key={value} value={value}>
                {text}
              </Select.Option>
            ))}
          </SelectInputStyled>

          <FieldLabel>Subject</FieldLabel>
          <SelectInputStyled
            data-cy="subjectSelect"
            mode="multiple"
            size="large"
            margin="0px 0px 15px"
            placeholder="Please select"
            defaultValue={subjects}
            onChange={onChangeSubjects}
            optionFilterProp="children"
            getPopupContainer={triggerNode => triggerNode.parentNode}
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {subjectsList.map(({ value, text }) => (
              <Select.Option key={value} value={value}>
                {text}
              </Select.Option>
            ))}
          </SelectInputStyled>

          {isPublishers && (
            <>
              <FieldLabel>Collections</FieldLabel>
              <SelectInputStyled
                data-cy="collectionsSelect"
                mode="multiple"
                size="large"
                margin="0px 0px 15px"
                placeholder="Please select"
                value={filteredCollections.flatMap(c => c.bucketIds)}
                onChange={onChangeCollection}
                optionFilterProp="children"
                getPopupContainer={triggerNode => triggerNode.parentNode}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {orgCollections.map(o => (
                  <Select.Option key={o.bucketId} value={o.bucketId} _id={o._id}>
                    {`${o.collectionName} - ${o.name}`}
                  </Select.Option>
                ))}
              </SelectInputStyled>
            </>
          )}

          <FieldLabel>Tags</FieldLabel>
          <SelectInputStyled
            data-cy="tagsSelect"
            className="tagsSelect"
            mode="multiple"
            size="large"
            margin="0px 0px 15px"
            optionLabelProp="title"
            placeholder="Please select"
            value={tags.map(t => t._id)}
            onSearch={searchTags}
            onSelect={selectTags}
            onDeselect={deselectTags}
            getPopupContainer={triggerNode => triggerNode.parentNode}
            filterOption={(input, option) => option.props.title.toLowerCase().includes(input.trim().toLowerCase())}
          >
            {!!searchValue.trim() ? (
              <Select.Option key={0} value={searchValue} title={searchValue}>
                {`${searchValue} (Create new Tag)`}
              </Select.Option>
            ) : (
              ""
            )}
            {newAllTagsData.map(({ tagName, _id }) => (
              <Select.Option key={_id} value={_id} title={tagName}>
                {tagName}
              </Select.Option>
            ))}
          </SelectInputStyled>
          {!!searchValue.length && !searchValue.trim().length && (
            <p style={{ color: "red" }}>Please enter valid characters.</p>
          )}
        </Col>
        <Col xl={12}>
          <Row>
            <Col xs={12}>
              <FieldLabel>TEXT COLOR</FieldLabel>
              <SummaryDiv>
                <ColorBox data-cy="image-text-box-color-picker" background={textColor} />
                <SummaryButton onClick={() => onChangeColor("isTextColorPickerVisible", true)}>CHOOSE</SummaryButton>
                {isTextColorPickerVisible && (
                  <ColorPickerContainer data-cy="image-text-box-color-panel">
                    <ColorPickerWrapper onClick={() => onChangeColor("isTextColorPickerVisible", false)} />
                    <ChromePicker
                      color={textColor}
                      onChangeComplete={color =>
                        changePlayListTheme({ textColor: color.hex, bgColor: backgroundColor || "" })
                      }
                    />
                  </ColorPickerContainer>
                )}
              </SummaryDiv>
            </Col>
            <Col xs={12}>
              <FieldLabel>BACKGROUND COLOR</FieldLabel>
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
                      onChangeComplete={color =>
                        changePlayListTheme({ bgColor: color.hex, textColor: textColor || "" })
                      }
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

export default connect(
  null,
  { changePlayListTheme: changePlaylistThemeAction }
)(Sidebar);
