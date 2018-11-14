import styled from 'styled-components';

export const Pointer = styled.div`
  position: absolute;
  top: 0;
  width: 16px;
  left: 0;
  text-align: center;
  line-height: 0px;
  display: none;

  &.right {
    width: 16px;
    display: block;
    top: calc(50% - 8px);
    left: ${props => props.width + 1}px;
    transform: rotate(90deg);
  }
  &.left {
    left: -23px;
    display: block;
    top: calc(50% - 8px);
    transform: rotate(-90deg);
  }
  &.top {
    top: -23px;
    left: calc(50% - 8px);
    display: block;
  }
  &.bottom {
    display: block;
    left: calc(50% - 8px);
    bottom: -23px;
    transform: rotate(180deg);
  }
`;

export const Point = styled.div`
  background: #47525d;
  border-radius: 5px;
  width: 10px;
  height: 10px;
  margin: auto;
`;

export const Triangle = styled.div`
width: 0;
height: 0;
border-left: 8px solid transparent;
border-right: 8px solid transparent;
border-bottom: 8px solid black;
margin-top: 2px;
`;
