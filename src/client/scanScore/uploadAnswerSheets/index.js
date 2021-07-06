import React, { useState, useMemo } from 'react'
import Dropzone from 'react-dropzone'
import { connect } from 'react-redux'
import { Row, Col, Progress } from 'antd'

import { aws } from '@edulastic/constants'
import { notification } from '@edulastic/common'
import { uploadToS3 } from '@edulastic/common/src/helpers'
import { assignmentApi } from '@edulastic/api'

import StyledDropZone from '../../assessment/components/StyledDropZone'
import Thumbnail from './Thumbnail'

import { getGroupedDocs } from '../ducks'

const UploadAnswerSheets = ({ location, groupedDocs }) => {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(null)
  const [uploadedFiles, setUploadedFiles] = useState([])

  const [assignmentId, sessionId] = useMemo(() => {
    const _assignmentId = location.state?.assignmentId || ''
    // TODO: generate by timestamp, use 'groupId' for now
    const _sessionId = location.state?.groupId || ''
    return [_assignmentId, _sessionId]
  }, [location.state])

  const handleProgress = (progressInfo) => {
    const { loaded: uploaded, total } = progressInfo
    const _progress = Math.floor((uploaded / total) * 100)
    setProgress(_progress)
  }

  const handleCancelUpload = (obj) => {
    console.log(obj)
  }

  const handleDrop = async ([file]) => {
    setUploading(true)
    const _uploadedFiles = []
    let sourceUri = ''
    try {
      sourceUri = await uploadToS3(
        file,
        aws.s3Folders.BUBBLE_SHEETS,
        handleProgress,
        handleCancelUpload,
        `${assignmentId}/${sessionId}`
      )
      if (sourceUri) {
        _uploadedFiles.push({ type: 'sourceUri', uri: sourceUri, file })
      }
    } catch (err) {
      notification({ type: 'error', msg: 'Failed to upload file' })
      console.log(err)
    }
    try {
      const {
        sheetUris = [],
        error,
      } = await assignmentApi.splitScanBubbleSheets({
        assignmentId,
        sessionId,
        sourceUri,
      })
      if (error) {
        notification({ type: 'error', msg: error.message })
      }
      _uploadedFiles.push(
        ...sheetUris.map((sheetUri) => ({ type: 'sheetUri', uri: sheetUri }))
      )
    } catch (e) {
      notification({ type: 'error', msg: 'Failed to scan uploaded file' })
    }
    setUploadedFiles(_uploadedFiles)
    setProgress(null)
    setUploading(false)
  }

  const handleLength = (str) => {
    if (str.length > 60) return `${str.substring(0, 58)}...`
    return str
  }

  const docsList = useMemo(
    () => groupedDocs?.[assignmentId]?.[sessionId] || [],
    [groupedDocs, assignmentId, sessionId]
  )

  return (
    <>
      <Dropzone
        onDrop={handleDrop}
        accept="image/*, application/pdf"
        className="dropzone"
        activeClassName="active-dropzone"
        multiple={false}
      >
        {({
          getRootProps,
          getInputProps,
          isDragActive,
          fileRejections = [],
        }) => {
          return (
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
                  {uploadedFiles.length ? (
                    <Col
                      className="dropzone-list-div"
                      xs={24}
                      sm={24}
                      md={12}
                      lg={12}
                      xl={12}
                    >
                      <span className="dropzone-list-label">
                        Uploaded Files:
                      </span>
                      {uploadedFiles
                        .filter((f) => f.type === 'sourceUri')
                        .map((f) => (
                          <span key={f.uri} className="dropzone-list-item">
                            {handleLength(f?.file.name)} - {f.file.size} bytes
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
                      <span className="dropzone-list-label">
                        Rejected Files:
                      </span>
                      {fileRejections.map((f) => (
                        <span key={f.path} className="dropzone-list-item">
                          {handleLength(f.path)} - {f.size} bytes
                        </span>
                      ))}
                    </Col>
                  ) : null}
                </Row>
              </StyledDropZone>
            </div>
          )
        }}
      </Dropzone>
      <div style={{ display: 'flex', margin: '10px 40px', flexWrap: 'wrap' }}>
        {docsList.map((doc) => (
          <Thumbnail key={doc.__id} doc={doc} />
        ))}
      </div>
    </>
  )
}

export default connect(
  (state) => ({
    groupedDocs: getGroupedDocs(state),
  }),
  {}
)(UploadAnswerSheets)
