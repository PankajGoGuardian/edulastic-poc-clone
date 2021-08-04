import React from 'react'
import { Drawer } from 'antd'
import { FlexContainer } from '@edulastic/common'
import styled from 'styled-components'
import { IconClose } from '@edulastic/icons'
import { greyThemeDark1, greyThemeDark4 } from '@edulastic/colors'

const ToolsContiner = ({ visible, onClose, children }) => {
  return (
    <Drawer
      placement="right"
      width={610}
      zIndex={1050}
      onClose={onClose}
      visible={visible}
      closable={false}
      headerStyle={{ border: 'none', padding: '16px 30px' }}
      bodyStyle={{ padding: 0 }}
      title={
        <FlexContainer justifyContent="space-between">
          <ToolsHeader>Graphing Objects Selector</ToolsHeader>
          <CloseIcon onClick={onClose} />
        </FlexContainer>
      }
    >
      <DrawerBody>{children}</DrawerBody>
    </Drawer>
  )
}

export default ToolsContiner

const ToolsHeader = styled.span`
  color: ${greyThemeDark4};
  font-weight: bold;
  font-size: 18px;
`

const CloseIcon = styled(IconClose)`
  fill: ${greyThemeDark1};
  cursor: pointer;
`

const DrawerBody = styled.div`
  padding: 8px 30px;
`
