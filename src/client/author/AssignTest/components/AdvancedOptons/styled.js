import {
  largeDesktopWidth,
  lightGreySecondary,
  secondaryTextColor,
  themeColor,
  themeColorLight,
  white,
  backgrounds,
  themeColorBlue,
} from '@edulastic/colors'
import { DatePicker, Row, Select, Table, Switch } from 'antd'
import styled from 'styled-components'

export const OptionConationer = styled.div`
  margin-top: 20px;
`

export const InitOptions = styled.div`
  background: ${white};
  border-radius: 8px;
  padding: 40px;
`

export const StyledRow = styled(Row)`
  margin-bottom: 20px;
`

export const StyledRowLabel = styled(Row)`
  color: ${secondaryTextColor};
  font-weight: 600;
  margin-bottom: 8px;
`

export const SettingsBtn = styled.span`
  display: flex;
  align-items: center;
  text-transform: uppercase;
  cursor: pointer;
  font-weight: bold;
  color: #6a737f;

  svg {
    margin-left: 16px;
    fill: ${themeColor};
  }
`

export const StyledSelect = styled(Select)`
  width: 100%;
  .ant-select-selection {
    background: #f8f8f8;
    height: 40px;
    padding: 0px;
    border-radius: 2px;
    border: 1px #e1e1e1 solid;

    .ant-select-selection__rendered {
      height: 100%;
      > ul {
        height: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        > li {
          margin-top: 0px;
        }
      }
    }

    .ant-select-selection__choice {
      border-radius: 5px;
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
      font-size: 14px;
      svg {
        fill: ${themeColor};
      }
    }

    .ant-select-selection-selected-value {
      margin-top: 4px;
    }
  }
`

export const Label = styled.label`
  width: 100%;
  display: inline-block;
  margin: 0px 0px 5px;
  font-weight: 600;
`

export const StyledDatePicker = styled(DatePicker)`
  .ant-calendar-picker-input {
    background: #f8f8f8;
    border: 1px #e1e1e1 solid;
    font-size: 14px;
  }
  svg {
    fill: ${themeColor};
  }
`

export const TableContainer = styled.div`
  margin-left: 70px;
  flex: 2;
`

export const StyledTable = styled(Table)`
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

      .ant-table-column-sorters {
        display: flex;
        justify-content: center;
      }

      &:nth-child(2) {
        text-align: left;
        padding-left: 0px;
      }
    }
    .ant-table-tbody > tr > td {
      border-bottom: 15px;
      border-bottom-color: ${white};
      border-bottom-style: solid;
      background: #f8f8f8;
      text-align: center;
      padding: 8px;

      &:nth-child(2) {
        text-align: left;
        padding-left: 0px;
      }
    }
  }
`

export const ClassListContainer = styled.div`
  display: flex;
`

export const ClassSelectorLabel = styled.div`
  color: #434b5d;
  font-size: 16px;
  font-weight: bold;
  margin-top: 40px;
  display: flex;
  align-items: space-between;
  p {
    color: #6a737f;
    font-weight: 400;
    font-size: 15px;
    margin-top: 10px;
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px #e4eaf1 solid;
  }
`

export const ClassListFilter = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  flex: 1;
  max-width: 300px;
  height: 100%;

  .ant-select-selection {
    background: ${lightGreySecondary};
  }
  .ant-select,
  .ant-input,
  .ant-input-number {
    margin-top: 10px;
    min-width: 100px;
    width: 100%;
  }
  .ant-select-lg {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.2px;
    color: #434b5d;
    .ant-select-selection--multiple {
      .ant-select-selection__rendered {
        li.ant-select-selection__choice {
          height: 20px;
          line-height: 20px;
          margin-top: 7px;

          @media (min-width: ${largeDesktopWidth}) {
            height: 24px;
            line-height: 24px;
          }
        }
      }
    }
  }

  .ant-select-selection__choice {
    border-radius: 5px;
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
    font-size: 14px;
    svg {
      fill: ${themeColor};
    }
  }
`

export const InfoSection = styled.div`
  display: flex;
  justify-content: space-around;
  height: 76px;
  margin-bottom: 10px;
  > div {
    flex: 1;
    margin-right: 10px;
    border-radius: 10px;
    background: ${backgrounds.default};
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    font-weight: 500;
    &:last-child {
      margin-right: 0px;
    }
    > span:last-child {
      color: ${themeColor};
      font-weight: 600;
      font-size: 16px;
    }
  }
`

export const SwitchStyled = styled(Switch)`
  &.ant-switch {
    height: 20px !important;
    width: 65px !important;
    border-radius: 2px;
    margin-left: 5px;
    line-height: 16px;
  }
  &.ant-switch:after {
    width: 5px !important;
    height: 16px !important;
    border-radius: 2px;
  }
  .ant-switch-inner {
    font-size: 10px;
    margin-right: 6px;
    margin-left: 6px;
  }
  &.ant-switch-checked {
    background-color: ${themeColorBlue};
  }
`
