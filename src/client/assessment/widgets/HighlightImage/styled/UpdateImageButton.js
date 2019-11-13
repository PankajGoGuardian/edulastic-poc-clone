import { Upload } from "antd";
import styled from "styled-components";

const UpdateImageButton = styled(Upload.Dragger)`
  .ant-upload.ant-upload-drag {
    background: transparent;
    padding: 0;
  }

  .ant-upload ant-upload-btn {
    padding: 0;
  }
  .ant-btn {
    margin-left: 0;
  }
  .;
`;

export default UpdateImageButton;
