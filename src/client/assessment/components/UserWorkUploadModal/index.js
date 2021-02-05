import React, { useState, useEffect } from 'react'
import { FlexContainer, hasMediaDevice } from '@edulastic/common'
import CameraView from './CameraView'
import { ConfirmationModal } from '../../../author/src/components/common/ConfirmationModal'

const UserWorkUploadModal = ({
  isModalVisible,
  onCancel,
  uploadFile,
  onUploadFinished,
}) => {
  const [hasCamera, setHasCamera] = useState(false)

  useEffect(async () => {
    const hasCameraMediaDevice = await hasMediaDevice('videoinput')
    setHasCamera(hasCameraMediaDevice)
  }, [])

  return (
    <ConfirmationModal
      title="Show your work"
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
          />
        )}
      </FlexContainer>
    </ConfirmationModal>
  )
}

export default UserWorkUploadModal
