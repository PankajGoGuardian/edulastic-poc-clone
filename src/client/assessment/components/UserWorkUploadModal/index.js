import React, { useState, useEffect } from 'react'
import { FlexContainer, hasMediaDevice } from '@edulastic/common'
import { StyledRadioButton, StyledRadioGroup } from './styled'
import MainView from './MainView'
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
        )}
        <MainView
          isCameraView={hasCamera && activeTab === TAB_CAMERA}
          uploadFile={uploadFile}
          onCancel={onCancel}
          onUploadFinished={onUploadFinished}
        />
      </FlexContainer>
    </ConfirmationModal>
  )
}

export default UserWorkUploadModal
