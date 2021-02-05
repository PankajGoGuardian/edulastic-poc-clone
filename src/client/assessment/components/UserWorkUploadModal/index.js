import React, { useState } from 'react'
import { FlexContainer } from '@edulastic/common'
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
  const handleChange = (e) => setActiveTab(e.target.value)

  const content =
    activeTab === TAB_CAMERA ? (
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
    )

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
        <StyledRadioGroup
          defaultValue={activeTab}
          onChange={handleChange}
          buttonStyle="solid"
        >
          <StyledRadioButton value={TAB_CAMERA}>
            TAKE A PICTURE
          </StyledRadioButton>
          <StyledRadioButton value={TAB_DRAG_DROP}>
            UPLOAD FILE
          </StyledRadioButton>
        </StyledRadioGroup>
        {content}
      </FlexContainer>
    </ConfirmationModal>
  )
}

export default UserWorkUploadModal
