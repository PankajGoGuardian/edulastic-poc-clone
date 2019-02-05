import styled from 'styled-components';
import { Table } from 'antd';
import { white } from '@edulastic/colors';

export const StyledTable = styled(Table)`
  tbody {
    border-collapse: collapse !important;
    border: 1px solid #e8e8e8 !important;
  }
  th {
    text-align: center !important;
    padding: ${props => (props.smallSize ? 3 : 16)}px !important;
    border-bottom: 0 !important;
    background: ${white} !important;
  }
  td {
    padding: 0 !important;
    text-align: center;
  }
`;
