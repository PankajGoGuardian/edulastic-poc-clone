import React from 'react'
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
  greyThemeDark3,
  lightGrey1,
} from '@edulastic/colors'
import { EduButton, Card, FieldLabel, notification } from '@edulastic/common'
import { Text } from '@vx/text'
import { Col, Slider, Table, Button, Menu, Row, Icon, Checkbox } from 'antd'
import styled, { css } from 'styled-components'
import { IconQuestionCircle } from '@edulastic/icons'
import { CustomChartTooltip } from './components/charts/chartUtils/tooltip'
import { CustomTooltip } from './components/charts/chartUtils/CustomTooltip'
import { getTooltipArrowStyles } from './util'

export const styledNotification = ({ ...props }) =>
  notification({
    ...props,
    msg: (
      <div
        style={{
          whiteSpace: 'nowrap',
          paddingTop: '1.5px',
        }}
      >
        {props.msg}
      </div>
    ),
  })

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

export const FilterLabel = styled(FieldLabel)`
  font-size: ${(props) => props.fontSize || '10px'};
`

export const ReportFiltersContainer = styled.div`
  display: ${({ visible }) => (visible ? 'block' : 'none')};
  position: relative;
  @media print {
    display: none;
  }
`

const antSelectStyles = css`
  .ant-select {
    width: 100%;
    font-size: 11px;
  }
  .ant-select-dropdown {
    font-size: 11px;
    .ant-select-dropdown-menu-item {
      padding: 4px 12px;
    }
    .ant-select-dropdown-menu-item-selected,
    .ant-select-dropdown-menu-item-active {
      background-color: ${themeColorBlue};
      color: #ffffff;
    }
    .ant-select-dropdown-menu-item,
    .ant-select-dropdown-menu-submenu-title {
      font-size: 11px;
    }
  }
  .ant-select-selection {
    &__rendered {
      padding-left: 0px;
      font-size: 11px;
      font-weight: 600;
    }
  }
  .ant-select-auto-complete.ant-select .ant-input {
    background-color: #f8f8f8;
    border-color: #e5e5e5;
    border-radius: 2px;
    min-height: 34px;
    font-size: 11px;
    font-weight: 600;
  }
  .ant-input-affix-wrapper .ant-input-suffix {
    right: 8px;
    i {
      svg {
        color: ${themeColor};
      }
    }
  }
`

export const ReportFiltersWrapper = styled.div`
  position: absolute;
  z-index: 100;
  top: 30px;
  right: 0px;
  width: 60vw;
  padding: 10px 25px 25px;
  border-radius: 4px;
  background-color: white;
  box-sizing: border-box;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  -webkit-transition: all 0.5s ease-in-out;
  -moz-transition: all 0.5s ease-in-out;
  -ms-transition: all 0.5s ease-in-out;
  -o-transition: all 0.5s ease-in-out;
  transition: all 0.5s ease-in-out;

  .report-filters-inner-wrapper {
    opacity: ${({ loading }) => (loading ? 0 : 1)};
    -webkit-transition: all 0.5s ease-in-out;
    -moz-transition: all 0.5s ease-in-out;
    -ms-transition: all 0.5s ease-in-out;
    -o-transition: all 0.5s ease-in-out;
    transition: all 0.5s ease-in-out;
  }

  .ant-tabs {
    overflow: visible;
    & .ant-tabs-tab {
      font-size: 11px;
      font-weight: 600;
      font-style: normal;
      font-stretch: normal;
      text-transform: uppercase;
    }
  }
  ${antSelectStyles}
  .ant-select-selection.ant-select-selection--multiple {
    background-color: ${lightGreySecondary};
    border-color: ${fadedGrey};
    min-height: 34px !important;
    padding-bottom: 0px;
    .ant-select-arrow-icon {
      color: ${themeColor};
      font-size: 11px;
      transform: none;
    }
  }
  .ant-select-selection.ant-select-selection--multiple
    .ant-select-selection__rendered
    .ant-select-selection__choice {
    margin: 4px 0 0 5px !important;
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
  .ant-collapse h3 {
    background: none;
    padding-left: 5px;
  }
  .ant-dropdown {
    box-shadow: 0 0 5px;
  }
  .ant-btn.ant-dropdown-trigger {
    white-space: nowrap;
    overflow: hidden;
    max-width: 100%;
    text-overflow: ellipsis;
    width: 100%;
  }
`

export const StyledEduButton = styled(EduButton)`
  &,
  &:focus {
    &.ant-btn.ant-btn-primary {
      background-color: ${white};
      color: ${({ isBlue }) => (isBlue ? themeColorBlue : themeColor)};
      border-color: ${({ isBlue }) => (isBlue ? themeColorBlue : themeColor)};
    }
    svg {
      fill: ${({ isBlue }) =>
        isBlue ? themeColorBlue : themeColor} !important;
    }
  }
  /* isGhost prop => filter inactive */
  ${({ isGhost }) => (isGhost ? '' : '&,&:focus,')}
  &:active,
  &:hover {
    &.ant-btn.ant-btn-primary {
      background-color: ${({ isBlue }) =>
        isBlue ? themeColorBlue : themeColor};
      border-color: ${({ isBlue }) => (isBlue ? themeColorBlue : themeColor)};
      color: ${white};
    }
    svg {
      fill: ${white} !important;
    }
  }
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
    padding: ${(props) => props.padding || '0px'};
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
            font-weight: bold;
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
  font-weight: ${({ fontWeight }) => fontWeight || 700};
  color: ${fadedBlack};
  font-size: ${({ fontSize }) => fontSize || '14px'};
  margin: ${({ margin }) => margin || '0 0 10px 0'};
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

export const StyledCustomChartTooltipDark = styled(CustomTooltip)`
  width: 200px;
  min-height: 75px;
  background-color: #4b4b4b;
  border-radius: 10px;
  box-shadow: 0 0 20px #c0c0c0;
  padding: 20px;
  font-size: 12px;
  font-weight: 600;
  z-index: 999 !important;

  .tooltip-key {
    font-weight: 900;
  }
  &:after {
    content: '';
    height: 0;
    width: 0;
    position: absolute;
    border-style: solid;
    border-width: 10px 10px 0 10px;
    border-color: #4b4b4b transparent transparent transparent;
    ${(props) => getTooltipArrowStyles(props)};
  }
`

export const TooltipRow = styled.div`
  display: flex;
  margin-bottom: 10px;
`

export const TooltipRowTitle = styled.p`
  color: #b0b0b0;
`

export const TooltipRowValue = styled.p`
  color: #ffffff;
  margin-left: 10px;

  &:last-child {
    margin-bottom: 0px;
  }
`
export const DashedHr = styled.hr`
  margin: 20px 0px;
  border: 1px dashed #b0b0b0;
`
export const ColorBandRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;

  &:last-child {
    margin-bottom: 0px;
  }
`

export const ColorCircle = styled.div`
  border-radius: 50%;
  border: 2px solid #ffffff;
  height: ${({ height }) => height || '20px'};
  aspect-ratio: 1/1;
  background-color: ${({ color }) => color || '#ffffff'};
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
  font-size: ${(props) => props.fontSize || '12px'};
  font-weight: ${(props) => props.fontWeight || 'normal'};
  fill: ${(props) => props.fill || 'black'};
`

export const StyledText = styled.text`
  font-size: 12px;
`

export const PrintableScreen = styled.div`
  @media print {
    @page {
      size: A4 landscape !important;
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
    .attendance-summary {
      .recharts-wrapper,
      .recharts-legend-wrapper {
        width: 100% !important;
        height: 100% !important;
      }
    }
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
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
  flex: ${({ flex, autoFlex }) => flex ?? (autoFlex ? '1 1 0' : '0 0 auto')};
  max-width: ${({ maxWidth }) => maxWidth || 'inherit'};
  .ant-btn.ant-dropdown-trigger {
    white-space: nowrap;
    overflow: hidden;
    max-width: 100%;
    text-overflow: ellipsis;
    border-radius: 2px;
    width: ${(props) => (props.width ? props.width : '100%')};
  }
  .ant-select-selection--multiple {
    font-size: 11px;
    border-radius: 2px;
  }
  ${antSelectStyles}
  .standards-mastery-report-domain-autocomplete {
    .ant-select {
      width: 100%;
      height: 32px;
    }
    .ant-select-dropdown-menu-item-group {
      font-size: 11px;
      .ant-select-dropdown-menu-item {
        padding: 4px 12px;
      }
      .ant-select-dropdown-menu-item-selected,
      .ant-select-dropdown-menu-item-active {
        background-color: ${themeColorBlue};
        color: #ffffff;
      }
      .ant-select-dropdown-menu-item,
      .ant-select-dropdown-menu-submenu-title {
        font-size: 11px;
      }
    }
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
  .ant-select-selection--multiple .ant-select-selection__choice {
    max-width: 87%;
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
  margin-top: ${({ margin }) => margin || '290px'};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${({ fontSize }) => fontSize || '25px'};
  font-weight: 700;
  text-align: 'center';
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

  &:hover {
    background: ${themeColorBlue};
    color: ${white};
  }

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

export const MenuStyled = styled(Menu)`
  .ant-dropdown-menu-item-active {
    &:hover {
      background: ${themeColorBlue};
      color: ${white};
      a {
        color: ${white};
      }
    }
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
  font-size: ${({ fontSize }) => fontSize || '10px'};

  @media (min-width: ${extraDesktopWidthMax}) {
    font-size: 12px;
  }
`

export const HideLinkLabel = styled(StyledLabel)`
  width: 80px;
  white-space: nowrap;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;
  font-size: 9px;
`

export const ReportContainer = styled.div`
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

export const ResetButtonClear = styled(Button)`
  min-width: 35px;
  min-height: 25px;
  border: none;
  margin-top: -4px;
  padding: 5px 2px 2px;
  box-shadow: none;
  transition: none;
  color: #1ab395;
  &:focus,
  &:hover {
    outline: unset;
    color: #1ab395;
  }
  @media print {
    display: none;
  }
`

export const SearchField = styled.div`
  margin-bottom: 10px;
  padding-right: 15px;
  padding-left: 5px;
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
export const SecondaryFilterRow = styled(Row).attrs((props) => ({
  type: 'flex',
  gutter: [8, 0],
  justify: 'end',
  align: 'middle',
  ...props,
}))`
  padding-left: 10px;
  padding-top: 5px;
  float: right;
  align-items: flex-end;
  width: ${(p) => p.width || '75%'};
  & input,
  button {
    ${(p) => (p.fieldHeight ? `height: ${p.fieldHeight} !important;` : '')};
  }
`

export const DashedLine = styled.div`
  overflow: hidden !important;
  position: relative;
  flex-grow: 1;
  height: ${(props) => props.height ?? '0.5px'};
  max-width: ${(props) => props.maxWidth};
  margin: ${(props) => props.margin ?? '0 24px'};
  &:before {
    content: '';
    position: absolute;
    border: ${(props) => props.dashWidth ?? '5px'} dashed
      ${(props) => props.dashColor ?? '#707070'};
    inset: 0;
  }
`

export const SectionLabelWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  flex-grow: 1;
  margin: ${(p) => p.$margin || '32px 0'};
  width: ${(p) => p.width || '100%'};
  flex-grow: 1;
  align-items: center;
`

export const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  height: 24px;
  margin: 0 20px 0 20px;
  padding-right: 10px;
  padding-left: 10px;
`
export const StyledIconQuestionCircle = styled(IconQuestionCircle)`
  margin-right: 8px;
  height: 14px;
  width: 14px;
  path {
    fill: ${themeColor};
  }
`
export const StyledTextSpan = styled.span`
  color: ${themeColor};
  font-size: 12px;
`

export const PieChartWrapper = styled.div`
  width: ${(p) => p.$width};
  height: ${(p) => p.$height};
  flex-grow: 1;
`
export const HorizontalBarWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  min-width: 300px;
  margin-inline: 10px;
  justify-content: center;
  overflow: hidden;
  border-radius: 12px;
`
export const StyledSpan = styled.span`
  background-color: ${({ color }) => color};
  padding: 5px;
  flex-wrap: nowrap;
  width: ${({ value }) => value}%;
  font-size: 11px;
`

export const SectionDescriptionWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: ${(p) => p.$margin || '0px'};
  p {
    font-size: 14px;
    color: ${fadedBlack};
  }
`
export const StyledReportContainer = styled.div`
  @media print {
    -webkit-print-color-adjust: exact;
    color-adjust: exact;
    width: 1800px;
  }
`

export const StyledIcon = styled(Icon)`
  position: absolute;
  top: 210px;
  left: 32px;
  font-size: 12px;
  font-weight: bold;
  background-color: ${lightGrey1};
  padding: 3px;
  border-radius: 6px;
  color: ${themeColor};
`

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  h3 {
    font-weight: bold;
    color: ${greyThemeDark3};
  }
`
export const ContentWrapper = styled.div`
  display: flex;
  margin-top: 15px;
`

export const ImageContainer = styled.div`
  display: flex !important;
  align-items: center;
  justify-content: center;
  height: 150px;
  margin: 15px 0px 50px;
`

export const CustomStyledCard = styled(Card)`
  cursor: pointer;
  margin: 0 10px 20px;
  border: 1px solid ${grey};
  border-radius: 30px;
  box-shadow: none;
`
export const StyledSectionHeader = styled.div`
  display: block;
  font-weight: bold;
  font-size: 18px;
  margin: 20px;
  color: ${fadedBlack};
`
export const StyledCheckBox = styled(Checkbox)`
  display: flex;
  align-items: center;
  margin: 10px 8px;
  .ant-checkbox {
    margin-right: 10px;
  }
`
