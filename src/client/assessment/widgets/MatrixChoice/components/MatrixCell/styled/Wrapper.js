import styled from 'styled-components';
import { lightGreen, lightRed } from '@edulastic/colors';

const getCellColor = (correct) => {
  switch (correct) {
    case true:
      return lightGreen;
    case 'incorrect':
      return lightRed;
    default:
      return '';
  }
};

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => getCellColor(props.correct, props.showAnswer)};
  padding: ${props => (props.smallSize ? 1 : 15)}px;
`;
