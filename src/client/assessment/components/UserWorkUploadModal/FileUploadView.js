import React, { useState, useEffect } from 'react'
import { EduButton, FlexContainer, notification } from '@edulastic/common'
import { isEmpty } from 'lodash'
import { IconUpload } from '@edulastic/icons'
import { fileTypes } from '@edulastic/constants'
import useFilesUploader, { UPLOAD_STATUS } from '../../hooks/useFilesUploader'
import { Overlay, UploadDragger, Footer, Underlined } from './styled'
import ProgressBar from '../../widgets/UploadFile/components/ProgressBar'

const allowedTypes = [
  fileTypes.JPEG,
  fileTypes.PNG,
  fileTypes.JPG,
  fileTypes.GIF,
  fileTypes.DOC,
  fileTypes.DOCX,
  fileTypes.PDF,
  fileTypes.XLS,
  fileTypes.XLSX,
]
const MAX_SIZE_IN_BYTES = 1024 * 1024

const FilesUploadView = ({ onCancel, uploadFile, onUploadFinished }) => {
  const [isDragging, setIsDragging] = useState(false)
  const validateFile = ({ type, size }) => {
    if (!allowedTypes.includes(type)) {
      notification({ messageKey: 'pleaseUploadFileInRequiredFormat' })
      return false
    }

    if (size > MAX_SIZE_IN_BYTES) {
      notification({ messageKey: 'fileSizeError1MB' })
      return false
    }

    return true
  }

  const {
    filesInfo,
    isUploadingFiles,
    addFiles,
    uploadFiles,
    deleteFile,
  } = useFilesUploader(uploadFile, validateFile)

  // This makes sure all the files have been processed for uploading before calling the
  // onUploadFinished callback. Means all files have one of the status: Success, Cancelled or Failed
  useEffect(() => {
    if (isEmpty(filesInfo)) {
      return
    }

    for (const key in filesInfo) {
      if (
        !filesInfo[key].status ||
        filesInfo[key].status === UPLOAD_STATUS.UPLOADING
      ) {
        return
      }
    }

    const filesToSave = Object.values(filesInfo).map(
      ({ name, type, size, source }) => ({
        name,
        type,
        size,
        source,
      })
    )
    onUploadFinished(filesToSave)
  }, [filesInfo])

  const handleChange = ({ file }) => addFiles([file])

  const uploadProps = {
    beforeUpload: () => false,
    onChange: handleChange,
    accept: allowedTypes.join(),
    multiple: true,
    showUploadList: false,
    disabled: isUploadingFiles,
  }

  const uploadProgressArray = Object.keys(filesInfo)
    .filter(
      (key) =>
        ![UPLOAD_STATUS.CANCELLED, UPLOAD_STATUS.FAILED].includes(
          filesInfo[key].status
        )
    )
    .map((key) => ({ ...filesInfo[key] }))

  const isUploadDisabled = isUploadingFiles || isEmpty(filesInfo)
  return (
    <FlexContainer justifyContent="center" flexDirection="column" width="100%">
      <UploadDragger {...uploadProps}>
        <Overlay
          onDragOver={() => setIsDragging(true)}
          onDrop={() => setIsDragging(false)}
          onDragLeave={() => setIsDragging(false)}
          isDragging={isDragging}
        />
        <IconUpload />
        <h3>
          <strong>DRAG & DROP YOUR FILE</strong>
        </h3>
        or <Underlined>browse</Underlined> DOC, XLS, PDF, PNG, JPG, GIF (1024KB
        MAX.)
      </UploadDragger>

      {!isEmpty(uploadProgressArray) && (
        <FlexContainer flexWrap="wrap" mt="26px" justifyContent="flex-start">
          {uploadProgressArray.map((file, i) => (
            <ProgressBar
              cols={1}
              data={file}
              key={i}
              hidebar={!file.percent}
              onCancel={deleteFile}
              index={i}
            />
          ))}
        </FlexContainer>
      )}
      <Footer>
        <EduButton height="40px" isGhost onClick={onCancel}>
          NO, CANCEL
        </EduButton>
        <EduButton
          height="40px"
          onClick={uploadFiles}
          disabled={isUploadDisabled}
        >
          UPLOAD
        </EduButton>
      </Footer>
    </FlexContainer>
  )
}

export default FilesUploadView
