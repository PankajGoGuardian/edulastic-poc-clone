import React, { useState, Suspense, lazy } from 'react'
import { EduButton, notification } from '@edulastic/common'
import { Spin } from 'antd'
import { fileTypes } from '@edulastic/constants'
import { Footer } from './styled'
import useFilesUploader from '../../hooks/useFilesUploader'

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
  ...rest
}) => {
  const [isTakingPhoto, setIsTakingPhoto] = useState(false)
  const [hasCameraError, setHasCameraError] = useState(false)

  const onUploadSuccess = (filesInfo) => {
    setIsTakingPhoto(false)
    const URI = filesInfo.map((fileInfo) => fileInfo.source)
    onUploadFinished(URI)
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
    imageBlob.name = 'cameraPhoto.png'
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
      <Footer className>
        <EduButton height="40px" isGhost onClick={handleCancel}>
          NO, CANCEL
        </EduButton>
        <EduButton
          height="40px"
          onClick={handleTakePhoto}
          disabled={isTakePhotoButtonDisabled}
        >
          TAKE PICTURE
        </EduButton>
      </Footer>
    </Suspense>
  )
}

export default CameraWithButtons
