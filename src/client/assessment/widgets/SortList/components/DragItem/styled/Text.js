import styled from 'styled-components';
import { green, red, lightGreen, lightRed } from '@edulastic/colors';

export const Text = styled.div`
  resize: none;
  width: ${({ showDragHandle, smallSize }) =>
    (showDragHandle ? (smallSize ? 'calc(100% - 30px)' : 'calc(100% - 50px)') : '100%')};
  height: 100%;
  border: ${({ checkStyle }) => (checkStyle ? 'none' : '')};
  border-left: ${({ checkStyle, correct }) =>
    (checkStyle ? (correct ? `2px solid ${green}` : `2px solid ${red}`) : 'none')};
  background: ${({ checkStyle, correct }) =>
    (checkStyle ? (correct ? `${lightGreen}` : `${lightRed}`) : 'none')};
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  min-height: ${({ smallSize }) => (smallSize ? 20 : 31)}px;
  padding: ${({ smallSize }) => (smallSize ? '5px' : '15px')};
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${({ smallSize }) => (smallSize ? '13px' : '16px')};
`;
