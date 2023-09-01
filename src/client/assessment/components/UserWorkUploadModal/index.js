import React, { useState, useEffect } from 'react'
import { FlexContainer, hasMediaDevice } from '@edulastic/common'
import CameraView from './CameraView'
import { ConfirmationModal } from '../../../author/src/components/common/ConfirmationModal'

const UserWorkUploadModal = ({
  isModalVisible,
  onCancel,
  uploadFile,
  onUploadFinished,
  cameraImageName,
}) => {
  const [hasCamera, setHasCamera] = useState(false)

  useEffect(() => {
    async function cameraStateSetter() {
      const hasCameraMediaDevice = await hasMediaDevice('videoinput')
      setHasCamera(hasCameraMediaDevice)
    }
    cameraStateSetter()
  }, [])

  useEffect(() => {
    if (isModalVisible) {
      setTimeout(() => {
        const x = document.querySelector('.ant-modal-content')
        x.setAttribute('tabindex', 1)
        x.focus()
      }, 10)
    }
  }, [isModalVisible])

  return (
    <ConfirmationModal
      title="Upload Work"
      visible={isModalVisible}
      onCancel={onCancel}
      destroyOnClose
      maskClosable={false}
      centered
      footer={null}
    >
      <FlexContainer
        justifyContent="flex-start"
        flexDirection="column"
        width="100%"
      >
        {hasCamera && (
          <CameraView
            uploadFile={uploadFile}
            onCancel={onCancel}
            onUploadFinished={onUploadFinished}
            delayCount={3}
            cameraImageName={cameraImageName}
          />
        )}
      </FlexContainer>
    </ConfirmationModal>
  )
}

export default UserWorkUploadModal
