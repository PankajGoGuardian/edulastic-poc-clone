import React, { useState } from 'react'
import { Input } from 'antd'
import { notification } from '@edulastic/common'
import { StyledModal } from './styled'

const SaveTestSettingsModal = ({ visible, toggleModal, handleSave }) => {
  const [settingName, setSettingName] = useState('')
  return (
    <StyledModal
      visible={visible}
      onCancel={() => toggleModal(false)}
      title={<h2>Save Current Settings</h2>}
      cancelText="NO, CANCEL"
      okText="YES, SAVE"
      onOk={() => {
        if (!settingName)
          return notification({
            msg: 'Please Enter setting name before saving the settings',
          })
        handleSave(settingName)
      }}
    >
      <label>SETTINGS NAME</label>
      <Input
        value={settingName}
        onChange={(e) => setSettingName(e.target.value)}
        placeholder="Enter settings name"
      />
    </StyledModal>
  )
}

export default SaveTestSettingsModal
