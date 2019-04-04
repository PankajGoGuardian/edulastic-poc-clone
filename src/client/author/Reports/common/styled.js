import styled from "styled-components";
import { Card } from "@edulastic/common";
import { Row, Col, Button, Slider } from "antd";
import { Table } from "antd";
import { CustomChartTooltip } from "./components/charts/chartUtils/tooltip";
import { ControlDropDown } from "./components/controlDropDown";
import { NormalDropDown } from "./components/normalDropDown";
import { FilterDropDownWithDropDown } from "./components/filterDropDownWithDropDown";
import { darkGrey, grey, fadedBlack, fadedGrey, black } from "@edulastic/colors";
import { Text } from "@vx/text";

export const StyledCard = styled(Card)`
  margin: 10px;
`;

export const StyledContainer = styled(Row)`
  //   flex-flow: row wrap;

  .report-category {
    flex: 50%;
    max-width: 50%;
  }

  @media (max-width: 600px) {
    .report-category {
      flex: 100%;
      max-width: 100%;
    }
  }
`;

export const StyledTable = styled(Table)`
  .ant-table-body {
    overflow: auto;
    table {
      thead {
        tr {
          th {
            padding: 10px;
            text-align: left;
            font-weight: 900;
          }
        }
      }

      tbody {
        tr {
          border-bottom: solid 1px ${fadedGrey};
          td {
            height: 50px;
            padding: 10px;
            text-align: left;
          }
        }
      }
    }
  }

  .ant-table-body::-webkit-scrollbar {
    height: 10px;
  }

  .ant-table-body::-webkit-scrollbar-track {
    background: ${grey};
  }

  .ant-table-body::-webkit-scrollbar-thumb {
    background: ${darkGrey};
  }

  .ant-pagination.ant-table-pagination {
    .ant-pagination-disabled {
      display: none;
    }
  }
`;

export const StyledH3 = styled.h3`
  font-weight: 900;
  color: ${fadedBlack};
  margin: 0;
`;

export const StyledCustomChartTooltip = styled(CustomChartTooltip)`
  min-width: 200px;
  max-width: 600px;
  min-height: 75px;
  background-color: #f0f0f0;
  color: black;
  border: solid 1px #bebebe;
  box-shadow: 0 0 20px #c0c0c0;
  padding: 5px;
  font-size: 12px;
  font-weight: 600;
  white-space: pre;
`;

export const Capitalized = styled.span`
  text-transform: capitalize;
`;

export const StyledSlider = styled(Slider)`
  height: 22px;
  .ant-slider-rail {
    height: 12px;
    border-radius: 6px;
    background-color: #e1e1e1;
  }

  .ant-slider-track {
    height: 12px;
    border-radius: 6px;
    background-color: #69c0ff;
  }

  .ant-slider-step {
    height: 12px;
  }
  .ant-slider-handle {
    width: 22px;
    height: 22px;
    border: solid 4px #69c0ff;
  }
`;

export const StyledControlDropDown = styled(ControlDropDown)`
  margin: 0px 5px;
  button {
    white-space: pre-wrap;
  }
  .ant-dropdown-menu-item-disabled {
    font-weight: 900;
    color: ${black};
    cursor: default;
  }
`;

export const StyledNormalDropDown = styled(NormalDropDown)`
  margin: 0px 5px;
  button {
    white-space: pre-wrap;
  }
  .ant-dropdown-menu-item-disabled {
    font-weight: 900;
    color: ${black};
    cursor: default;
  }
`;

export const StyledFilterDropDownWithDropDown = styled(FilterDropDownWithDropDown)`
  margin: 0px 5px;
  button {
    white-space: pre-wrap;
  }
  .ant-dropdown-menu-item-disabled {
    font-weight: 900;
    color: ${black};
    cursor: default;
  }
`;

export const StyledChartNavButton = styled(Button)`
  position: absolute;
  height: 50px;
  width: 50px;
  border: solid 1px #c0c0c0;
  border-radius: 25px;
  background-color: white;
  color: black;
`;

export const StyledAxisTickText = styled(Text)`
  font-size: 12px;
`;

export const StyledText = styled.text`
  font-size: 12px;
`;
