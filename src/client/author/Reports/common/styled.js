import {
  darkGrey,
  extraDesktopWidthMax,
  fadedBlack,
  fadedGrey,
  grey,
  lightGrey3,
  lightGreySecondary,
  themeColor,
  white,
  themeColorBlue,
} from '@edulastic/colors'
import { EduButton, Card, FieldLabel } from '@edulastic/common'
import { Text } from '@vx/text'
import Col from "antd/es/Col";
import Slider from "antd/es/Slider";
import Table from "antd/es/Table";
import Button from "antd/es/Button";
import styled from 'styled-components'
import { CustomChartTooltip } from './components/charts/chartUtils/tooltip'

export const StyledCell = styled.div`
  height: 100%;
  width: 100%;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: ${(props) => props.justify || 'flex-end'};

  @media print {
    -webkit-print-color-adjust: exact;
    color-adjust: exact;
  }
`

export const PrintablePrefix = styled.b`
  display: none;
  padding-left: 5px;
  float: left;

  @media print {
    display: block;
  }
`

export const StyledGoButton = styled(EduButton)`
  height: 24px;
  line-height: 1;
  width: 80px;
  font-size: 11px;
`

export const FilterLabel = styled(FieldLabel)`
  font-size: 10px;
`

export const GoButtonWrapper = styled.div`
  margin-bottom: 15px;
  display: flex;
  align-items: center;
`

export const StyledFilterWrapper = styled.div`
  ${({ isRowFilter }) =>
    isRowFilter
      ? `
    width: 60%;
    display: flex;
    justify-content: flex-end;
  `
      : `
    margin-right: 16px;
    width: 230px;
    flex-shrink: 0;
    height: calc(100vh - 250px);
    position: relative;
  `}

  .ant-select-selection {
    &__rendered {
      padding-left: 0px;
    }
  }

  .ant-select {
    width: 100%;
    font-size: 11px;
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
      height: 34px;
      font-size: 11px;
      font-weight: 600;
      max-width: 100%;
      width: 100%;

      i {
        color: ${themeColor};
      }
    }
  }
`

export const StyledReportsContentContainer = styled.div`
  padding: 0px 30px;
`

export const DropDownContainer = styled.div`
  .dropdown-container {
    text-align: left;
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
  }
`

export const StyledCard = styled(Card)`
  box-shadow: none;
  .ant-card-body {
    padding: 0px;
  }
`

export const StyledContainer = styled.div`
  padding: 0px;
  position: relative;
`

export const StyledIframe = styled.iframe`
  border: 0px;
`

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
            text-align: center;
            font-weight: 600;
            font-size: 10px;
            border: 0px;
            color: #aaafb5;
            background: ${white};

            .ant-table-column-sorters {
              /* display: inline; */
            }

            &.ant-table-column-sort {
              background: rgba(255, 255, 255, 1) !important;
            }

            .ant-table-header-column {
              .ant-table-column-sorters {
                right: 3px;
                &:hover::before {
                  background: rgba(255, 255, 255, 1);
                }
                .ant-table-column-sorter-inner {
                  height: 18px;
                }
              }
            }
          }
        }
      }

      tbody {
        tr {
          background-color: ${white};
          font-weight: bold;
          border-bottom: 1px solid ${fadedGrey};

          td {
            &.rawscore,
            &.assessmentDate {
              white-space: nowrap;
            }
          }

          td {
            padding: 10px 8px;
            text-align: center;
            font-size: 11px;
            border-bottom: 1px solid #f3f3f3;
            color: #434b5d;

            &:nth-last-child(-n + ${(props) => props.colouredCellsNo}) {
              padding: 0px;
              div {
                height: 100%;
                width: 100%;
                padding: 10px;
              }
            }

            @media (min-width: ${extraDesktopWidthMax}) {
              font-size: 14px;
            }
          }
          &.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)
            > td,
          &.ant-table-row-hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)
            > td,
          &:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)
            > td,
          &:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)
            > td {
            background-color: ${lightGrey3};
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
`

export const StyledH3 = styled.h3`
  font-weight: 700;
  color: ${fadedBlack};
  font-size: 14px;
  margin: 0px 0px 10px;
  text-align: ${({ textAlign }) => textAlign || 'left'};
`

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
`

export const Capitalized = styled.span`
  text-transform: capitalize;
`

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
`

export const StyledChartNavButton = styled(EduButton)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 32px;
  width: 32px;
  border-radius: 50%;
  z-index: 1;

  .ant-btn > .anticon {
    line-height: 0.8;
  }

  @media print {
    display: none;
  }
`

export const StyledAxisTickText = styled(Text)`
  font-size: 12px;
`

export const StyledText = styled.text`
  font-size: 12px;
`

export const PrintableScreen = styled.div`
  @media print {
    width: 250mm;
    @page {
      margin: 0 !important;
      padding: 0 !important;
    }
    .fixed-header,
    .navigator-tabs-container,
    .ant-pagination,
    .single-assessment-report-go-button-container,
    .anticon-caret-down {
      display: none;
    }
    .ant-table-scroll table {
      display: contents !important;
      thead th.class-name-column {
        min-width: auto !important;
      }
    }
  }
`

export const StyledSignedBarContainer = styled.div`
  .recharts-default-legend {
    .recharts-legend-item {
      &:nth-child(1) {
        padding-left: 90px;
      }
    }
  }
`

export const StyledDropDownContainer = styled(Col)`
  padding: ${({ padding }) => padding || 'unset'};
  .ant-btn.ant-dropdown-trigger {
    white-space: nowrap;
    overflow: hidden;
    max-width: 100%;
    text-overflow: ellipsis;
    width: ${(props) => (props.width ? props.width : '100%')};
  }
  @media print {
    display: none;
  }
`

export const StyledAutocompleteDropDownContainer = styled.div`
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
`

export const StyledP = styled.p`
  margin-bottom: 15px;
`

export const NoDataContainer = styled.div`
  background: white;
  color: ${fadedBlack};
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 25px;
  font-weight: 700;
`

export const CustomXAxisTickTooltipContainer = styled.div`
  pointer-events: none;
  visibility: ${(props) => props.visibility};
  position: absolute;
  top: 0px;
  transform: translate(${(props) => props.x}, ${(props) => props.y});
  padding: 5px;
  width: ${(props) => props.width}px;
  text-align: center;
  background: white;
  z-index: 1;
  background-color: #f0f0f0;
  color: black;
  border: solid 0.5px #bebebe;
  box-shadow: 0 0 8px #c0c0c0;
`

export const StyledTag = styled.div`
  padding: ${(props) => props.padding || '0px 20px'};
  margin: ${(props) => props.margin || '0px'};
  background: ${(props) => props.bgColor || themeColor};
  height: 28px;
  width: 128px;
  font-size: 9px;
  color: ${(props) => props.textColor || '#ffffff'};
  font-weight: ${(props) => props.fontWeight || '600'};
  letter-spacing: ${(props) => props.spacing || '0.2px'};
  border-radius: ${(props) => props.borderRadius || '5px'};
  display: flex;
  justify-content: center;
  align-items: center;

  @media (min-width: ${extraDesktopWidthMax}) {
    width: ${(props) => props.width || 'auto'};
    height: ${(props) => props.height || '24px'};
    font: ${(props) => props.fontStyle || '10px/14px Open Sans'};
  }

  @media print {
    -webkit-print-color-adjust: exact;
    color-adjust: exact;
  }
`

export const StyledLabel = styled.div`
  display: flex;
  align-items: center;
  min-width: ${(props) => props.minWidth || props.width};
  max-width: ${(props) => props.maxWidth || props.width};
  justify-content: ${(props) => props.justify};
  padding: ${(props) => props.padding || '0px'};
  font-weight: ${(props) => props.fontWeight || '600'};
  letter-spacing: ${(props) => props.spacing || '0.2px'};
  color: ${(props) => props.textColor || 'grey'};
  text-align: ${(props) => props.textAlign || 'left'};
  font-size: 10px;

  @media (min-width: ${extraDesktopWidthMax}) {
    font-size: 12px;
  }
`

export const InfoColumnLabel = styled(StyledLabel)``

export const HideLinkLabel = styled(StyledLabel)`
  width: 80px;
  white-space: nowrap;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;
  font-size: 9px;
`

export const ReportContaner = styled.div`
  width: ${({ showFilter }) =>
    showFilter ? 'calc(100% - 250px)' : 'calc(100% - 35px)'};
  position: relative;
`

export const FilterButton = styled(Button)`
  min-width: 35px;
  min-height: 25px;
  border-radius: 3px;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.3);
  background: ${({ showFilter }) => (showFilter ? themeColorBlue : white)};
  border-color: ${themeColorBlue} !important;
  margin-right: ${({ showFilter }) => (showFilter ? 0 : 10)}px;
  margin-top: -4px;
  margin-left: ${({ showFilter }) => (showFilter ? -75 : 0)}px;
  padding: 5px 2px 2px;
  transition: 0s !important;

  &:focus,
  &:hover {
    outline: unset;
    background: ${({ showFilter }) => (showFilter ? themeColorBlue : white)};
  }

  svg {
    fill: ${({ showFilter }) =>
      showFilter ? white : themeColorBlue} !important;
    width: 20px;
    height: 20px;
  }
  @media print {
    display: none;
  }
`

export const FilterButtonClear = styled(Button)`
  min-width: 35px;
  min-height: 25px;
  border: none;
  margin-right: ${({ showFilter }) => (showFilter ? 0 : 10)}px;
  margin-top: -4px;
  margin-left: ${({ showFilter }) => (showFilter ? -80 : 0)}px;
  padding: 5px 2px 2px;
  box-shadow: none;

  &:focus,
  &:hover {
    outline: unset;
  }

  svg {
    fill: ${({ showFilter }) =>
      showFilter ? '#1AB395' : '#434b5d'} !important;
    width: 20px;
    height: 20px;
  }
  @media print {
    display: none;
  }
`

export const SearchField = styled.div`
  margin-bottom: 10px;
  padding-right: 15px;
`

export const ApplyFitlerLabel = styled(FieldLabel)`
  margin-bottom: 0px;
  margin-right: 15px;
  color: #434b5d;
  font-weight: bolder;
`

export const ColoredCell = styled.div`
  background-color: ${({ bgColor }) => bgColor};
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'default')};
  @media print {
    background-color: ${({ bgColor }) => bgColor};
    -webkit-print-color-adjust: exact;
    color-adjust: exact;
  }
`
