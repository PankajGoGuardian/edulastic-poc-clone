import styled from 'styled-components';
import { blue, white } from '@edulastic/colors';

export const Button = styled.div`
  width: 20px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  font-size: 14px;
  border: 1px solid ${blue};
  border-radius: 5px;
  margin-right: 15px;
  cursor: pointer;

  :hover,
  &.active {
    background: ${blue};
    color: ${white};
  }

  :last-child {
    margin-right: 0;
  }
`;
