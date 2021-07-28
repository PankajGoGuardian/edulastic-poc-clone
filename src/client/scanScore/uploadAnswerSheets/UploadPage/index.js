import React from 'react'

import UploadProgress from './UploadProgress'
import DropzoneContainer from './DropzoneContainer'

const UploadPage = ({
  uploading,
  handleDrop,
  uploadProgress,
  handleCancelUpload,
}) => {
  return uploading ? (
    <UploadProgress
      uploading={uploading}
      uploadProgress={uploadProgress}
      handleCancelUpload={handleCancelUpload}
    />
  ) : (
    <DropzoneContainer uploading={uploading} handleDrop={handleDrop} />
  )
}

export default UploadPage
