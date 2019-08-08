import React, { useState, useEffect } from "react";
import { Select } from "antd";
import { FieldLabel } from "./components";
import Uploader from "./Uploader";
import selectsData from "../../../TestPage/components/common/selectsData";
import { getThumbnail } from "../ClassSectionThumbnailsBySubjectGrade";

const defultImage = "https://fakeimg.pl/1000x500/";

export default props => {
  useEffect(() => {
    const thumbNailImage = getThumbnail();
    setThumbnail(thumbNailImage || defultImage);
  }, []);
  const [thumbnail, setThumbnail] = useState("");

  return (
    <>
      <FieldLabel label="Class Image" optional {...props} fiedlName="thumbnail" initialValue={thumbnail}>
        <Uploader url={thumbnail} setThumbnailUrl={setThumbnail} />
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
