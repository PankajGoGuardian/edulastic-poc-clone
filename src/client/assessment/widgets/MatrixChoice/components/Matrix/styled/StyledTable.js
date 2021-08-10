import styled from 'styled-components'
import { Table } from 'antd'
import {
  mobileWidth,
  desktopWidth,
  mainTextColor,
  smallDesktopWidth,
} from '@edulastic/colors'
import { fonts } from '@edulastic/constants'

export const StyledTable = styled(Table)`
  .ant-table table {
    max-width: ${(props) => props.maxWidth && `${props.maxWidth}px !important`};
    width: ${(props) => (props.maxWidth ? 'auto' : '100%')};
    font-size: ${(props) => props.theme.fontSize};
    font-weight: ${fonts.previewFontWeight};
    border: 1px solid
      ${(props) => props.theme.widgets.matrixChoice.styledTableBorderColor};
    background: ${(props) =>
      props.theme.widgets.matrixChoice.styledTableThBgColor};

    tbody {
      border-collapse: collapse;
      /* To fix height issue with firefox */
      .ant-table-row-cell-break-word {
        height: auto;
      }
    }

    thead {
      display: ${(props) => !props.showHead && 'none'};

      tr:not(:last-child) > th[colspan] {
        display: ${({ hasOptionRow, isTable }) =>
          !hasOptionRow && isTable ? 'none' : null};
      }

      tr:last-child {
        display: ${({ isTable }) => (!isTable ? 'none' : null)};
      }
    }

    tr {
      &:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td {
        background: none;
      }

      th {
        text-align: center;
        padding: 0;
        background: ${(props) =>
          props.theme.widgets.matrixChoice.styledTableThBgColor};
        border-width: 1px;
        border-style: solid;
        border-color: ${(props) =>
          props.theme.widgets.matrixChoice.styledTableBorderColor};
        border-left: 1px solid
          ${(props) => props.theme.widgets.matrixChoice.styledTableBorderColor};
      }
      td {
        height: 1px;
        padding: 0;
        text-align: center;
        border: 1px solid
          ${(props) => props.theme.widgets.matrixChoice.styledTableBorderColor};
        border-width: 1px;
        border-style: solid;
        border-color: ${(props) =>
          props.theme.widgets.matrixChoice.styledTableBorderColor};
        border-bottom: ${(props) => !props.horizontalLines && 0};
        border-top: ${(props) => !props.horizontalLines && 0};
        color: ${mainTextColor};
        min-width: 110px;
        height: 32px;
      }
      td div {
        padding: 0px;
        margin: 2px;
        border-radius: 4px;
        word-break: break-word;
      }
      td:nth-of-type(1) div {
        min-width: 50px;
      }
    }

    tr:last-child {
      td {
        border-bottom: 1px solid
          ${(props) => props.theme.widgets.matrixChoice.styledTableBorderColor};
      }
    }

    tr:first-child {
      td {
        border-top: 1px solid
          ${(props) => props.theme.widgets.matrixChoice.styledTableBorderColor};
      }
    }

    @media (max-width: ${desktopWidth}) {
      font-size: ${fonts.previewFontSizeMobile};
    }
  }
  .ant-table {
    overflow-x: auto;
    overflow-y: hidden;
  }
  @media (min-width: ${smallDesktopWidth}) {
    .ant-table {
      width: 100%;
      margin: 0px 6px 0px 0px;
    }
  }
  @media (max-width: ${mobileWidth}) {
    .ant-table-body {
      td {
        min-width: 100px;
      }
    }
  }
`
