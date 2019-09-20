/* eslint-disable react/prop-types */
import React from "react";
import styled from "styled-components";
import { IconUpload } from "@edulastic/icons";
import { grey } from "@edulastic/colors";
import { formatBytes } from "@edulastic/common";
import { Progress, Icon, Button } from "antd";
import PaperTitle from "../common/PaperTitle";
import { UploadDescription, CreateUploadContainer } from "./styled";

const iconStyles = {
  minWidth: "120px",
  minHeight: "77px",
  fill: grey,
  marginBottom: "20px"
};

const CreateUpload = ({ creating, percent, fileInfo, cancelUpload, isDragging }) => {
  const onCancel = () => {
    if (cancelUpload) {
      cancelUpload("Cancelled by user");
    }
  };
  return (
    <CreateUploadContainer childMarginRight="0">
      <IconUpload style={iconStyles} />
      <PaperTitle>{isDragging ? "Drop File To Upload" : "Upload Files to Get Started"}</PaperTitle>
      <UploadDescription>Drag and drop any .pdf or browse and select your file</UploadDescription>
      {creating && !isDragging && !!fileInfo.fileName && (
        <>
          <FileInfoCont>
            <FileName>
              <Icon type="file-pdf" />
              <span>{fileInfo.fileName}</span>
            </FileName>
            <FileSize>{formatBytes(fileInfo.fileSize)}</FileSize>
          </FileInfoCont>
          <ProgressCont>
            <ProgressBarWrapper>
              <Progress
                strokeColor={{
                  "0%": "#108ee9",
                  "100%": "#87d068"
                }}
                percent={percent}
              />
            </ProgressBarWrapper>
            <UploadCancelBtn onClick={onCancel}>Cancel</UploadCancelBtn>
          </ProgressCont>
        </>
      )}
    </CreateUploadContainer>
  );
};

export default CreateUpload;

const FileInfoCont = styled.div`
  padding: 4px;
  display: flex;
  align-items: flex-start;
`;

const FileName = styled.div`
  font-size: 16px;
  font-weight: 600;
  svg {
    font-size: 20px;
    margin-right: 4px;
  }
`;

const FileSize = styled.div`
  margin-left: 4px;
  padding-top: 2px;
  font-style: italic;
`;

const UploadCancelBtn = styled(Button)`
  padding: 2px 4px;
  font-size: 12px;
  height: 24px;
  margin-left: 2px;
  position: relative;
  z-index: 1000;
`;

const ProgressCont = styled.div`
  display: flex;
  width: 100%;
`;

const ProgressBarWrapper = styled.div`
  width: 100%;
`;
