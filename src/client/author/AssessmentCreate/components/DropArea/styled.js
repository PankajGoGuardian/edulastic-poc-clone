import { Upload } from "antd";
import styled from "styled-components";

import { Paper } from "@edulastic/common";

const { Dragger } = Upload;

export const PaperContainer = styled(Paper)`
  display: flex;
  justify-content: center;
  border-radius: 10px;
  padding: 100px 0;
  min-height: 70vh;
  margin-top: 20px;
`;

export const UploadDragger = styled(Dragger)`
  .ant-upload-list {
    display: none;
  }
  .ant-upload-drag-container {
    padding: 0;
  }
  .ant-upload.ant-upload-drag {
    background: transparent;
    padding: 0;
    margin: 0;
    height: auto;
  }
  .ant-upload.ant-upload-drag .ant-upload-btn {
    height: auto;
    padding: 0;
    margin: 0;
  }
`;
