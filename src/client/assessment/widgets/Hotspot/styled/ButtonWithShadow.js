import styled from 'styled-components';
import { white } from '@edulastic/colors';

export const ButtonWithShadow = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 103px;
  cursor: pointer;
  height: 105px;
  border-radius: 4px;
  box-shadow: ${({ active }) => (active ? '1px 3px 6px 0 rgba(0, 0, 0, 0.06)' : 'none')};
  background-color: ${({ active }) => (active ? white : 'transparent')};
  transition: all 0.3s ease-in-out;
  &:hover {
    box-shadow: 1px 3px 6px 0 rgba(0, 0, 0, 0.06);
  }
`;
