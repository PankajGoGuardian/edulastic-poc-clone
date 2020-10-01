import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { DropAreaContainer, UploadDragger } from './styled'
import BodyWrapper from '../../../AssignmentCreate/common/BodyWrapper'
import FlexWrapper from '../../../AssignmentCreate/common/FlexWrapper'
import CreateUpload from '../CreateUpload/CreateUpload'
import CreateBlank from '../CreateBlank/CreateBlank'

const DropArea = ({
  onUpload,
  onCreateBlank,
  loading,
  percent,
  fileInfo,
  cancelUpload,
  uploadToDrive,
  assesmentMetadata = {},
}) => {
  const [isDragging, setIsDragging] = useState(false)

  return (
    <BodyWrapper>
      <DropAreaContainer
        onDragOver={() => setIsDragging(true)}
        onDrop={() => setIsDragging(false)}
        onDragLeave={() => setIsDragging(false)}
        isDragging={isDragging}
      >
        <UploadDragger
          name="file"
          onChange={onUpload}
          openFileDialogOnClick={false}
          disabled={loading}
          beforeUpload={() => false}
          accept=".pdf"
        >
          {isDragging ? <h1>Drop Files to Get Started !</h1> : null}
        </UploadDragger>
      </DropAreaContainer>
      <FlexWrapper marginBottom="0px">
        <CreateUpload
          isDragging={isDragging}
          creating={loading}
          percent={percent}
          fileInfo={fileInfo}
          cancelUpload={cancelUpload}
          onUpload={onUpload}
          uploadToDrive={uploadToDrive}
          assesmentMetadata={assesmentMetadata}
        />
        <CreateBlank onCreate={onCreateBlank} loading={loading} />
      </FlexWrapper>
    </BodyWrapper>
  )
}

DropArea.propTypes = {
  loading: PropTypes.bool.isRequired,
  onUpload: PropTypes.func.isRequired,
  onCreateBlank: PropTypes.func.isRequired,
}

export default DropArea
