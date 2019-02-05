import styled, { css } from 'styled-components';
import { blue } from '@edulastic/colors';

export const Wrapper = styled.div`
  border: 1px solid transparent;
  position: relative;

  ${props =>
    props.active &&
  css`
      border-color: ${blue};
      border-left-color: transparent;
      border-right-color: transparent;
    `}
`;


