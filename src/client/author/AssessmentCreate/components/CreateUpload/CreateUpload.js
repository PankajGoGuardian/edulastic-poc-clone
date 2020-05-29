import React from "react";
import styled from "styled-components";
import { IconUpload, IconGdrive, IconCloudUpload } from "@edulastic/icons";
import { formatBytes,notification } from "@edulastic/common";
import { Progress, Icon, Button, message, Spin } from "antd";
import { themeColor } from "@edulastic/colors";
import { Container, ButtonsContainer, RoundedButton } from "../CreateBlank/styled";
import { UploadDragger } from "../DropArea/styled";
import GooglePicker from "./GooglePicker";
import TitleWrapper from "../../../AssignmentCreate/common/TitleWrapper";
import TextWrapper from "../../../AssignmentCreate/common/TextWrapper";
import IconWrapper from "../../../AssignmentCreate/common/IconWrapper";

const CreateUpload = ({ creating, percent, fileInfo, onUpload, cancelUpload, uploadToDrive }) => {
  const onCancel = () => {
    if (cancelUpload) {
      cancelUpload("Cancelled by user");
    }
  };

  const handleAuthFailed = data => {
    console.error("oth failed:", data);
    return notification({ type: "warn", messageKey:"autheticationFailed"});
  };

  const handleDriveUpload = ({ action, docs }) => {
    if (action === "picked" && docs) {
      const [doc] = docs;
      const { id, name, sizeBytes: size, mimeType } = doc;
      if (size > 1024 * 1024 * 5) {
        message.error("The selected document is too big to be uploaded");
        return;
      }
      uploadToDrive({ id, token: window.gapi.auth.getToken().access_token, name, size, mimeType });
    }
  };

  return (
    <Container childMarginRight="0">
      <IconWrapper>
        <IconUpload width="34px" height="44px" />
      </IconWrapper>
      <TitleWrapper>Upload Files to Get Started</TitleWrapper>
      <TextWrapper>
        Select questions from the library or <br /> author your own.
      </TextWrapper>
      <ButtonsContainer>
        <UploadDragger
          UploadDragger
          name="file"
          onChange={onUpload}
          disabled={creating}
          beforeUpload={() => false}
          accept=".pdf"
        >
          <RoundedButton>
            <IconCloudUpload color={themeColor} />
          </RoundedButton>
        </UploadDragger>
        {/* TODO add proper client ID and developer key via .env files */}
        <GooglePicker
          clientId={process.env.POI_APP_GOOGLE_CLIENT_ID}
          onChange={handleDriveUpload}
          onAuthFailed={handleAuthFailed}
          mimeTypes={["application/pdf"]}
        >
          <RoundedButton>
            <IconGdrive color={themeColor} />
          </RoundedButton>
        </GooglePicker>
      </ButtonsContainer>
      {creating && (
        <>
          {fileInfo?.fileName && (
            <FileInfoCont>
              <FileName>
                <Icon type="file-pdf" />
                <span>{fileInfo.fileName}</span>
                <FileSize>{formatBytes(fileInfo.fileSize)}</FileSize>
              </FileName>
            </FileInfoCont>
          )}
          {percent > 0 && percent < 100 ? (
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
          ) : (
            <ProgressCont>
              <ProgressBarWrapper>
                <Spin />
              </ProgressBarWrapper>
            </ProgressCont>
          )}
        </>
      )}
    </Container>
  );
};

export default CreateUpload;

const FileInfoCont = styled.div`
  padding: 4px;
  display: flex;
  align-items: flex-start;
`;

const FileName = styled.div`
  font-size: 12px;
  font-weight: 600;
  margin-top: 20px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

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
