import React from 'react'
import PropTypes from 'prop-types'
import CameraView from './CameraView'
import FileUploadView from './FileUploadView'

const MainView = ({ isCameraView, onCancel, uploadFile, onUploadFinished }) => (
  <>
    {isCameraView ? (
      <CameraView
        uploadFile={uploadFile}
        onCancel={onCancel}
        onUploadFinished={onUploadFinished}
        delayCount={3}
      />
    ) : (
      <FileUploadView
        onCancel={onCancel}
        uploadFile={uploadFile}
        onUploadFinished={onUploadFinished}
      />
    )}
  </>
)

MainView.propTypes = {
  isCameraView: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  uploadFile: PropTypes.func.isRequired,
  onUploadFinished: PropTypes.func.isRequired,
}

export default MainView
