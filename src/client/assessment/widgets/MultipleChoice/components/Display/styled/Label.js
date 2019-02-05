import styled from 'styled-components';
import { green } from '@edulastic/colors';

export const Label = styled.label`
  position: relative;
  display: inline-block;
  padding-left: ${props => (props.smallSize ? 5 : 20)}px;
  border: dotted 1px transparent;
  border-left: solid 3px transparent;
  margin: ${props => (props.setAnswers ? '5px 0' : '10px 0')};
  width: ${props => props.width || '100%'};

  &:hover {
    border: dotted 1px lightgrey;
    border-left: solid 3px lightgrey;
    cursor: pointer;
  }

  &.checked {
    background-color: #fcfbd4;
    border-left: solid 3px #c3c055;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }

  &.right {
    background-color: #1fe3a11e;
    border-left: solid 3px ${green};
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }
  &.wrong {
    background-color: #ee16581e;
    border-left: solid 3px #ee1658;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }
  & i {
    font-size: 18px;
    line-height: 1;
  }
  & .fa-check {
    color: ${green};
  }
  & .fa-times {
    color: #ee1658;
  }
`;
