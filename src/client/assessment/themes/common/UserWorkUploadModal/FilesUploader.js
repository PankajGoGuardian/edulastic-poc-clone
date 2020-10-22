import React, { useState, useRef } from 'react'
import { EduButton, FlexContainer } from '@edulastic/common'
import { isEmpty } from 'lodash'
import { Upload } from 'antd'
import { IconUpload } from '@edulastic/icons'
import { fileTypes } from '@edulastic/constants'
import ProgressBar from '../../../widgets/UploadFile/components/ProgressBar'

const { Dragger } = Upload
const allowedTypes = [
  fileTypes.IMAGES,
  fileTypes.DOC,
  fileTypes.DOCX,
  fileTypes.PDF,
  fileTypes.XLS,
  fileTypes.XLSX,
]

const FilesUploadView = ({ onCancel, uploadFile, onUploadFinished }) => {
  const [filesToUpload, setFilesToUpload] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const stateUpdateHelperRef = useRef()
  const draggerRef = useRef()
  const UPLOAD_STATUS_CANCELLED = 'upload status cancelled'

  const handleChange = (info) => {
    const { file } = info
    const newFilesToUpload = [...filesToUpload, file]
    stateUpdateHelperRef.current = newFilesToUpload
    setFilesToUpload(newFilesToUpload)
  }

  const validateFile = (file) => {
    if (!allowedTypes.includes(file.type)) {
      return false
    }
  }

  const uploadProps = {
    beforeUpload: () => false,
    onChange: handleChange,
    accept: allowedTypes.join(),
    multiple: true,
    showUploadList: false,
  }

  const onUploadSuccess = (index) => (uri) => {
    if (stateUpdateHelperRef.current) {
      stateUpdateHelperRef.current[index].source = uri
    }
  }

  const onCancelUpload = (index) => {
    if (stateUpdateHelperRef.current) {
      const { cancel } = stateUpdateHelperRef.current[index]
      if (typeof cancel === 'function') {
        cancel('Canceled By User')
      }
      stateUpdateHelperRef.current[index].status = UPLOAD_STATUS_CANCELLED
      setFilesToUpload([...stateUpdateHelperRef.current])
    }
  }

  const onProgress = (index) => (e) => {
    if (stateUpdateHelperRef.current) {
      const percent = Math.round((e.loaded * 100) / e.total)
      console.log(percent)
      stateUpdateHelperRef.current[index].percent = percent
      setFilesToUpload([...stateUpdateHelperRef.current])
    }
  }

  const setCancelUploadFn = (index) => (fn) => {
    if (stateUpdateHelperRef.current) {
      stateUpdateHelperRef.current[index].cancel = fn
    }
  }

  const handleFilesUpload = () => {
    setIsUploading(true)
    filesToUpload.forEach((file, i) => {
      if (UPLOAD_STATUS_CANCELLED !== file.status) {
        try {
          uploadFile(
            file,
            onProgress(i),
            setCancelUploadFn(i),
            validateFile,
            onUploadSuccess(i)
          )
        } catch (e) {
          console.log(e)
        }
      }
    })

    setIsUploading(false)
    const URIs = filesToUpload
      .filter((file) => UPLOAD_STATUS_CANCELLED !== file.status)
      .map((file) => file.source)
    // onUploadFinished(URIs)
  }

  const uploadProgressArray = filesToUpload
    .filter((file) => file.status !== UPLOAD_STATUS_CANCELLED)
    .map(({ uid, type, name, size, percent, source }) => {
      return { uid, type, name, size, percent, source }
    })

  console.log(draggerRef)
  return (
    <FlexContainer
      justifyContent="flex-start"
      flexDirection="column"
      width="100%"
    >
      <Dragger {...uploadProps} ref={draggerRef}>
        <p className="ant-upload-drag-icon">
          <IconUpload />
        </p>
        <h2>
          <strong>DRAG AND DROP YOUR FILE</strong>
        </h2>
        <p className="ant-upload-hint">
          or browse DOC, XLS, PDF, PNG, JPG, GIF (1024KB MAX.)
        </p>
      </Dragger>
      {!isEmpty(uploadProgressArray) && (
        <FlexContainer flexWrap="wrap" mt="26px" justifyContent="flex-start">
          {uploadProgressArray.map((file, i) => (
            <ProgressBar
              cols={1}
              data={file}
              key={file.uid}
              hidebar={undefined === file.percent}
              onCancel={onCancelUpload}
              index={i}
            />
          ))}
        </FlexContainer>
      )}
      <FlexContainer justifyContent="center" flexDirection="row" width="100%">
        <EduButton height="40px" isGhost onClick={onCancel}>
          NO, CANCEL
        </EduButton>
        <EduButton
          height="40px"
          onClick={handleFilesUpload}
          disabled={isUploading}
        >
          UPLOAD
        </EduButton>
      </FlexContainer>
    </FlexContainer>
  )
}

export default FilesUploadView
