import React, { useState } from "react";
import PropTypes from "prop-types";
import { Select } from "antd";
import { FieldLabel } from "./components";
import Uploader from "./Uploader";
import selectsData from "../../../TestPage/components/common/selectsData";

const defaultImage = "https://fakeimg.pl/1000x300/";

const LeftField = props => {
  const { thumbnailUri, tags } = props;
  const [thumbnail, setThumbnail] = useState(thumbnailUri || defaultImage);
  return (
    <>
      <FieldLabel label="Class Image" optional {...props} fiedlName="thumbnail" initialValue={thumbnail}>
        <Uploader url={thumbnail} setThumbnailUrl={setThumbnail} />
      </FieldLabel>
      <FieldLabel label="Tags" optional {...props} fiedlName="tags" initialValue={tags}>
        <Select showSearch mode="multiple" placeholder="Select Tags">
          {selectsData.allTags.map(el => (
            <Select.Option key={el.value} value={el.value}>
              {el.text}
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
