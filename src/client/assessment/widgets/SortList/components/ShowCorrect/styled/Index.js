import styled from 'styled-components';
import { mainBlueColor, white } from '@edulastic/colors';
import { FlexRow } from './FlexRow';

export const Index = styled(FlexRow)`
  align-items: center;
  justify-content: center;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  width: 40px;
  height: 40px;
  color: ${white};
  background-color: ${mainBlueColor};
`;
