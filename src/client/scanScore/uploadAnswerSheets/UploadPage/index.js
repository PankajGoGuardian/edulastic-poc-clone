import React from 'react'

import UploadProgress from './UploadProgress'
import DropzoneUploader from './DropzoneUploader'
import CameraUploader from './CameraUploader'
import { FlexContainer } from '@edulastic/common'

const UploadPage = ({
  uploading,
  uploadProgress,
  currentSession,
  handleDrop,
  handleCancelUpload,
}) => {
  return uploading ? (
    <UploadProgress
      uploadProgress={uploadProgress}
      currentSession={currentSession}
      handleCancelUpload={handleCancelUpload}
    />
  ) : (
    <FlexContainer marginLeft="20px" mr="20px">
      <DropzoneUploader handleDrop={handleDrop} />
      <CameraUploader />
    </FlexContainer>
  )
}

export default UploadPage
