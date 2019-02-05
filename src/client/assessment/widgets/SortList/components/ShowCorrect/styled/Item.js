import styled from 'styled-components';
import { white } from '@edulastic/colors';
import { FlexRow } from './FlexRow';

export const Item = styled(FlexRow)`
  align-items: stretch;
  height: 40px;
  border-radius: 4px;
  background-color: ${white};
  margin-right: 10px;
  font-weight: 600;
  margin-top: 14px;
`;
