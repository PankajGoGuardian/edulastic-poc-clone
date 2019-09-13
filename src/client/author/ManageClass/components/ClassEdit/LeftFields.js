import React, { useState } from "react";
import PropTypes from "prop-types";
import { Select } from "antd";
import { uniq } from "lodash";
import { FieldLabel } from "./components";
import Uploader from "./Uploader";
import { tagsApi } from "@edulastic/api";

const LeftField = props => {
  const { thumbnailUri, tags, allTagsData, addNewTag, setFieldsValue, getFieldValue } = props;
  const [thumbnail, setThumbnail] = useState(thumbnailUri);
  const [searchValue, setSearchValue] = useState("");
  const selectTags = async id => {
    let newTag = {};
    if (id === searchValue) {
      const tempSearchValue = searchValue;
      setSearchValue("");
      const { _id, tagName } = await tagsApi.create({ tagName: tempSearchValue, tagType: "group" });
      newTag = { _id, tagName };
      addNewTag({ tag: newTag, tagType: "group" });
    } else {
      newTag = allTagsData.find(tag => tag._id === id);
    }
    const tagsSelected = getFieldValue("tags");
    const newTags = [...tagsSelected, newTag._id];
    setFieldsValue({ tags: newTags.filter(t => t !== searchValue) });
    setSearchValue("");
  };

  const deselectTags = id => {
    const tagsSelected = getFieldValue("tags");
    const newTags = tagsSelected.filter(tag => tag !== id);
    setFieldsValue({ tags: newTags });
  };

  const searchTags = async value => {
    if (allTagsData.some(tag => tag.tagName === value || tag.tagName === value.trim())) {
      setSearchValue("");
    } else {
      setSearchValue(value);
    }
  };

  return (
    <>
      <FieldLabel label="Class Image" optional {...props} fiedlName="thumbnail" initialValue={thumbnail}>
        <Uploader url={thumbnail} setThumbnailUrl={setThumbnail} />
      </FieldLabel>
      <FieldLabel label="Tags" optional {...props} fiedlName="tags" initialValue={tags.map(t => t._id)}>
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
          {allTagsData.map(({ tagName, _id }) => (
            <Select.Option key={_id} value={_id} title={tagName}>
              {tagName}
            </Select.Option>
          ))}
        </Select>
      </FieldLabel>
    </>
  );
};

LeftField.propTypes = {
  thumbnailUri: PropTypes.string,
  tags: PropTypes.array
};

LeftField.defaultProps = {
  thumbnailUri: "",
  tags: []
};

export default LeftField;
