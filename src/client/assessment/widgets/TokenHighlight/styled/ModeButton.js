import styled from 'styled-components';
import { white, green, blue } from '@edulastic/colors';

export const ModeButton = styled.button`
  padding: 10px;
  border-radius: 4px;
  border: 1px solid ${({ active }) => (active ? green : blue)};
  color: ${white};
  background: ${({ active }) => (active ? green : blue)};
  &:focus {
    outline: none;
  }
`;
