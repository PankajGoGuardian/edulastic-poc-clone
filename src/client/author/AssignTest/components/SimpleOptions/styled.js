import styled from "styled-components";
import { Row, Radio, Switch, Input, Select, DatePicker, Table } from "antd";
import { white, secondaryTextColor, blue, fadedBlue, red, blueBorder } from "@edulastic/colors";

const RadioGroup = Radio.Group;

export const OptionConationer = styled.div`
  min-height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

export const InitOptions = styled.div`
  background: ${white};
  box-shadow: 0px 3px 10px 0px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 54px 50px;
  width: 70vw;
`;

export const StyledRow = styled(Row)`
  margin-bottom: 8px;
`;

export const StyledRowLabel = styled(Row)`
  color: ${secondaryTextColor};
  font-weight: 600;
  margin-bottom: 8px;
`;

export const StyledRowButton = styled(Row)`
  font-weight: 600;
  margin-bottom: 32px;
  margin-top: 16px;
`;

export const AlignRight = styled(RadioGroup)`
  display: flex;
  justify-content: flex-end;

  .ant-radio-wrapper {
    white-space: normal;
    margin-right: 32px;
    max-width: 150px;
    display: flex;
    align-items: center;

    span {
      display: inline-block;
    }

    &:last-child {
      margin-right: 0px;
    }
  }
`;

export const StyledRadioGropRow = styled(Row)`
  margin-bottom: 24px;
  margin-top: -8px;
`;

export const AlignSwitchRight = styled(Switch)`
  width: 35px;
  float: right;
`;

export const StyledRowSettings = styled(Row)`
  padding: ${({ noPadding }) => (noPadding ? "0px" : "15px")};
  background-color: #f8f8f8;
  border-radius: 4px;
  /* margin-top: ${({ firstEm }) => (firstEm ? "32px" : "0px")}; */
  margin-left: 0px !important;
  margin-right: 0px !important;
  margin-bottom: 10px;

  .ant-radio-wrapper {
    color: #434b5d;
    font-weight: 600;
  }
`;

export const StyledRowSelect = styled(StyledRowSettings)`
  padding: 4px 15px;
  display: flex;
  align-items: center;

  .ant-select-selection {
    border: 0px !important;

    &:focus {
      box-shadow: unset;
    }
  }
`;

export const SpaceDiv = styled.div`
  height: 32px;
`;

export const CheckBoxWrapper = styled.p`
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
`;

export const SettingsWrapper = styled.div`
  margin-top: 48px;
  color: #434b5d;
  font-weight: 600;
  display: flex;
  flex-direction: ${({ isAdvanced }) => (isAdvanced ? "row" : "column")};
`;

export const MaxAttemptIInput = styled(Input)`
  width: 20%;
  float: right;
`;

export const Password = styled(Input)`
  width: 100%;
  float: right;
  margin-top: 5px;
  border-color: ${props => (props.color ? props.color : blueBorder)};
  &:hover,
  &:focus {
    border-color: ${props => (props.color ? props.color : blueBorder)};
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
  font-weight: bold;
  color: #6a737f;

  svg {
    margin-left: 16px;
    fill: ${blue};
  }
`;

export const StyledSelect = styled(Select)`
  width: 100%;
  .ant-select-selection {
    background: #f8f8f8;
    min-height: 40px;
    margin-bottom: 10px;
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
      border: solid 1px ${fadedBlue};
      background-color: ${fadedBlue};
      height: 23.5px;
    }

    .ant-select-selection__choice__content {
      font-size: 10px;
      font-weight: bold;
      letter-spacing: 0.2px;
      color: ${blue};
      opacity: 1;
    }
    .ant-select-remove-icon {
      svg {
        fill: ${blue};
      }
    }

    .ant-select-arrow-icon {
      font-size: 14px;
      svg {
        fill: ${blue};
      }
    }

    .ant-select-selection-selected-value {
      margin-top: 4px;
    }
  }
`;

export const StyledDatePicker = styled(DatePicker)`
  .ant-calendar-picker-input {
    background: #f8f8f8;
    border: 1px #e1e1e1 solid;
  }
  svg {
    fill: ${blue};
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
            fill: ${blue};
            font-size: 18px;
          }
        }
      }
    }
  }
`;

export const StyledDiv = styled.div`
  flex: 1;
`;
