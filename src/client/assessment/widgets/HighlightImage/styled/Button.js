import styled from 'styled-components';
import { secondaryTextColor, greenDark } from '@edulastic/colors';

export const Button = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background: transparent;
  color: ${secondaryTextColor};
  cursor: pointer;
  user-select: none;
  opacity: ${({ disabled }) => (disabled ? 0.3 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'all')};
  svg {
    fill: ${secondaryTextColor};
  }
  &:hover {
    color: ${greenDark};
    svg {
      fill: ${greenDark};
    }
  }
`;
