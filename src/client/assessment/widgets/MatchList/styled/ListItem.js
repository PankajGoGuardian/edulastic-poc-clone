import styled from 'styled-components';
import { dashBorderColor, mainTextColor } from '@edulastic/colors';

export const ListItem = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  height: ${({ smallSize }) => (smallSize ? 26 : 40)}px;
  border-radius: 4px;
  font-weight: 600;
  color: ${mainTextColor};
  border: 1px solid ${dashBorderColor};
`;
