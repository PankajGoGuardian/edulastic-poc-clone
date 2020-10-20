import React, { useState, Suspense, lazy } from 'react'
import { EduButton } from '@edulastic/common'
import { Spin } from 'antd'
import { ConfirmationModal } from '../../../author/src/components/common/ConfirmationModal'

const Camera = lazy(() =>
  import(
    /* webpackChunkName: "camera" */ '@edulastic/common/src/components/Camera'
  )
)

const CameraModal = ({
  isModalVisible,
  onCancel,
  onTakePhoto,
  delayCount,
  children,
  isPhotoTakingDisabled,
  ...rest
}) => {
  const [isTakingPhoto, setIsTakingPhoto] = useState(false)
  const [hasCameraError, setHasCameraError] = useState(false)

  // Pass the imageData to callback and reset isTakingPhoto boolean.
  const handlePhoto = (imageData) => {
    onTakePhoto(imageData)
    setIsTakingPhoto(false)
  }

  // Call the onCancel callback and reset isTakingPhoto boolean.
  const handleCancel = () => {
    onCancel()
    setIsTakingPhoto(false)
  }
  const handleCameraError = () => setHasCameraError(true)
  const handleTakePhoto = () => setIsTakingPhoto(true)

  const isTakePhotoButtonDisabled =
    isPhotoTakingDisabled || isTakingPhoto || hasCameraError

  return (
    <ConfirmationModal
      title="Take a Picture"
      visible={isModalVisible}
      onCancel={handleCancel}
      maskClosable={false}
      centered
      footer={[
        <EduButton height="40px" isGhost onClick={handleCancel}>
          NO, CANCEL
        </EduButton>,
        <EduButton
          height="40px"
          onClick={handleTakePhoto}
          disabled={isTakePhotoButtonDisabled}
        >
          TAKE PICTURE
        </EduButton>,
      ]}
    >
      {/* Unmount the camera when modal is closed, if not done even
      though modal is not visible Camera component keeps using the device
      camera in background */}
      {isModalVisible && (
        <Suspense fallback={<Spin />}>
          <Camera
            isTakingPhoto={isTakingPhoto}
            onTakePhoto={handlePhoto}
            delayCount={delayCount}
            onCameraError={handleCameraError}
            {...rest}
          />
        </Suspense>
      )}
      {children}
    </ConfirmationModal>
  )
}

export default CameraModal
