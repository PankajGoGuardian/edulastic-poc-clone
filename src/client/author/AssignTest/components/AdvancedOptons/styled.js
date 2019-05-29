import styled from "styled-components";
import { Row, Select, DatePicker, Table } from "antd";
import { white, secondaryTextColor, blue, fadedBlue, lightGreySecondary } from "@edulastic/colors";

export const OptionConationer = styled.div`
  margin-top: 20px;
`;

export const InitOptions = styled.div`
  background: ${white};
  box-shadow: 0px 3px 10px 0px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 54px 50px;
`;

export const StyledRow = styled(Row)`
  margin-bottom: 20px;
`;

export const StyledRowLabel = styled(Row)`
  color: ${secondaryTextColor};
  font-weight: 600;
  margin-bottom: 8px;
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
  flex: 2;
  margin-left: 70px;
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
`;

export const ClassListContainer = styled.div`
  display: flex;
`;

export const ClassSelectorLabel = styled.div`
  color: #434b5d;
  font-size: 16px;
  font-weight: bold;
  margin-top: 40px;

  p {
    color: #6a737f;
    font-weight: 400;
    font-size: 15px;
    margin-top: 10px;
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px #e4eaf1 solid;
  }
`;

export const ClassListFilter = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  flex: 1;
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
          height: 24px;
          line-height: 24px;
          margin-top: 7px;
        }
      }
    }
  }

  .ant-select-selection__choice {
    border-radius: 5px;
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
`;
