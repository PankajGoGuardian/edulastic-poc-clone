import React from 'react'
import { IconUpload, IconGdrive, IconCloudUpload } from '@edulastic/icons'
import { formatBytes, notification } from '@edulastic/common'
import { Progress, Icon, Spin } from 'antd'
import { themeColor } from '@edulastic/colors'
import {
  Container,
  ButtonsContainer,
  RoundedButton,
} from '../CreateBlank/styled'
import { UploadDragger } from '../DropArea/styled'
import {
  FileInfoCont,
  FileName,
  FileSize,
  UploadCancelBtn,
  ProgressCont,
  ProgressBarWrapper,
} from './styled-components'
import { GooglePicker, G_DRIVE_ACTIONS } from '../../../../../vendors/google'
import TitleWrapper from '../../../AssignmentCreate/common/TitleWrapper'
import TextWrapper from '../../../AssignmentCreate/common/TextWrapper'
import IconWrapper from '../../../AssignmentCreate/common/IconWrapper'

const CreateUpload = ({
  creating,
  percent,
  fileInfo,
  onUpload,
  cancelUpload,
  uploadToDrive,
  assesmentMetadata = {},
}) => {
  const onCancel = () => {
    if (cancelUpload) {
      cancelUpload('Cancelled by user')
    }
  }

  const handleAuthFailed = (data) => {
    console.error('oth failed:', data)
    return notification({ type: 'warn', messageKey: 'autheticationFailed' })
  }

  const handleDriveUpload = ({ action, docs, token }) => {
    if (action === G_DRIVE_ACTIONS.PICKED && docs) {
      const [doc] = docs
      const { id, name, sizeBytes: size, mimeType } = doc
      if (size > 1024 * 1024 * 5) {
        notification({ messageKey: 'selectedDocumentIsTooBigToUpload' })
        return
      }
      uploadToDrive({
        id,
        token,
        name,
        size,
        mimeType,
        ...assesmentMetadata,
      })
    }
  }

  return (
    <Container childMarginRight="0">
      <IconWrapper>
        <IconUpload width="22" height="22" />
      </IconWrapper>
      <TitleWrapper>Upload Files to Get Started</TitleWrapper>
      <TextWrapper>
        Select questions from the library or <br /> author your own.
      </TextWrapper>
      <ButtonsContainer width="180px">
        <UploadDragger
          UploadDragger
          name="file"
          onChange={onUpload}
          disabled={creating}
          beforeUpload={() => false}
          accept=".pdf"
        >
          <RoundedButton data-cy="uploadPdfFromFiles">
            <IconCloudUpload color={themeColor} />
          </RoundedButton>
        </UploadDragger>
        {/* TODO add proper client ID and developer key via .env files */}
        <GooglePicker
          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
          onChange={handleDriveUpload}
          onAuthFailed={handleAuthFailed}
          mimeTypes={['application/pdf']}
        >
          <RoundedButton data-cy="uploadPdfFromDrive">
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
                    '0%': '#108ee9',
                    '100%': '#87d068',
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
  )
}

export default CreateUpload
