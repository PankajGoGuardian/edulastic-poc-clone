import React, { useState } from "react";
import PropTypes from "prop-types";
import { Select, message } from "antd";
import { FieldLabel } from "./components";
import Uploader from "./Uploader";
import { tagsApi } from "@edulastic/api";

const LeftField = props => {
  const { type, thumbnailUri, tags, allTagsData, addNewTag, setFieldsValue, getFieldValue } = props;
  const [thumbnail, setThumbnail] = useState(thumbnailUri);
  const [searchValue, setSearchValue] = useState("");
  const selectTags = async id => {
    let newTag = {};
    if (id === searchValue) {
      const tempSearchValue = searchValue;
      setSearchValue("");
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

  const titlePrefix = type === "custom" ? "Group" : "Class";

  return (
    <>
      <FieldLabel label={`${titlePrefix} Image`} optional {...props} fiedlName="thumbnail" initialValue={thumbnail}>
        <Uploader url={thumbnail} setThumbnailUrl={setThumbnail} />
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
