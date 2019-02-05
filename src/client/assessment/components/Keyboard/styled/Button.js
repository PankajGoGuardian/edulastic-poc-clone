import styled from 'styled-components';
import { mainTextColor, grey, dashBorderColor, white } from '@edulastic/colors';

export const Button = styled.button`
  background: ${grey};
  color: ${mainTextColor};
  border: 0;
  height: 50px;
  width: ${props => props.width || 50}px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;
  border: 1px solid ${white};
  border-top: 0;
  border-left: 0;

  &.active {
    background: #b6bac1;
  }

  :hover {
    background: ${dashBorderColor};
  }

  :active {
    background: ${white};
  }
`;
