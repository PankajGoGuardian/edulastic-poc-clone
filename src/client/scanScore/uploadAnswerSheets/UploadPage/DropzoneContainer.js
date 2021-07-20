import React from 'react'
import Dropzone from 'react-dropzone'
import { Progress, Button } from 'antd'

import StyledDropZone from '../../../assessment/components/StyledDropZone'

export const DropzoneContainer = ({
  handleDrop,
  uploadProgress,
  uploading,
  handleCancelUpload,
}) => (
  <Dropzone
    onDrop={handleDrop}
    accept="application/pdf"
    className="dropzone"
    activeClassName="active-dropzone"
    multiple={false}
    disabled={uploading}
  >
    {({ getRootProps, getInputProps, isDragActive, fileRejections = [] }) => {
      return (
        <div
          {...getRootProps()}
          className={`omr-dropzone ${
            isDragActive ? 'omr-dropzone--active' : ''
          }`}
        >
          <input {...getInputProps()} />
          <StyledDropZone
            isDragActive={isDragActive}
            dropzoneSettings={{
              name: 'File',
              allowedFiles: 'PDF, JPEG, JPG, PNG',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                marginTop: '20px',
              }}
            >
              <Progress
                strokeColor={{ from: '#0072ff', to: '#00d4ff' }}
                percent={uploadProgress}
                status="active"
                showInfo={false}
              />
              {handleCancelUpload && (
                <Button
                  type="primary"
                  onClick={handleCancelUpload}
                  style={{ marginLeft: '25px' }}
                >
                  Cancel
                </Button>
              )}
              {/* {fileRejections.length ? (
                    <Col className="dropzone-list-div" span={24}>
                      <br />
                      <span className="dropzone-list-label">
                        Rejected Files:
                      </span>
                      {fileRejections.map((f) => (
                        <span key={f.name} className="dropzone-list-item">
                          {f.name} - {f.size} bytes
                        </span>
                      ))}
                    </Col>
                  ) : null} */}
            </div>
          </StyledDropZone>
        </div>
      )
    }}
  </Dropzone>
)

export default DropzoneContainer
