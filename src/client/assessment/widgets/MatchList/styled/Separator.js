import styled from 'styled-components';
import { secondaryTextColor } from '@edulastic/colors';

export const Separator = styled.div`
  max-width: ${({ smallSize }) => (smallSize ? 22 : 47)}px;
  width: 100%;
  height: 0;
  position: relative;
  display: block;
  border: 1px solid ${secondaryTextColor};

  &:after {
    content: '';
    position: absolute;
    right: ${({ smallSize }) => (smallSize ? -4.5 : -7)}px;
    top: ${({ smallSize }) => (smallSize ? -4.5 : -7)}px;
    width: ${({ smallSize }) => (smallSize ? 9 : 14)}px;
    height: ${({ smallSize }) => (smallSize ? 9 : 14)}px;
    background: ${secondaryTextColor};
    display: block;
    border-radius: 50%;
  }

  &:before {
    content: '';
    position: absolute;
    left: ${({ smallSize }) => (smallSize ? -4.5 : -7)}px;
    top: ${({ smallSize }) => (smallSize ? -4.5 : -7)}px;
    width: ${({ smallSize }) => (smallSize ? 9 : 14)}px;
    height: ${({ smallSize }) => (smallSize ? 9 : 14)}px;
    background: ${secondaryTextColor};
    display: block;
    border-radius: 50%;
  }
`;
