import React from 'react'

import UploadProgress from './UploadProgress'
import DropzoneUploader from './DropzoneUploader'

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
    <DropzoneUploader handleDrop={handleDrop} />
  )
}

export default UploadPage
