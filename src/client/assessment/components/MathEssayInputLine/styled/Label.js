import styled from 'styled-components';
import { blue, white } from '@edulastic/colors';

export const Label = styled.div`
  position: absolute;
  right: 0;
  top: -14px;
  width: 70px;
  height: 14px;
  line-height: 14px;
  background: ${blue};
  color: ${white};
  text-transform: uppercase;
  text-align: center;
  font-size: 10px;
`;
