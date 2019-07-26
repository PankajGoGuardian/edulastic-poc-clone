import styled from "styled-components";
import { Card } from "@edulastic/common";
import { Row, Col, Button, Slider } from "antd";
import { Table } from "antd";
import { darkGrey, grey, fadedBlack, fadedGrey, lightGreySecondary, themeColor } from "@edulastic/colors";
import { Text } from "@vx/text";
import { CustomChartTooltip } from "./components/charts/chartUtils/tooltip";

export const StyledCell = styled.div`
  height: 100%;
  width: 100%;
  padding: 10px;
`;

export const PrintablePrefix = styled.b`
  display: none;
  padding-left: 5px;
  float: left;

  @media print {
    display: block;
  }
`;

export const StyledGoButton = styled(Button)`
  font-size: 16px;
  padding-right: 11px;
  padding-left: 11px;
  height: 37px;
  border-radius: 3px;
  background-color: ${themeColor} !important;
  border-color: transparent;
`;

export const StyledFilterWrapper = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 15px 20px;
  margin: 0px 8px;

  .ant-select-selection {
    &__rendered {
      padding-left: 0px;
    }
  }

  .ant-select {
    width: 100%;
  }

  .ant-select-auto-complete.ant-select .ant-input {
    background-color: ${lightGreySecondary};
    border-radius: 3px;
    padding: 18px;
    font-size: 13px;
    font-weight: 600;
    &:focus {
      outline: 0px;
      box-shadow: none;
      border-color: ${themeColor};
    }
  }

  .ant-input-affix-wrapper .ant-input-suffix {
    right: 18px;
    i {
      svg {
        color: ${themeColor};
      }
    }
  }

  .control-dropdown {
    button {
      background-color: ${lightGreySecondary};
      border-radius: 3px;
      padding: 8.5px 18px;
      height: auto;
      font-size: 13px;
      font-weight: 600;
      max-width: 100%;
      width: 100%;

      i {
        color: ${themeColor};
      }
    }
  }
`;

export const StyledReportsContentContainer = styled.div`
  padding: 0px 20px;
`;

export const DropDownContainer = styled.div`
  .dropdown-container {
    text-align: left;
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
  }
`;

export const StyledCard = styled(Card)`
  margin: ${props => (props.margin ? props.margin : "8px")};

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

  @media print {
    box-shadow: none !important;

    .ant-card-body {
      padding: 0px !important;
    }
  }
`;

export const StyledContainer = styled.div`
  padding: 30px;
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
            padding: 8px !important;

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

          td:nth-last-child(-n + ${props => props.centerAligned || 0}) {
            text-align: center;
          }

          td {
            height: 50px;
            padding: 10px;
            text-align: left;
            font-size: 12px;

            &:nth-last-child(-n + ${props => props.colouredCellsNo}) {
              padding: 0px;
              div {
                height: 100%;
                width: 100%;
                padding: 10px;
              }
            }
          }
        }
      }
    }
  }

  .ant-table-body::-webkit-scrollbar {
    height: 10px;
    width: 10px;
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
  font-weight: 700;
  color: ${fadedBlack};
  font-size: 14px;
  margin: 0px 0px 10px;
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
  white-space: pre-wrap;

  .tooltip-key {
    font-weight: 900;
  }
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
    -webkit-print-color-adjust: exact;
  }

  .ant-slider-track {
    height: 12px;
    border-radius: 6px;
    background-color: #69c0ff;
    -webkit-print-color-adjust: exact;
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

export const PrintableScreen = styled.div`
  @media print {
    width: 1024px;

    .fixed-header,
    .navigator-tabs-container,
    .ant-pagination,
    .single-assessment-report-go-button-container,
    .anticon-caret-down {
      display: none;
    }
  }
`;

export const StyledSignedBarContainer = styled.div`
  .recharts-default-legend {
    .recharts-legend-item {
      &:nth-child(1) {
        padding-left: 90px;
      }
    }
  }
`;

export const StyledDropDownContainer = styled(Col)`
  .ant-btn.ant-dropdown-trigger {
    white-space: nowrap;
    overflow: hidden;
    max-width: 100%;
    text-overflow: ellipsis;
    width: 100%;
  }
`;
