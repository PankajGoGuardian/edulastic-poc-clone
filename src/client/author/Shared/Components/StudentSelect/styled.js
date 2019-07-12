import { Select } from "antd";
import styled from "styled-components";
import { themeColor } from "@edulastic/colors";

export const Container = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;

  .ant-select {
    width: auto;
    .ant-select-selection__rendered {
      margin: 0px;
      .ant-select-selection-selected-value {
        padding-right: 30px;
        font-size: 16px;
      }
    }
    .ant-select-selection {
      .ant-select-arrow {
        right: 0px;
        .ant-select-arrow-icon {
          svg {
            fill: #434b5d;
          }
        }
      }
    }
  }

  svg {
    margin-right: 23px;
    width: 18px !important;
  }

  .ant-select-selection__rendered {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.2px;
    color: #434b5d;
  }

  .ant-select-selection {
    border: 0px;
  }

  .ant-select-arrow-icon {
    svg {
      fill: ${themeColor};
      margin-right: 0px;
    }
  }
`;

export const StyledSelect = styled(Select)`
  display: inline-block;
  .ant-select-selection {
    border: 0px;
    &:focus {
      box-shadow: unset;
    }
  }
  @media (max-width: 550px) {
    display: none;
  }
  @media (max-width: 1000px) {
    display: none;
  }
`;
