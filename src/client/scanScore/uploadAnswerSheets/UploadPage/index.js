import React from 'react'

import { FlexContainer } from '@edulastic/common'
import UploadProgress from './UploadProgress'
import DropzoneUploader from './DropzoneUploader'
// import CameraUploader from './CameraUploader'

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
      {/* NOTE: Disabled camera upload due to customer issues ref. https://goguardian.atlassian.net/browse/EV-42994 */}
      {/* <CameraUploader /> */}
    </FlexContainer>
  )
}

export default UploadPage
