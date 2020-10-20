import React, { useState } from 'react'
import { EduButton } from '@edulastic/common'
import Camera from '@edulastic/common/src/components/Camera'
import { ConfirmationModal } from '../../../author/src/components/common/ConfirmationModal'

const CameraModal = ({
  isModalVisible,
  onCancel,
  onTakePhoto,
  delayCount,
  children,
  ...rest
}) => {
  const [isTakingPhoto, setIsTakingPhoto] = useState(false)

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

  const handleTakePhoto = () => setIsTakingPhoto(true)

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
          disabled={isTakingPhoto}
        >
          TAKE PICTURE
        </EduButton>,
      ]}
    >
      {/* Unmount the camera when modal is closed, if not done even
      though modal is not visible Camera component keeps using the device
      camera in background */}
      {isModalVisible ? (
        <Camera
          isTakingPhoto={isTakingPhoto}
          onTakePhoto={handlePhoto}
          delayCount={delayCount}
          {...rest}
        />
      ) : null}
      {children}
    </ConfirmationModal>
  )
}

export default CameraModal
