import styled from 'styled-components';
import { dashBorderColor } from '@edulastic/colors';
import { FlexContainer } from '@edulastic/common';
import { QlBlocks } from './QlBlocks';

export const FlexCon = styled(FlexContainer)`
  border-radius: 4px;
  & > *:first-child {
    border-top-left-radius: 4px !important;
    border-top-right-radius: 4px !important;
  }
  & > *:last-child {
    border-top: 1px solid ${dashBorderColor}!important;
    border-bottom-left-radius: 4px !important;
    border-bottom-right-radius: 4px !important;
  }
  border: 1px solid ${dashBorderColor};
  & > ${QlBlocks} {
    padding: ${({ padding }) => (padding !== undefined ? '3px 5px' : padding)}!important;
  }
  & > button {
    &:focus {
      outline: none !important;
    }
    border: none !important;
    padding: 3px 5px !important;
    svg {
      height: auto !important;
    }
    .ql-stroke {
      fill: none;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-width: 2;
    }
    .ql-stroke.ql-thin {
      stroke-width: 1;
    }
  }
`;
