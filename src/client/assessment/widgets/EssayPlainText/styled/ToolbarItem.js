import { greyThemeDark1 } from '@edulastic/colors'
import styled from 'styled-components'
import { Item } from '../../../styled/Item'

export const ToolbarItem = styled(Item)`
  height: 100%;
  color: ${greyThemeDark1};
  font-weight: ${({ theme }) => theme.semiBold};
  align-items: center;
  justify-content: center;

  &:hover {
    cursor: pointer;
    background: ${(props) =>
      props.theme.widgets.essayPlainText.toolbarItemBgHoverColor};
  }
  &:active {
    background: ${(props) =>
      props.theme.widgets.essayPlainText.toolbarItemBgActiveColor};
  }
`
