import {
  EduElse,
  EduIf,
  EduThen,
  FlexContainer,
  notification,
} from '@edulastic/common'
import React from 'react'
import Dropzone from 'react-dropzone'
import { Divider, Icon } from 'antd'

import { IconUpload } from '@edulastic/icons'
import { MAX_UPLOAD_FILE_SIZE } from '@edulastic/constants/const/dataWarehouse'

import {
  StyledProgress,
  StyledText,
} from '../../../../../../Shared/Components/DataWarehouseUploadModal/styledComponents'
import {
  DropzoneContentContainer,
  Header,
  ModalContentWrapper,
  Underlined,
  Container,
} from '../../../common/components/StyledComponents'
import { getTemplateFilePath } from '../../utils/helpers'
import FileNameTag from '../../../common/components/FileNameTag'

const RightContent = ({
  file,
  setFile,
  uploading,
  uploadProgress,
  feedType,
}) => {
  return (
    <ModalContentWrapper>
      <Header>
        Upload CSV to edit current data <Divider />
      </Header>
      <Container>
        <a href={getTemplateFilePath(feedType)} download>
          DOWNLOAD TEMPLATE <Icon type="download" />
        </a>
      </Container>
      <Dropzone
        maxSize={MAX_UPLOAD_FILE_SIZE}
        onDropRejected={(f) => {
          if (f[0].size > MAX_UPLOAD_FILE_SIZE) {
            notification({
              msg: 'Please select a file with size less than 30 MB.',
              type: 'error',
              exact: true,
            })
          }
        }}
        onDrop={([f]) => setFile(f)}
        accept=".csv, application/vnd.ms-excel, text/csv" // text/csv might not work for Windows based machines
        className="dropzone"
        activeClassName="active-dropzone"
        multiple={false}
        disabled={false}
      >
        {({ getRootProps, getInputProps, isDragActive }) => {
          return (
            <DropzoneContentContainer
              {...getRootProps()}
              className={`orders-dropzone ${
                isDragActive ? 'orders-dropzone--active' : ''
              }`}
              isDragActive={isDragActive}
            >
              {uploading ? (
                <StyledProgress percent={uploadProgress} />
              ) : (
                <>
                  <input {...getInputProps()} />
                  <FlexContainer
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <EduIf condition={file}>
                      <EduThen>
                        <FileNameTag
                          fileName={file?.name}
                          onClose={() => setFile(null)}
                        />
                      </EduThen>
                      <EduElse>
                        <IconUpload />
                        <StyledText>Drag & Drop</StyledText>
                        <StyledText $isComment>
                          {`or `}
                          <Underlined>browse</Underlined>
                          {` : CSV (30MB Max)`}
                        </StyledText>
                      </EduElse>
                    </EduIf>
                  </FlexContainer>
                </>
              )}
            </DropzoneContentContainer>
          )
        }}
      </Dropzone>
    </ModalContentWrapper>
  )
}

export default RightContent
