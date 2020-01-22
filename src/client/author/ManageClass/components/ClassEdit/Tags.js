import React, { useState } from "react";
import { Select } from "antd";
import { tagsApi } from "@edulastic/api";
import { FieldLabel } from "./components";
import { uniq } from "lodash";
import PropTypes from "prop-types";

const Tags = props => {
  const { tags = [], allTagsData, addNewTag, setFieldsValue, getFieldValue } = props;
  const [searchValue, setSearchValue] = useState("");
  const selectTags = async id => {
    let newTag = {};
    let tempSearchValue = searchValue;
    if (id === searchValue) {
      try {
        const { _id, tagName } = await tagsApi.create({ tagName: tempSearchValue, tagType: "group" });
        newTag = { _id, tagName };
        addNewTag({ tag: newTag, tagType: "group" });
      } catch (e) {
        message.error("Saving tag failed");
      }
    } else {
      newTag = allTagsData.find(tag => tag._id === id);
    }
    const tagsSelected = getFieldValue("tags");
    const newTags = uniq([...tagsSelected, newTag._id]);
    setFieldsValue({ tags: newTags.filter(t => t !== tempSearchValue) });
    tempSearchValue = "";
    setSearchValue("");
  };

  const deselectTags = id => {
    const tagsSelected = getFieldValue("tags");
    const newTags = tagsSelected.filter(tag => tag !== id);
    setFieldsValue({ tags: newTags });
  };

  const searchTags = value => {
    if (allTagsData.some(tag => tag.tagName === value || tag.tagName === value.trim())) {
      setSearchValue("");
    } else {
      setSearchValue(value);
    }
  };

  return (
    <>
      <FieldLabel label="Tags" optional {...props} fiedlName="tags" initialValue={tags.map(tag => tag._id)}>
        <Select
          data-cy="tagsSelect"
          mode="multiple"
          style={{ marginBottom: 0 }}
          optionLabelProp="title"
          placeholder="Select Tags"
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
          {allTagsData.map(({ tagName, _id }) =>
            searchValue.trim() === "" ? (
              <Select.Option key={_id} value={_id} title={tagName}>
                {tagName}
              </Select.Option>
            ) : null
          )}
        </Select>
      </FieldLabel>
    </>
  );
};

Tags.propTypes = {
  tags: PropTypes.array
};

Tags.defaultProps = {
  tags: []
};

export default Tags;
