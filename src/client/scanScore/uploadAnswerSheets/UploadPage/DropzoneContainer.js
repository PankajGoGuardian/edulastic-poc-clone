import React from 'react'
import Dropzone from 'react-dropzone'

import StyledDropZone from '../../../assessment/components/StyledDropZone'

export const DropzoneContainer = ({ handleDrop, uploading }) => (
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
              allowedFiles: 'PDF',
            }}
          >
            {/* {fileRejections.length ? (
              <Col className="dropzone-list-div" span={24}>
                <br />
                <span className="dropzone-list-label">Rejected Files:</span>
                {fileRejections.map((f) => (
                  <span key={f.name} className="dropzone-list-item">
                    {f.name} - {f.size} bytes
                  </span>
                ))}
              </Col>
            ) : null} */}
          </StyledDropZone>
        </div>
      )
    }}
  </Dropzone>
)

export default DropzoneContainer
