import React from 'react'
import { Spin } from 'antd'
import { createPortal } from 'react-dom'
import styled from 'styled-components'
import { lightFadedBlack } from '@edulastic/colors'

const PortalSpinner = () => {
  return createPortal(
    <SpinnerContainer>
      <Spin />
    </SpinnerContainer>,
    document.body
  )
}
export default PortalSpinner

const SpinnerContainer = styled.div`
  position: fixed;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  z-index: 9999;
  background: ${lightFadedBlack};
`
