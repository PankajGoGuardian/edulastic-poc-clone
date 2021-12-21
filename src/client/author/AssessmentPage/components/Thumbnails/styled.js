import styled from 'styled-components'
import { Button } from 'antd'
import { IconCharInfo } from '@edulastic/icons'
import {
  extraDesktopWidthMax,
  borders,
  tabGrey,
  backgrounds,
  greyThemeDark1,
} from '@edulastic/colors'

export const ThumbnailsWrapper = styled.div`
  position: relative;
  overflow-y: auto;
  display: ${({ minimized }) => (minimized ? 'none' : 'block')};
  padding: ${(props) =>
    props.testMode || props.reportMode
      ? '0px 0px 16px 16px'
      : '16px 0px 50px 16px'};
  background: ${backgrounds.primary};
  min-width: 155px;
  max-width: 155px;
`

export const ThumbnailsList = styled.div`
  width: 135px;
  margin-bottom: 20px;
`

export const ReuploadButtonWrapper = styled.div`
  text-align: center;
  position: fixed;
  left: ${(props) => (props.noCheck ? 0 : '70px')};
  bottom: 0;
  width: 180px;
  padding: 15px 25px;
  background: ${backgrounds.primary};
  z-index: 1;

  @media (min-width: ${extraDesktopWidthMax}) {
    width: 200px;
  }
`

export const ReuploadButton = styled(Button)`
  width: 130px;
  height: 32px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  border-radius: 5px;
  background: ${borders.default};
  border: ${borders.default};
  color: ${tabGrey};
  padding: 0px;

  @media (min-width: ${extraDesktopWidthMax}) {
    width: 150px;
  }
`

export const ToolBarToggleBtn = styled(Button)`
  border: none;
  width: 34px;
  height: 34px;
  border-radius: 4px;
  padding: 0;
`

export const MenuItemContainer = styled.span`
  position: relative;
  color: ${greyThemeDark1};
  margin-bottom: 8px;
  display: inline-block;
`

export const InfoIcon = styled(IconCharInfo)`
  width: 6px;
  height: 10px;
  position: absolute;
  top: -5px;
  right: -12px;
  cursor: pointer;
`
