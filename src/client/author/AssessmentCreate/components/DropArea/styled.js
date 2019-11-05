import { Upload } from "antd";
import styled from "styled-components";

const { Dragger } = Upload;

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
