import {
  greyThemeLight,
  greyThemeDark4,
  white,
  themeColorHoverBlue,
  black,
  themeColor,
} from '@edulastic/colors'
import styled from 'styled-components'
import { Col } from 'antd'
import { IconTrash as Icon } from '@edulastic/icons'

export const StyledInputContainer = styled.div`
  display: flex;
  flex: 1 1 0%;
  align-items: center;
  font-weight: 600;
  font-size: 16px;
  margin-left: 8px;
  position: relative;
  height: 21px;
  .froala-wrapper {
    height: 100%;
    [id^='froalaToolbarContainer-mcq-option'] {
      bottom: 131%;
      left: -7px;
    }
  }
`

export const OptionContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1 1 0%;
  justify-content: flex-start;
  align-items: center;
  min-height: 35px;
  border: 1px solid ${greyThemeLight};
  width: 97%;
  z-index: 9999;
  &:not(:last-child) {
    margin-bottom: 5px;
  }
`

export const LabelContainer = styled.div`
  width: 25px;
  height: 22px;
  overflow: hidden;
  font-size: 13px;
  font-weight: 600;
  color: ${({ isSelected }) => (isSelected ? white : black)};
  background: ${({ isSelected }) => (isSelected ? themeColorHoverBlue : white)};
  border: ${({ isSelected }) =>
    isSelected ? 'none' : `1px solid ${greyThemeDark4}`};
  border-radius: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  line-height: 1;
  cursor: pointer;
  &:hover {
    background: ${themeColorHoverBlue};
    color: ${white};
    border-color: ${themeColorHoverBlue};
  }
`

export const IconTrash = styled(Icon)`
  fill: ${(props) => props.theme.sortableList.iconTrashColor};
  :hover {
    fill: ${(props) => props.theme.sortableList.iconTrashHoverColor};
  }
  width: 10px;
  height: 14px;
  cursor: pointer;
  margin: 0px -22px 0px 10px;
`
export const RightAlignedCol = styled(Col)`
  text-align: right;
`
export const TimeStampContainer = styled.label`
  display: block;
  margin-bottom: 12px;
  font-size: 13px;
  line-height: 1.38;
  font-weight: 600;
  color: ${themeColor};
`
