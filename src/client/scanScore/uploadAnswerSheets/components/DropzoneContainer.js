import React from 'react'
import Dropzone from 'react-dropzone'
import { Row, Col, Progress } from 'antd'

import StyledDropZone from '../../../assessment/components/StyledDropZone'

export const DropzoneContainer = ({ handleDrop, uploadProgress }) => (
  <Dropzone
    onDrop={handleDrop}
    accept="application/pdf"
    className="dropzone"
    activeClassName="active-dropzone"
    multiple={false}
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
            <Row
              type="flex"
              gutter={[0, 25]}
              style={{ width: '100%', marginTop: '20px' }}
            >
              <Col span={24}>
                <Progress
                  strokeColor={{ from: '#0072ff', to: '#00d4ff' }}
                  percent={uploadProgress}
                  status="active"
                  showInfo={false}
                />
              </Col>
              {/* {fileRejections.length ? (
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
                        <span key={f.name} className="dropzone-list-item">
                          {f.name} - {f.size} bytes
                        </span>
                      ))}
                    </Col>
                  ) : null} */}
            </Row>
          </StyledDropZone>
        </div>
      )
    }}
  </Dropzone>
)

export default DropzoneContainer
