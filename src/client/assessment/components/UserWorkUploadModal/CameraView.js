import React, { useState, Suspense, lazy } from 'react'
import { EduButton, notification } from '@edulastic/common'
import { Spin } from 'antd'
import { fileTypes } from '@edulastic/constants'
import { connect } from 'react-redux'
import { Footer } from './styled'
import useFilesUploader from '../../hooks/useFilesUploader'
import { playerSkinTypeSelector } from '../../selectors/test'

const Camera = lazy(() =>
  import(
    /* webpackChunkName: "camera" */ '@edulastic/common/src/components/Camera'
  )
)

// Since the image comes from Camera, it should be PNG. Validate before uploading.
const allowedTypes = [fileTypes.PNG]
// Since the image comes from Camera, size depends upon resolution of device camera.
// For good cameras file size could be upto 5MBs.
const MAX_SIZE_IN_BYTES = 5 * 1024 * 1024

const CameraWithButtons = ({
  onCancel,
  uploadFile,
  onUploadFinished,
  delayCount,
  cameraImageName,
  playerSkinType,
  ...rest
}) => {
  const [isTakingPhoto, setIsTakingPhoto] = useState(false)
  const [hasCameraError, setHasCameraError] = useState(false)

  const onUploadSuccess = (filesInfo) => {
    setIsTakingPhoto(false)
    const files = filesInfo.map(({ name, type, size, source }) => ({
      name,
      type,
      size,
      source,
    }))
    onUploadFinished(files)
  }

  const validateFile = ({ type, size }) => {
    if (!allowedTypes.includes(type)) {
      notification({ messageKey: 'pleaseUploadFileInRequiredFormat' })
      return false
    }

    if (size > MAX_SIZE_IN_BYTES) {
      notification({ messageKey: 'fileSizeError5MB' })
      return false
    }

    return true
  }

  const { isUploadingFiles, addFiles, uploadFiles } = useFilesUploader(
    uploadFile,
    validateFile,
    onUploadSuccess
  )

  // Pass the imageData to callback and reset isTakingPhoto boolean.
  const handlePhotoData = (imageBlob) => {
    imageBlob.lastModifiedDate = new Date()
    imageBlob.name = cameraImageName
    addFiles([imageBlob])
    uploadFiles()
  }

  // Call the onCancel callback and reset isTakingPhoto boolean.
  const handleCancel = () => {
    setIsTakingPhoto(false)
    onCancel()
  }
  const handleCameraError = () => setHasCameraError(true)
  const handleTakePhoto = () => setIsTakingPhoto(true)

  const isTakePhotoButtonDisabled =
    isUploadingFiles || isTakingPhoto || hasCameraError

  return (
    <Suspense fallback={<Spin />}>
      <Camera
        isTakingPhoto={isTakingPhoto}
        onTakePhoto={handlePhotoData}
        delayCount={delayCount}
        onCameraError={handleCameraError}
        {...rest}
      />
      {isUploadingFiles && <Spin />}
      {!hasCameraError && (
        <Footer playerSkinType={playerSkinType}>
          <EduButton
            data-cy="cancelUploadButton"
            height="40px"
            isGhost
            onClick={handleCancel}
          >
            NO, CANCEL
          </EduButton>
          <EduButton
            data-cy="takePictureButton"
            height="40px"
            onClick={handleTakePhoto}
            disabled={isTakePhotoButtonDisabled}
          >
            TAKE PICTURE
          </EduButton>
        </Footer>
      )}
    </Suspense>
  )
}

export default connect(
  (state) => ({
    playerSkinType: playerSkinTypeSelector(state),
  }),
  null
)(CameraWithButtons)
