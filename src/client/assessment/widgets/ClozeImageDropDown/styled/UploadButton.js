import { Upload } from "antd";
import styled from "styled-components";

const { Dragger } = Upload;

export const UploadButton = styled(Dragger)`
  margin: 8px 16px 8px 0px;

  .ant-upload.ant-upload-drag {
    padding: 0px;
  }
  .ant-upload.ant-upload-drag .ant-upload {
    padding: 0px;
  }
`;
