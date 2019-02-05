import styled from 'styled-components';
import { green, red, lightGrey } from '@edulastic/colors';

export const IconTrashWrapper = styled.div`
  width: 50px;
  height: 50px;
  display: inline-flex;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  color: ${green};
  font-weight: 300;

  :hover {
    cursor: pointer;
    color: ${red};
    background: ${lightGrey};
  }
`;
