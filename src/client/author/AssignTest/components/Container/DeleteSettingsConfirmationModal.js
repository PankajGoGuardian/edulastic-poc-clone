import React from 'react'
import { StyledModal } from './styled'

const DeleteTestSettingsModal = ({
  visible,
  handleResponse,
  settingDetails,
}) => {
  return (
    <StyledModal
      visible={visible}
      onCancel={() => handleResponse(false)}
      title={<h2>Delete Settings</h2>}
      cancelText="NO, CANCEL"
      okText="YES, DELETE"
      onOk={() => handleResponse(true)}
      destroyOnClose
      centered
    >
      <div>
        <span>{settingDetails?.title}</span> will be deleted from the list. Are
        you sure?
      </div>
    </StyledModal>
  )
}

export default DeleteTestSettingsModal
