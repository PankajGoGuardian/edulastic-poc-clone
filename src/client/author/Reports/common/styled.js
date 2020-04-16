import styled from "styled-components";
import { Card } from "@edulastic/common";
import { Col, Button, Slider, Table } from "antd";

import {
  darkGrey,
  grey,
  fadedBlack,
  fadedGrey,
  lightGreySecondary,
  themeColor,
  mediumDesktopExactWidth
} from "@edulastic/colors";
import { Text } from "@vx/text";
import { CustomChartTooltip } from "./components/charts/chartUtils/tooltip";

export const StyledCell = styled.div`
  height: 100%;
  width: 100%;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: ${props => props.justify || "flex-end"};
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
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);

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
    padding-right: 24px;
    font-size: 13px;
    font-weight: 600;
    &:focus {
      outline: 0px;
      box-shadow: none;
      border-color: ${themeColor};
    }
  }

  .ant-input-affix-wrapper .ant-input-suffix {
    right: 8px;
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
      padding-right: 8px;
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
  padding: 0px 30px;
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
  box-shadow: none;
  margin-bottom: 30px;
  .ant-card-body {
    padding: 0px;
  }
`;

export const StyledContainer = styled.div`
  padding: 0px;
`;

export const StyledTable = styled(Table)`
  // when u change this u have to change "StyledTable" in "src/client/common/styled.js" to make every css in sync
  // DO NOT ADD USE CASE SPECIFIC CSS HERE, ONLY ADD GENERIC CSS
  // Import this and add USE CASE SPECIFIC CSS

  .ant-table-body {
    .ant-checkbox {
      .ant-checkbox-inner {
        border-collapse: collapse;
      }
    }
  }
  ,
  .ant-table-scroll {
    .ant-table-header {
      // mozilla
      scrollbar-color: transparent transparent;
    }
    .ant-table-header::-webkit-scrollbar {
      background-color: transparent;
    }
    overflow: auto;
    table {
      border-collapse: collapse;
      border-spacing: 0px 10px;
      thead {
        tr {
          background: transparent;
          text-transform: uppercase;
          .normal-text {
            text-transform: none;
          }

          th {
            padding: 8px;
            text-align: left;
            font-weight: 900;
            font-size: 12px;
            border: 0px;
            color: ${darkGrey} !important;
            padding-bottom: 30px !important;

            .ant-table-column-sorters {
              display: inline;
            }
          }

          th.ant-table-column-has-actions.ant-table-column-has-sorters {
            padding-bottom: 30px;

            .ant-table-column-sorter {
              right: 3px;
            }
          }

          th:nth-last-child(-n + ${props => props.rightAligned || 0}) {
            text-align: right;
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
          background-color: #f3f3f4;
          font-weight: bold;
          margin-bottom: 10px;
          border-bottom: solid 1px ${fadedGrey};

          td:nth-last-child(-n + ${props => props.centerAligned || 0}) {
            text-align: center;
          }

          td:nth-last-child(-n + ${props => props.rightAligned || 0}) {
            text-align: right;
          }

          td {
            &.rawscore,
            &.assessmentDate {
              white-space: nowrap;
            }
          }

          td {
            height: 50px;
            padding: 10px;
            text-align: left;
            font-size: 12px;
            border-bottom: 10px solid white;

            &:nth-last-child(-n + ${props => props.colouredCellsNo}) {
              padding: 0px;
              div {
                height: 100%;
                width: 100%;
                padding: 10px;
              }
            }
          }
          .studentCount {
            text-align: right;
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
  text-align: ${({ textAlign }) => textAlign || "left"};
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
  z-index: 1;
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
  padding: ${({ padding }) => padding || "unset"};
  .ant-btn.ant-dropdown-trigger {
    white-space: nowrap;
    overflow: hidden;
    max-width: 100%;
    text-overflow: ellipsis;
    width: ${props => (props.width ? props.width : "100%")};
  }
`;

export const StyledAutocompleteDropDownContainer = styled.div`
  margin: 0px 5px;
  overflow: hidden;
  button {
    white-space: pre-wrap;
  }
  input {
    cursor: pointer;
    &:focus,
    :active {
      border-color: ${themeColor} !important;
      box-shadow: none;
    }
  }

  .anticon {
    color: ${themeColor};
  }
  .ant-select-selection {
    border: 1px solid #e6e6e6;
    background: #f8f8f8;
  }
  .ant-select-selection--multiple {
    padding-bottom: 6px;
  }
  .ant-select-selection--multiple .ant-select-selection__choice__content {
    text-transform: none;
  }
`;

export const StyledP = styled.p`
  margin-bottom: 15px;
`;

export const NoDataContainer = styled.div`
  background: white;
  margin: 20px 10px;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  font-size: 17px;
`;

export const CustomXAxisTickTooltipContainer = styled.div`
  pointer-events: none;
  visibility: ${props => props.visibility};
  position: absolute;
  top: 0px;
  transform: translate(${props => props.x}, ${props => props.y});
  padding: 5px;
  width: ${props => props.width}px;
  text-align: center;
  background: white;
  z-index: 1;
  background-color: #f0f0f0;
  color: black;
  border: solid 0.5px #bebebe;
  box-shadow: 0 0 8px #c0c0c0;
`;

export const StyledTag = styled.div`
  width: ${props => props.width || "auto"};
  padding: ${props => props.padding || "0px 20px"};
  margin: ${props => props.margin || "0px"};
  background: ${props => props.bgColor || themeColor};
  height: ${props => props.height || "24px"};
  color: ${props => props.textColor || "#ffffff"};
  font: ${props => props.fontStyle || "10px/14px Open Sans"};
  font-weight: ${props => props.fontWeight || "600"};
  letter-spacing: ${props => props.spacing || "0.2px"};
  border-radius: ${props => props.borderRadius || "5px"};
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: ${mediumDesktopExactWidth}) {
    height: 28px;
    font-size: 9px;
  }
`;

export const StyledLabel = styled.div`
  display: flex;
  align-items: center;
  min-width: ${props => props.minWidth || props.width};
  max-width: ${props => props.maxWidth || props.width};
  justify-content: ${props => props.justify};
  padding: ${props => props.padding || "0px"};
  font-weight: ${props => props.fontWeight || "600"};
  letter-spacing: ${props => props.spacing || "0.2px"};
  color: ${props => props.textColor || "grey"};
  text-align: ${props => props.textAlign || "left"};
  font-size: 14px;

  @media (max-width: ${mediumDesktopExactWidth}) {
    font-size: 10px;
  }
`;

export const HideLinkLabel = styled(StyledLabel)`
  padding: 4px 20px 10px 0px;
`;
