import { Upload } from "antd";
import styled from "styled-components";

const UpdateImageButton = styled(Upload.Dragger)`
  &.ant-upload {
    margin-left: 0;
    &.ant-upload-drag {
      background: transparent;
      padding: 0;
    }
    .ant-upload-btn {
      padding: 0;
    }
  }
`;

export default UpdateImageButton;
