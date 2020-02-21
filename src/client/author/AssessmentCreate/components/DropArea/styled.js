import { Upload } from "antd";
import styled from "styled-components";
import { themeColor } from "@edulastic/colors";

const { Dragger } = Upload;

export const DropAreaContainer = styled.div`
  display: block;
  margin: 34px 43px 0 46px;
  border-radius: 4px;
  background: ${({ isDragging }) => (isDragging ? "rgba(0,0,0,0.5)" : "transparent")};
  border: ${({ isDragging }) => (isDragging ? `2px dashed ${themeColor}` : "none")};
  border-radius: 10px;
  position: absolute;
  width: 90%;
  height: 80%;
  top: 12%;
  left: 2%;
  z-index: ${({ isDragging }) => isDragging && 999};
  h1 {
    color: #fff;
  }
`;

export const UploadDragger = styled(Dragger)`
  display: flex;
  width: 100%;
  height: 100%;
  &.ant-upload-list {
    display: none;
  }
  &.ant-upload-drag-container {
    /* cursor: auto; */
    padding: 0;
    margin: 0;
  }
  &.ant-upload.ant-upload-drag {
    background: transparent;
    padding: 0;
    margin: 0;
    height: 100%;
    cursor: auto;
  }
  &.ant-upload.ant-upload-drag .ant-upload-btn {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
  }
`;
