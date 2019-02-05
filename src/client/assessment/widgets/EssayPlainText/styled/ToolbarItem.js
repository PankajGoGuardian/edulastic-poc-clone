import styled from 'styled-components';
import { dashBorderColor, lightGrey } from '@edulastic/colors';
import { Item } from '../../../styled/Item';

export const ToolbarItem = styled(Item)`
  &:hover {
    cursor: pointer;
    background: ${dashBorderColor};
  }
  &:active {
    background: ${lightGrey};
  }
`;
