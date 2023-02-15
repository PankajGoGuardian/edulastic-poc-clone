import {
  greyThemeLight,
  greyThemeLighter,
  greyThemeDark2,
  largeDesktopWidth,
  linkColor1,
  mobileWidth,
  red,
  secondaryTextColor,
  themeColor,
  themeColorBlue,
  themeColorLight,
  title,
  white,
  smallDesktopWidth,
  mediumDesktopExactWidth,
  tagsBgColor,
  tagTextColor,
} from '@edulastic/colors'
import {
  Button,
  Col,
  DatePicker,
  Input,
  Radio,
  Row,
  Select,
  Table,
  InputNumber,
} from 'antd'
import styled from 'styled-components'
import { EduSwitchStyled } from '@edulastic/common'
import { IconInfo } from '@edulastic/icons'

const RadioGroup = Radio.Group

export const OptionConationer = styled.div`
  width: ${({ width }) => width || '100%'};
  margin: auto;
  margin-top: ${window.innerHeight <= 780 ? '24px' : '80px'};
  .ant-tabs-bar {
    width: 65%;

    @media (max-width: ${mediumDesktopExactWidth}) {
      width: 80%;
    }

    @media (max-width: ${largeDesktopWidth}) {
      width: 90%;
    }

    @media (max-width: ${smallDesktopWidth}) {
      width: 100%;
    }
    margin: auto;
    margin-bottom: 20px;
  }
  .ant-tabs-nav-scroll {
    display: flex;
    justify-content: center;
  }
  .ant-tabs-tab {
    font-size: 12px;
  }
`

export const InitOptions = styled.div`
  background: ${white};
  border-radius: 10px;
  padding: 20px 40px 0px 40px;
  width: 100%;
`

export const StyledRow = styled(Row)`
  border-bottom: ${({ borderBottom }) => borderBottom || '1px solid #dddddd'};
  padding: ${({ padding }) => padding || '15px 0px'};
  margin-top: ${({ mt }) => mt || '0px'};
  :hover {
    background: ${greyThemeLighter};
  }
`

export const StyledRowLabel = styled(Row)``

export const ColLabel = styled(Col)`
  color: ${secondaryTextColor};
  font-weight: 600;
  margin-bottom: 8px;
`

export const StyledRowButton = styled(Row)`
  font-weight: 600;
  margin: 20px 0px;
`

export const AlignRight = styled(RadioGroup)`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  & * {
    cursor: ${({ forClassLevel }) =>
      forClassLevel ? 'not-allowed' : 'initial'};
  }
  .ant-radio-wrapper {
    white-space: normal;
    margin-right: 25px;
    max-width: ${({ maxWidth }) => maxWidth || '200px'};
    display: flex;
    align-items: center;
    margin-bottom: 8px;

    span {
      display: inline-block;
      vertical-align: middle;
    }

    &:last-child {
      margin-right: 0px;
    }
  }
`

export const StyledRadioGropRow = styled(Row)`
  margin-bottom: 15px;
  margin-top: -8px;
`

export const AlignSwitchRight = styled(EduSwitchStyled)`
  float: left;
`

export const StyledRowSettings = styled(Row)`
  padding: ${({ noPadding }) => (noPadding ? '0px' : '15px')};
  background-color: #f8f8f8;
  border-radius: 4px;
  margin-left: 0px !important;
  margin-right: 0px !important;
  margin-bottom: 10px;

  .ant-radio-wrapper {
    color: #434b5d;
    font-weight: 600;
  }
`

export const StyledRowSelect = styled(StyledRowSettings)`
  .ant-select {
    .ant-select-selection {
      border: none;
      margin: 0px;
      padding: 0;
      min-height: auto;
      .ant-select-selection-selected-value {
        font-size: ${(props) => props.theme.smallFontSize};
        margin: 0px;
        text-transform: uppercase;
      }
      .ant-select-selection__rendered {
        margin-left: 0px;
      }
      &:focus,
      &:hover {
        box-shadow: unset;
        border: none;
      }
    }
    .ant-select-arrow {
      right: 0px;
    }
  }
`

export const SpaceDiv = styled.div`
  height: 32px;
`

export const CheckBoxWrapper = styled.p`
  margin-top: 10px;
  display: flex;
  justify-content: flex-start;
`

export const SettingsWrapper = styled.div`
  color: #434b5d;
  font-weight: 600;
  display: flex;
  flex-direction: ${({ isAdvanced }) => (isAdvanced ? 'row' : 'column')};
`

export const MaxAttemptIInput = styled(Input)`
  width: 20%;
  float: left;
`

export const Password = styled(Input)`
  width: 100%;
  float: left;
  margin-top: 5px;
  border-color: ${(props) => (props.color ? props.color : themeColor)};
  &:hover,
  &:focus {
    border-color: ${(props) => (props.color ? props.color : themeColor)};
  }

  .ant-input-disabled,
  .ant-input[disabled] {
    cursor: unset;
    color: unset;
  }

  .anticon {
    cursor: pointer !important;
    color: ${themeColor} !important;
  }
`

export const MessageSpan = styled.span`
  color: ${red};
`

export const SettingsBtn = styled.span`
  display: flex;
  align-items: center;
  text-transform: uppercase;
  cursor: pointer;
  font-weight: 600;
  color: #6a737f;
  font-size: ${(props) => props.theme.linkFontSize};

  svg {
    margin-left: 16px;
    fill: ${themeColor};
  }
`

export const StyledSelect = styled(Select)`
  min-width: 100%;
  .ant-select-selection {
    background: ${({ isBackgroundWhite }) =>
      isBackgroundWhite ? white : greyThemeLighter};
    min-height: 40px;
    padding: 3px;
    border-radius: 2px;
    border: 1px #e1e1e1 solid;
    .ant-select-selection__rendered {
      height: 100%;
      > ul {
        width: 100%;
      }
    }

    .ant-select-selection__choice {
      border-radius: 5px;
      margin: 4px;
      border: solid 1px ${themeColorLight};
      background-color: ${themeColorLight};
      height: 23.5px;
    }

    .ant-select-selection__choice__content {
      font-size: 10px;
      font-weight: bold;
      letter-spacing: 0.2px;
      color: ${themeColor};
      opacity: 1;
    }
    .ant-select-remove-icon {
      svg {
        fill: ${themeColor};
      }
    }

    .ant-select-arrow-icon {
      font-size: ${(props) => props.theme.linkFontSize};
      svg {
        fill: ${themeColor};
      }
    }
  }
`

export const StyledDatePicker = styled(DatePicker)`
  .ant-calendar-picker-input {
    background: #f8f8f8;
    border: 1px #e1e1e1 solid;
  }
  svg {
    fill: ${themeColor};
  }
`

export const StyledTable = styled(Table)`
  margin-left: ${({ isAdvanced }) => (isAdvanced ? '20px' : '0px')};
  .ant-table {
    color: #434b5d;
    font-weight: 600;

    .ant-table-thead > tr > th {
      border-bottom: 0px;
      background: ${white};
      color: #aaafb5;
      font-weight: bold;
      text-transform: uppercase;
      text-align: center;
      padding: 8px;

      &:first-child {
        font-size: ${({ isAdvanced }) => (isAdvanced ? '14px' : '20px')};
        font-weight: bold;
        text-transform: unset;
        color: #434b5d;
        text-align: left;
        padding-left: 20px;
      }
    }
    .ant-table-tbody > tr > td {
      border-bottom: 15px;
      border-bottom-color: ${white};
      border-bottom-style: solid;
      background: #f8f8f8;
      text-align: center;
      padding: 8px;

      &:first-child {
        text-align: left;
        padding-left: 20px;
      }
      &.action-wrapper {
        div {
          display: flex;
          justify-content: space-around;
          align-items: center;

          svg {
            fill: ${themeColor};
            font-size: 18px;
          }
        }
      }
    }
  }
`

export const DivBlock = styled.div`
  padding-top: 30px;
`

export const Label = styled.label`
  display: flex;
  font-size: ${(props) => props.theme.linkFontSize};
  font-weight: 600;
  text-transform: uppercase;
  align-items: center;
`
export const RadioButtonWrapper = styled.div`
  display: flex;
`

export const StyledDiv = styled.div`
  flex: 1;
`

export const AdvancedButton = styled(Button)`
  padding: 0;
  border: none;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 600;
  color: ${linkColor1};
  box-shadow: none;
  margin-top: 20px;
  width: 190px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  svg {
    transform: ${(props) => (props.show ? 'rotate(180deg)' : 'none')};
  }
`

export const Block = styled.div`
  margin-bottom: 30px;
  padding: ${(props) => (props.smallSize ? '15px' : '29px 30px 30px 30px')};
  background: ${(props) => (props.smallSize ? white : '#f8f8f8')};
  border-radius: 4px;

  .ant-input {
    height: 40px;
    font-size: 13px;
    border-radius: 4px;
  }
`

export const StyledRadioGroup = styled(Radio.Group)`
  span {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.2px;
    color: #434b5d;
  }

  .ant-radio {
    margin-right: 25px;
  }

  .ant-radio-wrapper {
    margin-right: 40px;
  }
`

export const RadioWrapper = styled(Block)`
  padding: 0;

  &:not(:last-child) {
    margin-bottom: 15px;
  }

  .ant-row {
    background: ${white};
    border-radius: 4px;
  }

  @media (max-width: ${mobileWidth}) {
    .ant-row {
      display: flex;
      flex-direction: column;
      align-items: center;
      border: 1px solid #e8e8e8;
      padding-top: 20px;

      &:first-child {
        margin-top: 20px;
      }

      .ant-col-8 {
        text-align: center;
        margin-bottom: 20px;
      }
    }
  }
`

export const Title = styled.div`
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.3px;
  color: ${secondaryTextColor};
`

export const StyledLink = styled.span`
  font-size: 13px;
  color: #888888;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  svg {
    margin-left: 15px;
    fill: ${themeColorBlue};
    path {
      fill: ${themeColorBlue};
    }
  }
`

export const TimeSpentInput = styled(Input)`
  width: 30%;
  margin: 0 30px;
`

export const SelectStudentColumn = styled(Col)`
  margin-bottom: ${({ marginBottom }) => marginBottom || '0px'};
  .student-dropdown {
    padding: 15px;
    .ant-select-tree-switcher {
      display: none;
    }
    .ant-select-tree {
      padding: 0px;
      li .ant-select-tree-node-content-wrapper {
        padding: 0px 10px;
      }
    }
    .ant-select-tree-checkbox.ant-select-tree-checkbox-disabled {
      display: none;
      & + .ant-select-tree-node-content-wrapper {
        padding: 0px;
      }
    }
  }
`

export const HeaderButtonsWrapper = styled.div`
  width: 100%;
  padding: 0px 0px 5px;
`
export const SelectAll = styled.div`
  display: inline-block;
  color: ${title};
  cursor: pointer;
  margin-right: 15px;
  text-transform: uppercase;
  font-weight: 600;
  font-size: 12px;
  &.disabled {
    color: ${greyThemeLight};
    cursor: not-allowed;
  }
`

export const SelectTextInline = styled.div`
  display: inline-block;
  color: ${title};
  cursor: pointer;
  margin-right: 15px;
  font-weight: 600;
  font-size: 12px;
`
export const UnselectAll = styled(SelectAll)``

export const StyledCol = styled(Col)`
  display: ${({ display }) => display || 'block'};
  flex-direction: ${(flexDirection) => flexDirection || 'unset'};
  padding-left: ${({ paddingLeft }) => paddingLeft || '0px'};
  padding-right: ${({ paddingRight }) => paddingRight || '0px'};
`

export const StyledInfoIcon = styled(IconInfo)`
  cursor: pointer;
  margin-left: ${({ mL }) => mL || '0px'};
`

export const StyledSpan = styled.span`
  display: flex;
`
export const AssignModuleContentSpan = styled.span`
  display: block;
  margin-top: 8px;
`
export const AddResourcesLink = styled.div`
  font-size: 11px;
  color: ${({ isAddResourceDisabled }) =>
    isAddResourceDisabled ? greyThemeDark2 : themeColorBlue};
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.3px;
  cursor: pointer;
`
export const ResourceTags = styled.ul`
  list-style: none;
  margin: 0px;
  padding: 10px 0px 0px;
  display: flex;
  flex-wrap: wrap;
  li {
    background-color: ${tagsBgColor};
    color: ${tagTextColor};
    border: none;
    font-weight: 600;
    font-size: 9px;
    padding: 4px 5px 3px 10px;
    margin: 2px;
    white-space: normal;
    text-transform: uppercase;
    border-radius: 3px;
  }
`
export const CloseIconWrapper = styled.span`
  cursor: pointer;
  svg {
    fill: ${tagTextColor} !important;
    margin-left: 10px !important;
    width: 8px;
    height: 8px;
  }
`
export const ResourceCardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`

export const CardBox = styled.div`
  width: calc((100% - 30px) / 4);
  margin: 0px 7px 10px 0px;
  display: flex;
  flex-direction: column;
  border: 1px solid #dddddd;
  border-radius: 4px;
  overflow: hidden;
`

export const CardImage = styled.div`
  background: linear-gradient(to bottom, #00b4db, #0083b0);
  height: 80px;
  width: 100%;
`
export const CardTitle = styled.h4`
  font-size: 12px;
  font-weight: 600;
  color: ${themeColor};
  cursor: pointer;
`

export const RowOne = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 10px;
`

export const RowTwo = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 10px;
`
export const StyledTimePickerContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0px 2px 0px;
`
export const StyledDayPickerContainer = styled.div`
  display: flex;
  justify-content: ${({ isAdvancedView }) =>
    isAdvancedView ? 'space-between' : 'flex-start'};
  align-items: center;
  padding-top: 8px;
  & > * {
    margin: ${({ isAdvancedView }) =>
      isAdvancedView ? '0px' : '5px 5px 5px 0px'};
  }
`

export const PaginationContainer = styled.div`
  flex-basis: 100%;
  padding: 20px 0px 10px;
  text-align: center;
`
export const StyledRadioGroupWrapper = styled(Radio.Group)`
  padding-top: 15px;
  .ant-radio-wrapper span:nth-child(2) {
    font-size: 12px;
  }
`
export const InputNumberStyled = styled(InputNumber)`
  width: 60px;
`

export const Styled2ndLine = styled.div`
  padding-left: 24px;
`
export const CheckboxLabel = styled.label`
  cursor: pointer;
`
export const Div = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${greyThemeLighter};
  height: ${({ height }) => height || 'content-height'};
  width: ${({ width }) => width || 'content-width'};
  transistion: 0.5s;
  font-size: ${(props) => props.fontSize || '13px'};
  user-select: none;
  overflow: hidden;
  border-radius: 50%;
  &: before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 50%;
  }
`

export const CheckBoxInput = styled.input.attrs({ type: 'checkbox' })`
  display: none;
  &:checked ~ div {
    color: #fff;
    background: ${themeColorBlue};
  }
`
