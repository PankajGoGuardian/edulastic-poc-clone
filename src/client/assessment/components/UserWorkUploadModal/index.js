import React, { useState } from 'react'
import { FlexContainer, hasMediaDevice } from '@edulastic/common'
import { StyledRadioButton, StyledRadioGroup } from './styled'
import CameraView from './CameraView'
import FileUploadView from './FileUploadView'
import { ConfirmationModal } from '../../../author/src/components/common/ConfirmationModal'

const UserWorkUploadModal = ({
  isModalVisible,
  onCancel,
  uploadFile,
  onUploadFinished,
}) => {
  const TAB_CAMERA = 'camera'
  const TAB_DRAG_DROP = 'dragAndDrop'
  const [activeTab, setActiveTab] = useState(TAB_CAMERA)
  const [hasCamera, setHasCamera] = useState(false)
  const handleChange = (e) => setActiveTab(e.target.value)

  // Check if the device has camera
  hasMediaDevice((val) => setHasCamera(val), 'videoinput')

  const fileUploadView = (
    <FileUploadView
      onCancel={onCancel}
      uploadFile={uploadFile}
      onUploadFinished={onUploadFinished}
    />
  )

  const cameraView = (
    <CameraView
      uploadFile={uploadFile}
      onCancel={onCancel}
      onUploadFinished={onUploadFinished}
      delayCount={3}
    />
  )

  // Hide the tabs if there is no camera on device
  const contentHeader = hasCamera && (
    <StyledRadioGroup
      defaultValue={activeTab}
      onChange={handleChange}
      buttonStyle="solid"
    >
      <StyledRadioButton value={TAB_CAMERA}>TAKE A PICTURE</StyledRadioButton>
      <StyledRadioButton value={TAB_DRAG_DROP}>UPLOAD FILE</StyledRadioButton>
    </StyledRadioGroup>
  )

  let contentBody = fileUploadView

  if (hasCamera && activeTab === TAB_CAMERA) {
    contentBody = cameraView
  }

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
        {contentHeader}
        {contentBody}
      </FlexContainer>
    </ConfirmationModal>
  )
}

export default UserWorkUploadModal
