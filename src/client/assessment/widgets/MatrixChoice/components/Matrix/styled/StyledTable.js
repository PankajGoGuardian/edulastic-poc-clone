import styled from "styled-components";
import { Table } from "antd";
import { mobileWidth } from "@edulastic/colors";

export const StyledTable = styled(Table)`
  table {
    width: 100%;
    font-size: ${props => props.fontSize};
    border: 1px solid ${props => props.theme.widgets.matrixChoice.styledTableBorderColor};
    tbody {
      border-collapse: collapse;
    }
    tr {
      th {
        text-align: center;
        padding: 0;
        background: ${props => props.theme.widgets.matrixChoice.styledTableThBgColor};
        border-left: 1px solid ${props => props.theme.widgets.matrixChoice.styledTableBorderColor};
        border-top: ${props => (props.horizontalLines ? "inherits" : 0)};
      }
      td {
        padding: 0;
        text-align: center;
        border: 1px solid ${props => props.theme.widgets.matrixChoice.styledTableBorderColor};
        border-bottom: ${props => (props.horizontalLines ? "inherits" : 0)};
        border-top: ${props => (props.horizontalLines ? "inherits" : 0)};
      }
      td div {
        max-width: 250px;
        padding: 5px;
        word-break: break-word;
      }
      td:nth-of-type(1) div {
        min-width: 50px;
      }
    }
  }
  @media (max-width: ${mobileWidth}) {
    .ant-table-body {
      overflow-x: scroll;

      td {
        min-width: 100px;
      }
    }
  }
`;
