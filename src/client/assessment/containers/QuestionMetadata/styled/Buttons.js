import styled from 'styled-components';
import { green } from '@edulastic/colors';

export const Buttons = styled.div`
  margin-top: 2px;
  margin-left: 6px;
  display: flex;

  .ant-btn-circle {
    background: ${green};
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16);
  }
`;
