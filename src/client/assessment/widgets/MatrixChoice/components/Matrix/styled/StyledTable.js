import styled from 'styled-components';
import { Table } from 'antd';

export const StyledTable = styled(Table)`
  table {
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
        border-top: ${props => (props.horizontalLines ? 'inherits' : 0)};
      }
      td {
        padding: 0;
        text-align: center;
        border: 1px solid ${props => props.theme.widgets.matrixChoice.styledTableBorderColor};
        border-bottom: ${props => (props.horizontalLines ? 'inherits' : 0)};
        border-top: ${props => (props.horizontalLines ? 'inherits' : 0)};
      }
    }
  }
`;
