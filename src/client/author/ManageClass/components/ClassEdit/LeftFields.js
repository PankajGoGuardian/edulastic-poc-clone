import React, { useState } from "react";
import PropTypes from "prop-types";
import { Col } from "antd";
import { StyledFlexContainer } from "./styled";
import { FieldLabel } from "./components";
import Tags from "./Tags";
import Uploader from "./Uploader";

const LeftField = props => {
  const { type, thumbnailUri } = props;
  const [thumbnail, setThumbnail] = useState(thumbnailUri);

  const titlePrefix = type === "custom" ? "Group" : "Class";

  return (
    <StyledFlexContainer>
      <Col xs={24}>
        <FieldLabel label={`${titlePrefix} Image`} optional {...props} fiedlName="thumbnail" initialValue={thumbnail}>
          <Uploader url={thumbnail} setThumbnailUrl={setThumbnail} />
        </FieldLabel>
      </Col>
      {type !== "class" && (
        <Col xs={24}>
          <Tags {...props} />
        </Col>
      )}
    </StyledFlexContainer>
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
