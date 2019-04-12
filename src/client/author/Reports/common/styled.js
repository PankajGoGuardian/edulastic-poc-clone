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
  margin: 8px;

  .ant-card-body {
    padding: 18px;
  }

  @media only screen and (min-width: 1px) and (max-width: 600px) {
    .ant-card-body {
      padding: 12px;
    }
  }

  @media only screen and (min-width: 601px) and (max-width: 767px) {
    .ant-card-body {
      padding: 15px;
    }
  }

  @media only screen and (min-width: 768px) and (max-width: 991px) {
    .ant-card-body {
      padding: 18px;
    }
  }

  @media only screen and (min-width: 992px) and (max-width: 1199px) {
    .ant-card-body {
      padding: 18px;
    }
  }

  @media only screen and (min-width: 1200px) {
    .ant-card-body {
      padding: 18px;
    }
  }
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
            padding: 8px;
            text-align: left;
            font-weight: 900;
            font-size: 12px;

            .ant-table-column-sorters {
              display: inline;
            }
          }
          th.ant-table-column-has-actions.ant-table-column-has-sorters {
            // IMPORTANT: padding is width of sorter icons added with right css property value of sorter
            padding-right: 17px !important;

            .ant-table-column-sorter {
              right: 3px;
            }
          }

          @media only screen and (min-width: 1px) and (max-width: 600px) {
            th {
              padding: 4px;
              font-size: 8px;
            }
          }

          @media only screen and (min-width: 601px) and (max-width: 767px) {
            th {
              padding: 5px;
              font-size: 9px;
            }
          }

          @media only screen and (min-width: 768px) and (max-width: 991px) {
            th {
              padding: 6px;
              font-size: 10px;
            }
          }

          @media only screen and (min-width: 992px) and (max-width: 1199px) {
            th {
              padding: 7px;
              font-size: 11px;
            }
          }

          @media only screen and (min-width: 1200px) {
            th {
              padding: 8px;
              font-size: 12px;
            }
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
            font-size: 12px;
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
