/* eslint-disable react/prop-types */
import React, { useState } from "react";
import PropTypes from "prop-types";

import { FlexContainer } from "@edulastic/common";

import { DropAreaContainer, UploadDragger } from "./styled";
import CreateUpload from "../CreateUpload/CreateUpload";
import CreateBlank from "../CreateBlank/CreateBlank";

const DropArea = ({ onUpload, onCreateBlank, loading, percent, fileInfo, cancelUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  return (
    <DropAreaContainer
      onDragOver={() => {
        setIsDragging(true);
      }}
      onDrop={() => {
        setIsDragging(false);
      }}
      onDragLeave={() => {
        setIsDragging(false);
      }}
    >
      <UploadDragger name="file" onChange={onUpload} disabled={loading} beforeUpload={() => false}>
        <FlexContainer childMarginRight="0" style={{ height: "100%" }}>
          <CreateUpload
            isDragging={isDragging}
            creating={loading}
            percent={percent}
            fileInfo={fileInfo}
            cancelUpload={cancelUpload}
          />
        </FlexContainer>
      </UploadDragger>
      <CreateBlank onCreate={onCreateBlank} loading={loading} />
    </DropAreaContainer>
  );
};

DropArea.propTypes = {
  loading: PropTypes.bool.isRequired,
  onUpload: PropTypes.func.isRequired,
  onCreateBlank: PropTypes.func.isRequired
};

export default DropArea;
