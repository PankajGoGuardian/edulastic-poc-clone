import React from "react";
import PropTypes from "prop-types";

import BodyWrapper from "../../../AssignmentCreate/common/BodyWrapper";
import FlexWrapper from "../../../AssignmentCreate/common/FlexWrapper";
import CreateUpload from "../CreateUpload/CreateUpload";
import CreateBlank from "../CreateBlank/CreateBlank";

const DropArea = ({ onUpload, onCreateBlank, loading, percent, fileInfo, cancelUpload, uploadToDrive }) => (
  <BodyWrapper>
    <FlexWrapper marginBottom="0px">
      <CreateUpload
        creating={loading}
        percent={percent}
        fileInfo={fileInfo}
        cancelUpload={cancelUpload}
        onUpload={onUpload}
        uploadToDrive={uploadToDrive}
      />
      <CreateBlank onCreate={onCreateBlank} loading={loading} />
    </FlexWrapper>
  </BodyWrapper>
);

DropArea.propTypes = {
  loading: PropTypes.bool.isRequired,
  onUpload: PropTypes.func.isRequired,
  onCreateBlank: PropTypes.func.isRequired
};

export default DropArea;
