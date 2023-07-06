import {
  greyThemeLight,
  greyThemeDark4,
  white,
  themeColorHoverBlue,
  black,
} from '@edulastic/colors'
import styled from 'styled-components'
import { Col, Input } from 'antd'
import { IconTrash as Icon } from '@edulastic/icons'

export const TextInputStyled = styled(Input)`
  margin-left: 12px;
  &.ant-input {
    border: none;
    padding: 0px;
    text-align: left;
    &:focus,
    &:hover {
      border: none !important;
      box-shadow: none;
    }
  }
`

export const OptionContainer = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid ${greyThemeLight};
  padding: 2px 0px;
  width: 95%;
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
