import { Upload } from "antd";
import styled from "styled-components";

const { Dragger } = Upload;

export const UploadButton = styled(Dragger)`
  &.ant-upload.ant-upload-drag {
    padding: 0px;
    .ant-upload {
      padding: 0px;
    }
  }
`;
