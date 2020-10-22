import React, { useState, Suspense, lazy } from 'react'
import { EduButton } from '@edulastic/common'
import { Spin } from 'antd'

const Camera = lazy(() =>
  import(
    /* webpackChunkName: "camera" */ '@edulastic/common/src/components/Camera'
  )
)

const CameraWithButtons = ({
  onCancel,
  uploadFile,
  onUploadFinished,
  delayCount,
  isPhotoTakingDisabled,
  ...rest
}) => {
  const [isTakingPhoto, setIsTakingPhoto] = useState(false)
  const [hasCameraError, setHasCameraError] = useState(false)

  // Pass the imageData to callback and reset isTakingPhoto boolean.
  const handlePhoto = (imageData) => {
    const uri = uploadFile(imageData)
    setIsTakingPhoto(false)
    onUploadFinished([uri])
  }

  // Call the onCancel callback and reset isTakingPhoto boolean.
  const handleCancel = () => {
    setIsTakingPhoto(false)
    onCancel()
  }
  const handleCameraError = () => setHasCameraError(true)
  const handleTakePhoto = () => setIsTakingPhoto(true)

  const isTakePhotoButtonDisabled =
    isPhotoTakingDisabled || isTakingPhoto || hasCameraError

  return (
    <Suspense fallback={<Spin />}>
      <Camera
        isTakingPhoto={isTakingPhoto}
        onTakePhoto={handlePhoto}
        delayCount={delayCount}
        onCameraError={handleCameraError}
        {...rest}
      />
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
    </Suspense>
  )
}

export default CameraWithButtons
