import React from 'react'
import Dropzone from 'react-dropzone'
import styled from 'styled-components'

import StyledDropZone from '../../../assessment/components/StyledDropZone'

const DropzoneUploader = ({ handleDrop, disabled = false }) => (
  <Dropzone
    onDrop={handleDrop}
    accept="application/pdf"
    className="dropzone"
    activeClassName="active-dropzone"
    multiple={false}
    disabled={disabled}
  >
    {({ getRootProps, getInputProps, isDragActive }) => {
      return (
        <DropzoneContentContainer
          {...getRootProps()}
          className={`omr-dropzone ${
            isDragActive ? 'omr-dropzone--active' : ''
          }`}
        >
          <input {...getInputProps()} />
          <StyledDropZone
            isDragActive={isDragActive}
            dropzoneSettings={{
              name: false,
              allowedFiles: 'BUBBLE SHEET FORMS (PDF, MAX 1MB)',
            }}
            containerHeight="500px"
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
        </DropzoneContentContainer>
      )
    }}
  </Dropzone>
)

export default DropzoneUploader

const DropzoneContentContainer = styled.div`
  width: 100%;
`
