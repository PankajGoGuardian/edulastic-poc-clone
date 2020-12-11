import React from 'react'
import Drawer from "antd/es/Drawer";
import { FlexContainer } from '@edulastic/common'
import { SettingHeader, CloseIcon } from '../styled'

const CustomDrawer = ({ visible, onClose, children }) => {
  return (
    <Drawer
      placement="right"
      width={600}
      zIndex={1050}
      onClose={onClose}
      visible={visible}
      closable={false}
      headerStyle={{ border: 'none', padding: '16px 30px' }}
      bodyStyle={{ padding: 0 }}
      title={
        <FlexContainer justifyContent="space-between">
          <SettingHeader>Evaluation Settings</SettingHeader>
          <CloseIcon onClick={onClose} />
        </FlexContainer>
      }
    >
      {children}
    </Drawer>
  )
}

export default CustomDrawer
