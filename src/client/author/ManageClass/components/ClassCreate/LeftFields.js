import React, { useState, useEffect } from "react";
import { FieldLabel } from "./components";
import Uploader from "./Uploader";
import { getThumbnail } from "../ClassSectionThumbnailsBySubjectGrade";

export default props => {
  useEffect(() => {
    const thumbNailImage = getThumbnail();
    setThumbnail(thumbNailImage);
  }, []);
  const [thumbnail, setThumbnail] = useState("");

  return (
    <>
      <FieldLabel label={`${props.type} Image`} {...props} fiedlName="thumbnail" initialValue={thumbnail}>
        <Uploader url={thumbnail} setThumbnailUrl={setThumbnail} />
      </FieldLabel>
    </>
  );
};
