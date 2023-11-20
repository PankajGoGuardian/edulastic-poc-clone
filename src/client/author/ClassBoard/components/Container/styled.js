import { Card, Checkbox, Button, Menu, Col } from 'antd'
import styled from 'styled-components'
import { FlexContainer, SelectInputStyled } from '@edulastic/common'
import {
  mobileWidth,
  mobileWidthLarge,
  mobileWidthMax,
  themeColor,
  white,
  mainTextColor,
  title,
  lightFadedBlack,
  green,
  red,
  black,
  cardTitleColor,
  largeDesktopWidth,
  extraDesktopWidthMax,
  mediumDesktopExactWidth,
  themeColorHoverBlue,
  themeColorBlue,
} from '@edulastic/colors'
import { themes } from '../../../../theme'
import { FixedHeaderStyle } from '../../../StudentView/styled'

const classBoardTheme = themes.default.classboard

export const CheckContainer = styled.span`
  font-weight: bold;
  display: inline-block;
  font-size: 15px;
  > span {
    margin-left: 0;
  }
  .ant-checkbox-wrapper:hover .ant-checkbox-inner,
  .ant-checkbox:hover .ant-checkbox-inner,
  .ant-checkbox-input:focus + .ant-checkbox-inner {
    border-color: ${(props) => props.theme.checkbox.checkboxCheckedColor};
  }
  .ant-checkbox-checked .ant-checkbox-inner {
    background-color: ${(props) => props.theme.checkbox.checkboxCheckedColor};
    border-color: ${(props) => props.theme.checkbox.checkboxCheckedColor};
  }
  .ant-checkbox-indeterminate .ant-checkbox-inner::after {
    background-color: ${(props) => props.theme.checkbox.checkboxCheckedColor};
  }
`

export const ButtonGroup = styled.div`
  display: inline-block;
`

export const CardDetailsContainer = styled.div`
  width: 100%;
  padding: 20px 30px;

  @media (max-width: ${mobileWidthMax}) {
    padding: 20px;
  }
`

export const StyledFlexContainer = styled(FlexContainer)`
  width: 100%;
  margin-bottom: ${({ marginBottom }) => marginBottom || '15px'};
  padding-right: ${({ paddingRight }) => paddingRight || '0px'};
`

export const StickyFlex = styled(FlexContainer)`
  width: 100%;
  margin-bottom: 0px;
  @media (max-width: ${mobileWidthMax}) {
    flex-direction: column;
  }
  ${(props) => props.hasStickyHeader && FixedHeaderStyle}
`

export const GraphContainer = styled(FlexContainer)`
  width: 100%;
  margin-bottom: 20px;
`

export const StudentGrapContainer = styled(FlexContainer)`
  width: 100%;
  margin-bottom: 20px;
`

export const StyledCard = styled(Card)`
  width: 100%;
  border-radius: 10px;
  border: 1px solid #dadae4;
  .ant-card-body {
    padding: 20px;
  }

  @media (max-width: ${mobileWidth}) {
    .ant-card-body {
      padding: 15px;
    }
  }
`

export const StudentButtonDiv = styled(Col)`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  .ant-btn-primary {
    background-color: #0e93dc;
  }
  @media (max-width: ${mobileWidth}) {
    margin: auto;
  }
`

export const StyledTabButton = styled.a`
  height: 24px;
  padding: 6px 15px;
  font-size: 11px;
  font-weight: 600;
  background-color: ${({ active }) => (active ? themeColorBlue : white)};
  color: ${({ active }) => (active ? white : themeColor)};
  border: 1px solid ${({ active }) => (active ? themeColorBlue : themeColor)};
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    background-color: ${themeColorHoverBlue};
    color: ${white};
  }

  @media (min-width: ${largeDesktopWidth}) {
    padding: 6px 30px;
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    padding: 6px 35px;
  }

  @media (max-width: ${mobileWidthLarge}) {
    width: 100%;
    text-align: center;
    margin: 0 !important;
  }
`

export const BothButton = styled(StyledTabButton)`
  border-radius: 4px 0px 0px 4px;
`

export const StudentButton = styled(StyledTabButton)`
  border-radius: 0px;
  margin: 0px;
  border-right: none;
  border-left: none;
`

export const QuestionButton = styled(StyledTabButton)`
  border-radius: 0px 4px 4px 0px;
`

export const RedirectButton = styled(StyledTabButton)`
  border-radius: 0;
  width: 130px;
  color: ${themeColor};
  position: relative;
  border-left: none;
  &:nth-child(1) {
    border-radius: 4px 0 0 4px;
    border-left: 1px solid ${themeColor};
  }
  &:nth-last-child(1) {
    border-radius: 0 4px 4px 0;
    margin-right: 0px;
  }
  &:hover {
    svg {
      fill: ${white};
      path,
      circle {
        fill: ${white};
      }
    }
  }
  svg {
    fill: ${themeColor};
    path,
    circle {
      fill: ${themeColor};
    }
  }

  @media (min-width: ${mediumDesktopExactWidth}) {
    width: 150px;
  }
  @media (max-width: ${mobileWidthLarge}) {
    width: auto;
    padding: 6px 12px;
    svg {
      display: none;
    }
  }
`

export const AssignTutoring = styled(StyledTabButton)`
  margin-right: 10px;
  background-color: #19b394;
  color: #fff;
  border-radius: 2px;
`

export const DropMenu = styled(Menu)`
  margin-top: 10px;
  width: 190px;
`

export const MenuItems = styled(Menu.Item)`
  display: flex;
  align-items: center;
  font-size: 11px;
  color: ${({ disabled }) => (disabled ? lightFadedBlack : title)};
  font-weight: 600;
  &:hover {
    svg {
      fill: ${white};
      path {
        fill: ${white};
        stroke: ${white};
      }
    }
  }
  svg,
  i {
    fill: ${mainTextColor};
    height: 12px;
    margin-right: 10px;
    path {
      fill: ${mainTextColor};
    }
  }
  &.ant-dropdown-menu-item-disabled {
    svg,
    i {
      path {
        fill: ${lightFadedBlack}!important;
      }
    }
  }
  &:not(.ant-dropdown-menu-item-disabled):hover {
    color: ${white};
    background-color: ${themeColorBlue};
  }
`

export const CaretUp = styled.i`
  position: absolute;
  top: -20px;
  color: ${white};
  right: 12px;
  font-size: 30px;
`

export const ButtonIconWrap = styled.span`
  display: block;
  left: 10px;
  position: absolute;
  padding-top: 2px;
  &.more {
    padding-top: 4px;
  }
`

export const BarDiv = styled.div`
  width: 1px;
  height: 30px;
  background-color: ${classBoardTheme.headerBarbgcolor};
  display: inline-block;
  margin-bottom: -6px;
`

export const StyledCheckbox = styled(Checkbox)`
  font-size: 0.7em;
  color: ${(props) => props.theme.checkbox.checkboxLabelColor};
`

export const SpaceDiv = styled.div`
  display: inline-block;
  width: 20px;
`

export const ButtonSpace = styled.div`
  display: inline-block;
  width: 13px;
`

export const ClassBoardFeats = styled.div`
  display: flex;
  border-radius: 4px;
`

export const StyledButton = styled(Button)`
  font-size: 0.7em;
  background-color: transparent;
  margin: 0px 23px 0px -5px;
  width: 100px;
  height: 25px;
  color: ${classBoardTheme.headerButtonColor};
  border: 1px solid #00b0ff;
  font-weight: bold;
`

export const StyledAnc = styled(Button)`
  cursor: grab;
  background-color: transparent;
  border: none;
  outline: none;
  :hover {
    background-color: transparent;
    border: none;
    outline: none;
  }
  :active {
    background-color: transparent;
    border: none;
    outline: none;
  }
`

export const ScoreHeader = styled.div`
  font-size: 11px;
  margin-bottom: 5px;
  color: ${cardTitleColor};
  font-weight: 800;
`

export const ScoreChangeWrapper = styled.div`
  color: ${(props) =>
    props.scoreChange > 0
      ? green
      : props.scoreChange < 0
      ? red
      : cardTitleColor};
  font-size: 30px;
  font-weight: 800;
`

export const ScoreWrapper = styled.div`
  font-size: 30px;
  color: ${black};
`

export const GraphWrapper = styled.div`
  @media (max-width: ${mobileWidthMax}) {
    flex-direction: column;
  }
`

export const InfoWrapper = styled.div`
  min-width: 205px;
  @media (max-width: ${mobileWidthMax}) {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 20px;
  }
`

export const SwitchBox = styled.span`
  font-size: 10px;
  padding-bottom: 10px;
  margin-left: 10px;
  .ant-switch {
    min-width: 32px;
    height: 16px;
    margin: 0px 0px 0px 5px;
    &:after {
      width: 12px;
      height: 12px;
    }
  }
`
export const FilterSelect = styled(SelectInputStyled)`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  margin-left: 25px;
  .ant-select-selection-selected-value {
    font-size: 11px;
  }
`
export const FilterSpan = styled.span`
  padding-right: 15px;
  font-size: 12px;
  font-weight: 600;
`
export const TagWrapper = styled.div`
  margin-bottom: 15px;
`
