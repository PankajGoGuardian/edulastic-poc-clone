import React from 'react'
import { StyledModal } from './styled'

const UpdateTestSettingsModal = ({
  visible,
  handleResponse,
  settingDetails,
  disableSaveNew = false,
  closeModal,
}) => {
  return (
    <StyledModal
      visible={visible}
      onCancel={(e) =>
        e.target.name === 'cancel-button' ? handleResponse(false) : closeModal()
      }
      title={<h2>Edit Saved Setting</h2>}
      cancelText="NO, SAVE NEW"
      cancelButtonProps={{
        disabled: disableSaveNew,
        title: disableSaveNew
          ? 'Maximum limit reached. Please delete existing one to add new.'
          : '',
        name: 'cancel-button',
      }}
      okText="YES, UPDATE"
      onOk={() => handleResponse(true)}
      destroyOnClose
      centered
    >
      <div>
        Update existing <span>{settingDetails?.title}</span> saved settings?
      </div>
    </StyledModal>
  )
}

export default UpdateTestSettingsModal
