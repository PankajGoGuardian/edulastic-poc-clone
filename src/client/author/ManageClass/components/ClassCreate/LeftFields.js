import React, { useState } from "react";
import { Select } from "antd";
import { FieldLabel } from "./components";
import Uploader from "./Uploader";
import selectsData from "../../../TestPage/components/common/selectsData";

const defaultImage = "https://fakeimg.pl/1000x300/";

export default props => {
  const [thumbnail, setThumbnail] = useState(defaultImage);

  return (
    <>
      <FieldLabel label="Class Image" optional {...props} fiedlName="thumbnail" initialValue={thumbnail}>
        <Uploader defaultImage={thumbnail} uploadTestImage={setThumbnail} />
      </FieldLabel>
      <FieldLabel label="Tags" optional {...props} fiedlName="tags" initialValue={[]}>
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
