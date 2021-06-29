import React, { useState, useMemo } from 'react'
import Dropzone from 'react-dropzone'
import { Row, Col, Progress } from 'antd'

import { aws } from '@edulastic/constants'
import { uploadToS3 } from '@edulastic/common/src/helpers'
import StyledDropZone from '../../assessment/components/StyledDropZone'

const UploadAnswerSheets = ({ location }) => {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(null)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [uploadedFiles, setUploadedFiles] = useState([])

  const s3SubFolder = useMemo(() => location.state?.assignmentId || '', [
    location.state,
  ])

  const handleProgress = (progressInfo) => {
    const { loaded: uploaded, total } = progressInfo
    const _progress = Math.floor((uploaded / total) * 100)
    setProgress(_progress)
  }

  const handleCancelUpload = (obj) => {
    console.log(obj)
  }

  const handleDrop = (files) => {
    setUploading(true)
    setSelectedFiles([...files])
    setUploadedFiles([])
    files.forEach(async (file) => {
      try {
        const fileUri = await uploadToS3(
          file,
          aws.s3Folders.BUBBLE_SHEET,
          handleProgress,
          handleCancelUpload,
          s3SubFolder
        )
        if (fileUri) {
          setUploadedFiles((_uploadedFiles) => [
            ..._uploadedFiles,
            { uri: fileUri, file },
          ])
          setSelectedFiles((_selectedFiles) =>
            _selectedFiles.filter(
              (_selectedFile) =>
                _selectedFile.name !== file.name &&
                _selectedFile.type !== file.type
            )
          )
        }
      } catch (error) {
        console.log(error)
      }
      setProgress(null)
    })
    setUploading(false)
  }

  const handleLength = (str) => {
    if (str.length > 60) return `${str.substring(0, 58)}...`
    return str
  }

  return (
    <Dropzone
      onDrop={handleDrop}
      accept="image/*, application/pdf"
      className="dropzone"
      activeClassName="active-dropzone"
      multiple={false}
    >
      {({ getRootProps, getInputProps, isDragActive, fileRejections = [] }) => (
        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? 'dropzone--isActive' : ''}`}
        >
          <input {...getInputProps()} />

          <StyledDropZone
            isDragActive={isDragActive}
            dropzoneSettings={{
              name: 'File',
              allowedFiles: 'PDF, JPEG, JPG, PNG',
            }}
          >
            <Row
              type="flex"
              gutter={[0, 25]}
              style={{ width: '100%', marginTop: '20px' }}
            >
              <Col span={24}>
                <Progress
                  strokeColor={{ from: '#108ee9', to: '#87d068' }}
                  percent={progress}
                  status="active"
                />
              </Col>
              {selectedFiles.length ? (
                <Col
                  className="dropzone-list-div"
                  xs={24}
                  sm={24}
                  md={12}
                  lg={12}
                  xl={12}
                >
                  <span className="dropzone-list-label">Selected Files:</span>
                  {selectedFiles.map((file) => (
                    <span key={file.path} className="dropzone-list-item">
                      {handleLength(file.path)} - {file.size} bytes
                    </span>
                  ))}
                </Col>
              ) : null}
              {uploadedFiles.length ? (
                <Col
                  className="dropzone-list-div"
                  xs={24}
                  sm={24}
                  md={12}
                  lg={12}
                  xl={12}
                >
                  <span className="dropzone-list-label">Uploaded Files:</span>
                  {uploadedFiles.map((uploadedFile) => (
                    <span key={uploadedFile.uri} className="dropzone-list-item">
                      {handleLength(uploadedFile.file.name)} -{' '}
                      {uploadedFile.file.size} bytes
                    </span>
                  ))}
                </Col>
              ) : null}
              {fileRejections.length ? (
                <Col
                  className="dropzone-list-div"
                  xs={24}
                  sm={24}
                  md={12}
                  lg={12}
                  xl={12}
                >
                  <br />
                  <span className="dropzone-list-label">Rejected Files:</span>
                  {fileRejections.map((file) => (
                    <span key={file.path} className="dropzone-list-item">
                      {handleLength(file.path)} - {file.size} bytes
                    </span>
                  ))}
                </Col>
              ) : null}
            </Row>
          </StyledDropZone>
        </div>
      )}
    </Dropzone>
  )
}

export default UploadAnswerSheets
