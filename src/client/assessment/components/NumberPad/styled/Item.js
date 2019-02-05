import styled from 'styled-components';
import { grey, textColor, lightGrey, white } from '@edulastic/colors';

export const Item = styled.div`
  width: 25%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${grey};
  color: ${textColor};
  font-weight: 700;
  background: ${lightGrey};
  cursor: pointer;
  user-select: none;

  :hover {
    background: ${grey};
  }

  :active {
    background: ${white};
  }
`;
