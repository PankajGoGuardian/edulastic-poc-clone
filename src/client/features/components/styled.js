import { linkColor1, themeColor, white } from '@edulastic/colors'
import { CustomModalStyled } from '@edulastic/common'
import { Button } from 'antd'
import styled from 'styled-components'

export const PremiumModal = styled(CustomModalStyled)`
  min-width: 500px;
  .ant-modal-content {
    padding: 12px 16px;
    ${(p) => (p.right ? `right: ${p.right}; position: fixed;` : '')}
    & .ant-modal-body {
      padding: 0;
    }
  }
`

export const PopoverWrapper = styled.div`
  .ant-popover-content {
    margin-top: -6px;
  }

  .ant-popover-arrow {
    top: 0px !important;
    display: block;
  }
`

export const PopoverTitle = styled.h4`
  color: ${themeColor};
  text-align: left;
  width: 100%;
  font-weight: 700;
`

export const PopoverDetail = styled.p`
  text-align: left;
  margin-bottom: 10px;
  text-align: left;
  font: Regular 13px/18px Open Sans;
  letter-spacing: 0.24px;
  color: ${linkColor1};
`

export const PopoverCancel = styled(Button)`
  background: transparent;
  outline: none;
  border: none;
  color: ${themeColor};
  font-size: 12px;
  font-weight: 600;

  &:hover,
  &:focus {
    color: ${themeColor};
    opacity: 0.9;
  }
`

export const UpgradeBtn = styled(Button)`
  background: ${themeColor};
  color: ${white};
  font-size: 12px;

  &:hover,
  &:focus {
    background: ${themeColor};
    color: ${white};
    opacity: 0.9;
  }
`

export const CloseButton = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 18px;
  cursor: pointer;
`
