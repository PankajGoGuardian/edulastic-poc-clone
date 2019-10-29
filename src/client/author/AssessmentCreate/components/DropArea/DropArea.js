import React from "react";
import PropTypes from "prop-types";

import { PaperContainer } from "./styled";
import CreateUpload from "../CreateUpload/CreateUpload";
import CreateBlank from "../CreateBlank/CreateBlank";

const DropArea = ({ onUpload, onCreateBlank, loading, percent, fileInfo, cancelUpload, uploadToDrive }) => (
  <PaperContainer>
    <CreateUpload
      creating={loading}
      percent={percent}
      fileInfo={fileInfo}
      cancelUpload={cancelUpload}
      onUpload={onUpload}
      uploadToDrive={uploadToDrive}
    />
    <CreateBlank onCreate={onCreateBlank} loading={loading} />
  </PaperContainer>
);

DropArea.propTypes = {
  loading: PropTypes.bool.isRequired,
  onUpload: PropTypes.func.isRequired,
  onCreateBlank: PropTypes.func.isRequired
};

export default DropArea;
