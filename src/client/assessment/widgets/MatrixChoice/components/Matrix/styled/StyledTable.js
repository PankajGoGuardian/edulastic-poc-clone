import styled from "styled-components";
import { Table } from "antd";
import { mobileWidth, desktopWidth, mainTextColor, smallDesktopWidth } from "@edulastic/colors";
import { fonts } from "@edulastic/constants";

export const StyledTable = styled(Table)`
  table {
    max-width: ${props => props.maxWidth && `${props.maxWidth}px !important`};
    width: ${props => (props.maxWidth ? "max-content" : "100%")};
    font-size: ${props => props.theme.fontSize};
    font-weight: ${fonts.previewFontWeight};
    border: 1px solid ${props => props.theme.widgets.matrixChoice.styledTableBorderColor};

    tbody {
      border-collapse: collapse;
    }

    thead {
      tr:not(:last-child) > th[colspan] {
        display: ${({ hasOptionRow }) => (!hasOptionRow ? "none" : null)};
      }

      tr:nth-of-type(2) {
        display: ${props => !!props.hideEmptycell && "none"};
      }
    }

    tr {
      &:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td {
        background: none;
      }

      th {
        text-align: center;
        padding: 0;
        background: ${props => props.theme.widgets.matrixChoice.styledTableThBgColor};
        border-width: 1px;
        border-style: solid;
        border-color: ${props => props.theme.widgets.matrixChoice.styledTableBorderColor}!important;
        border-left: 1px solid ${props => props.theme.widgets.matrixChoice.styledTableBorderColor}!important;
        border-top: "inherits";
      }
      td {
        padding: 0;
        text-align: center;
        border: 1px solid ${props => props.theme.widgets.matrixChoice.styledTableBorderColor};
        border-width: 1px;
        border-style: solid;
        border-color: ${props => props.theme.widgets.matrixChoice.styledTableBorderColor}!important;
        border-bottom: ${props => (props.horizontalLines ? "inherits" : 0)};
        border-top: ${props => (props.horizontalLines ? "inherits" : 0)};
        color: ${mainTextColor};
        min-width: 110px;
        height: 50px;
      }
      td div {
        padding: 6px;
        word-break: break-word;
      }
      td:nth-of-type(1) div {
        min-width: 50px;
      }
    }

    tr:last-child {
      td {
        border-bottom: 1px solid ${props => props.theme.widgets.matrixChoice.styledTableBorderColor};
      }
    }

    @media (max-width: ${desktopWidth}) {
      font-size: ${fonts.previewFontSizeMobile};
    }
  }

  .ant-table {
    overflow: auto;
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
`;
