import { darkGrey, grey, themeColor } from '@edulastic/colors'
import { IconCaretDown, IconClose } from '@edulastic/icons'
import { Menu, Popover, Typography } from 'antd'
import styled, { createGlobalStyle } from 'styled-components'

export const StyledText = styled(Typography.Text)`
  text-transform: uppercase;
  font-weight: bold;
  cursor: pointer;
  color: ${themeColor};
`

export const StyledIconCaretDown = styled(IconCaretDown)`
  fill: ${themeColor};
  height: 5px;
  margin-left: 6px;
`

export const StyledMenu = styled(Menu)`
  border: 1px solid ${grey};
  border-radius: 2px;
`

export const StyledIconClose = styled(IconClose)`
  position: absolute;
  top: 0px;
  right: 20px;
`

export const StyledMenuItem = styled(Menu.Item)`
  text-align: center;
  margin: 0px !important;
  ${(props) => (props.$last ? '' : `border-bottom: 1px solid ${grey}`)};
`

export const StyledMenuItemTitle = styled(StyledMenuItem)`
  border-bottom: none;
  .ant-typography {
    border-bottom: 1px solid ${grey};
    color: ${darkGrey};
    font-weight: bold;
    padding-bottom: 8px;
  }
`

export const StyledPopover = styled(Popover)`
  .ant-popover-inner-content {
    padding: 0px;
  }
`

export const GlobalStyle = createGlobalStyle`
  body {
    .no-padding-popover .ant-popover-inner-content{
         padding: 0px;
      }
  }
`
