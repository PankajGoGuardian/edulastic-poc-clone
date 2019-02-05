import styled from 'styled-components';
import { blue, white, black } from '@edulastic/colors';

export const QlBlocks = styled.button`
  display: block !important;
  width: 40px !important;
  height: 40px !important;
  background: ${({ active }) => (active ? blue : white)}!important;
  .ql-stroke.ql-fill,
  .ql-stroke.ql-thin,
  .ql-fill,
  .ql-thin {
    fill: ${({ active }) => (active ? white : black)}!important;
  }

  color: ${({ active }) => (active ? white : black)}!important;
  .ql-stroke {
    stroke: ${({ active }) => (active ? white : black)}!important;
  }
`;
