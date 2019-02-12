import styled from 'styled-components';
import { Table } from 'antd';
import { white } from '@edulastic/colors';

export const StyledTable = styled(Table)`
  table {
    font-size: ${props => props.fontSize};
    border: 1px solid #e8e8e8 !important;
  }
  tbody {
    border-collapse: collapse !important;
  }
  th {
    text-align: center !important;
    padding: 0 !important;
    background: ${white} !important;
    border-left: 1px solid #e8e8e8;
    border-top: ${props => (props.horizontalLines ? 'inherits' : 0)} !important;
  }
  td {
    padding: 0 !important;
    text-align: center;
    border: 1px solid #e8e8e8;
    border-bottom: ${props => (props.horizontalLines ? 'inherits' : 0)} !important;
    border-top: ${props => (props.horizontalLines ? 'inherits' : 0)} !important;
  }
`;
