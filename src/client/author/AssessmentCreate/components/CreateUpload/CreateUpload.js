import React from "react";
import styled from "styled-components";
import { IconUpload } from "@edulastic/icons";
import { formatBytes } from "@edulastic/common";
import { Progress, Icon, Button, message } from "antd";
import PaperTitle from "../common/PaperTitle";
import { UploadDescription } from "./styled";
import { Container, ButtonsContainer, RoundedButton } from "../CreateBlank/styled";
import { UploadDragger } from "../DropArea/styled";
import { themeColor } from "@edulastic/colors";
import GooglePicker from "./GooglePicker";

const CreateUpload = ({ creating, percent, fileInfo, onUpload, cancelUpload, uploadToDrive }) => {
  const onCancel = () => {
    if (cancelUpload) {
      cancelUpload("Cancelled by user");
    }
  };

  const handleAuthFailed = data => {
    console.error("oth failed:", data);
    return message.warn("Authetication failed");
  };

  const handleDriveUpload = ({ action, docs }) => {
    if (action === "picked" && docs) {
      const [doc] = docs;
      uploadToDrive({ id: doc.id, accessToken: window.gapi.auth.getToken().access_token });
    }
  };

  return (
    <Container childMarginRight="0">
      <IconUpload width="45px" height="45px" />
      <PaperTitle>Upload Files to Get Started</PaperTitle>
      <UploadDescription>Select questions from the library or author your own.</UploadDescription>
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
            <IconUpload color={themeColor} />
          </RoundedButton>
        </UploadDragger>
        {/* TODO add proper client ID and developer key via .env files */}
        <GooglePicker
          clientId={"835823990898-ulhj06b5p15vo0014a1bbvdbhnm6otuf.apps.googleusercontent.com"}
          developerKey={"AIzaSyD9ZkpXo8kM2SKVzdxqJ7TlKSJnGwDbxM4"}
          onChange={handleDriveUpload}
          onAuthFailed={handleAuthFailed}
          mimeTypes={["application/pdf"]}
        >
          <RoundedButton>G</RoundedButton>
        </GooglePicker>
      </ButtonsContainer>
      {creating && (
        <>
          {!!fileInfo.name && (
            <FileInfoCont>
              <FileName>
                <Icon type="file-pdf" />
                <span>{fileInfo.fileName}</span>
              </FileName>
              <FileSize>{formatBytes(fileInfo.fileSize)}</FileSize>
            </FileInfoCont>
          )}
          {percent > 0 && percent < 100 && (
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
