import { linkColor1, themeColor, white } from '@edulastic/colors'
import { IconLock as LockIcon, IconPlusCircle } from '@edulastic/icons'
import Button from "antd/es/Button";
import Typography from "antd/es/Typography";
import styled from 'styled-components'

const { Text } = Typography

export const TitleWrapper = styled.h1`
  font-size: ${(props) => props.theme.header.headerTitleFontSize};
  color: ${(props) => props.theme.header.headerTitleTextColor};
  font-weight: bold;
  line-height: normal;
  margin: 0px;
`

export const IconPlus = styled(IconPlusCircle)`
  margin-right: 0.5rem;
  width: 20px;
  height: 20px;
`

export const IconLock = styled(LockIcon)`
  margin-right: 0.5rem;
  width: 20px;
  height: 20px;
`

export const ButtonText = styled(Text)`
  font-size: 13px;
  padding: 0 10px 0 10px;
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
