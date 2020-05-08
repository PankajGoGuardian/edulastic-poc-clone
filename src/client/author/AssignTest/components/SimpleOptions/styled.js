import styled from "styled-components";
import { Row, Radio, Switch, Input, Select, DatePicker, Table, Col, Button } from "antd";
import {
  white,
  secondaryTextColor,
  themeColor,
  themeColorLight,
  red,
  largeDesktopWidth,
  linkColor1,
  greyThemeLighter,
  mobileWidth
} from "@edulastic/colors";

const RadioGroup = Radio.Group;

export const OptionConationer = styled.div`
  min-height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: ${window.innerHeight <= 780 && "24px"};
`;

export const InitOptions = styled.div`
  background: ${white};
  border: 1px solid #dadae4;
  border-radius: 10px;
  padding: 40px;
  width: 1000px;

  @media (max-width: ${largeDesktopWidth}) {
    width: 100%;
  }
`;

export const StyledRow = styled(Row)`
  margin-bottom: ${props => props.mb || "8px"};
`;

export const StyledRowLabel = styled(Row)``;

export const ColLabel = styled(Col)`
  color: ${secondaryTextColor};
  font-weight: 600;
  margin-bottom: 8px;
`;

export const StyledRowButton = styled(Row)`
  font-weight: 600;
  margin: 20px 0px;
`;

export const AlignRight = styled(RadioGroup)`
  display: flex;
  justify-content: flex-start;
  & * {
    cursor: ${({ forClassLevel }) => (forClassLevel ? "not-allowed" : "initial")};
  }
  .ant-radio-wrapper {
    white-space: normal;
    margin-right: 25px;
    max-width: 200px;
    display: flex;
    align-items: center;

    span {
      display: inline-block;
      vertical-align: middle;
    }

    &:last-child {
      margin-right: 0px;
    }
  }
`;

export const StyledRadioGropRow = styled(Row)`
  margin-bottom: 15px;
  margin-top: -8px;
`;

export const AlignSwitchRight = styled(Switch)`
  width: 35px;
  float: left;
`;

export const StyledRowSettings = styled(Row)`
  padding: ${({ noPadding }) => (noPadding ? "0px" : "15px")};
  background-color: #f8f8f8;
  border-radius: 4px;
  margin-left: 0px !important;
  margin-right: 0px !important;
  margin-bottom: 10px;

  .ant-radio-wrapper {
    color: #434b5d;
    font-weight: 600;
  }
`;

export const StyledRowSelect = styled(StyledRowSettings)`
  .ant-select {
    width: auto;
    .ant-select-selection {
      border: none;
      margin: 0px;
      padding: 0;
      min-height: auto;
      .ant-select-selection-selected-value {
        font-size: ${props => props.theme.smallFontSize};
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
`;

export const SpaceDiv = styled.div`
  height: 32px;
`;

export const CheckBoxWrapper = styled.p`
  margin-top: 10px;
  display: flex;
  justify-content: flex-start;
`;

export const SettingsWrapper = styled.div`
  margin-top: 35px;
  color: #434b5d;
  font-weight: 600;
  display: flex;
  flex-direction: ${({ isAdvanced }) => (isAdvanced ? "row" : "column")};
`;

export const MaxAttemptIInput = styled(Input)`
  width: 20%;
  float: left;
`;

export const Password = styled(Input)`
  width: 100%;
  float: left;
  margin-top: 5px;
  border-color: ${props => (props.color ? props.color : themeColor)};
  &:hover,
  &:focus {
    border-color: ${props => (props.color ? props.color : themeColor)};
  }
`;

export const MessageSpan = styled.span`
  color: ${red};
`;

export const SettingsBtn = styled.span`
  display: flex;
  align-items: center;
  text-transform: uppercase;
  cursor: pointer;
  font-weight: 600;
  color: #6a737f;
  font-size: ${props => props.theme.linkFontSize};

  svg {
    margin-left: 16px;
    fill: ${themeColor};
  }
`;

export const StyledSelect = styled(Select)`
  min-width: 95%;
  .ant-select-selection {
    background: ${({ isBackgroundWhite }) => (isBackgroundWhite ? white : greyThemeLighter)};
    min-height: 40px;
    padding: 3px;
    border-radius: 2px;
    border: 1px #e1e1e1 solid;
    .ant-select-selection__rendered {
      height: 100%;
      > ul {
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
      font-size: ${props => props.theme.linkFontSize};
      svg {
        fill: ${themeColor};
      }
    }
  }
`;

export const StyledDatePicker = styled(DatePicker)`
  .ant-calendar-picker-input {
    background: #f8f8f8;
    border: 1px #e1e1e1 solid;
  }
  svg {
    fill: ${themeColor};
  }
`;

export const StyledTable = styled(Table)`
  margin-left: ${({ isAdvanced }) => (isAdvanced ? "20px" : "0px")};
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
        font-size: ${({ isAdvanced }) => (isAdvanced ? "14px" : "20px")};
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
`;

export const DivBlock = styled.div`
  padding-top: 30px;
`;

export const Label = styled.label`
  font-size: ${props => props.theme.linkFontSize};
  font-weight: 600;
  text-transform: uppercase;
`;

export const StyledDiv = styled.div`
  flex: 1;
`;

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
    transform: ${props => (props.show ? "rotate(180deg)" : "none")};
  }
`;

export const Block = styled.div`
  margin-bottom: 30px;
  padding: ${props => (props.smallSize ? "15px" : "29px 30px 30px 30px")};
  background: ${props => (props.smallSize ? white : "#f8f8f8")};
  border-radius: 4px;

  .ant-input {
    height: 40px;
    font-size: 13px;
    border-radius: 4px;
  }
`;

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
`;

export const RadioWrapper = styled(Block)`
  padding: 0;

  &:not(:last-child) {
    margin-bottom: 15px;
  }

  .ant-row {
    padding: 14px 22px;
    background: ${white};
    border-radius: 4px;

    &:not(:last-child) {
      margin-bottom: 15px;
    }
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
`;

export const Title = styled.div`
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.3px;
  color: ${secondaryTextColor};
`;

export const TimeSpentInput = styled(Input)`
  width: 30%;
  margin: 0 30px;
`;
