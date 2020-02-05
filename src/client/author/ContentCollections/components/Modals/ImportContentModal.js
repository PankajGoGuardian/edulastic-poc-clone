import React, { useState } from "react";
import { Button, Input, Select, Radio, Upload, Icon } from "antd";
import styled from "styled-components";
import { ConfirmationModal } from "../../../../author/src/components/common/ConfirmationModal";

import {
  themeColor,
  whiteSmoke,
  numBtnColors,
  white,
  backgroundGrey2,
  borderGrey2,
  placeholderGray
} from "@edulastic/colors";

const { Dragger } = Upload;

const ImportContentModal = ({ visible, handleResponse }) => {
  const Footer = [
    <Button ghost onClick={handleResponse}>
      CANCEL
    </Button>,
    <YesButton onClick={handleResponse}>CREATE</YesButton>
  ];

  const Title = [<Heading>Import Content</Heading>];

  return (
    <StyledModal title={Title} visible={visible} footer={Footer} onCancel={() => handleResponse(null)} width={400}>
      <ModalBody>
        <FieldRow>
          <span>Import content from QTI, WebCT and several other formats.</span>
        </FieldRow>
        <FieldRow>
          <label>Format</label>
          <Select style={{ width: "100%" }} placeholder="Select format" />
        </FieldRow>
        <FieldRow>
          <label>Import Into</label>
          <Radio.Group onChange={() => {}}>
            <Radio value={1}>NEW COLLECTION</Radio>
            <Radio value={2}>EXISTING COLLECTION</Radio>
          </Radio.Group>
          <Input />
        </FieldRow>
        <FieldRow>
          <Radio.Group onChange={() => {}}>
            <Radio value={1}>UPLOAD ZIP</Radio>
            <Radio value={2}>USE AWS S3 BUCKET</Radio>
          </Radio.Group>
          <Dragger>
            <div>
              <Icon type="upload" />
              <span>Drag & drop zip file</span>
            </div>
          </Dragger>
        </FieldRow>
      </ModalBody>
    </StyledModal>
  );
};

export default ImportContentModal;

export const StyledModal = styled(ConfirmationModal)`
  min-width: 500px;
  .ant-modal-content {
    .ant-modal-body {
      text-align: unset;
    }
  }
`;

export const ModalBody = styled.div`
  margin: auto;
  font-weight: ${props => props.theme.semiBold};
  width: 100%;
  > span {
    margin-bottom: 15px;
  }
`;

export const Heading = styled.h4`
  font-weight: ${props => props.theme.semiBold};
`;

export const YesButton = styled(Button)`
  color: ${props => (props.disabled ? "rgba(0, 0, 0, 0.25)" : white)} !important;
  background-color: ${props => (props.disabled ? whiteSmoke : themeColor)} !important;
  border-color: ${props => (props.disabled ? numBtnColors.borderColor : themeColor)} !important;
`;

export const FieldRow = styled.div`
  margin-bottom: 20px;
  width: 100%;
  > label,
  .date-picker-container label {
    display: inline-block;
    text-transform: uppercase;
    width: 100%;
    text-align: left;
    font-size: ${props => props.theme.smallFontSize};
    margin-bottom: 4px;
  }
  .ant-radio-group {
    margin-bottom: 8px;
    .ant-radio-wrapper {
      > span:last-child {
        font-size: ${props => props.theme.smallFontSize};
      }
    }
  }
  input {
    height: 35px;
    background: ${backgroundGrey2};
    border-radius: 2px;
  }
  .ant-select-selection {
    background: ${backgroundGrey2};
    border-radius: 2px;
    .ant-select-selection__rendered {
      min-height: 35px;
      line-height: 35px;
      font-weight: 500;
    }
  }
  .ant-upload-drag {
    border: 1px solid ${borderGrey2};
    background: ${backgroundGrey2};
    .ant-upload-drag-container {
      > div {
        color: ${placeholderGray};
        text-transform: uppercase;
        display: flex;
        flex-direction: column;
        i {
          font-size: 40px;
        }
        > span {
          font-size: ${props => props.theme.smallFontSize};
        }
      }
    }
  }
`;
