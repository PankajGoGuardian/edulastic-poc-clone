import styled from 'styled-components';
import { dashBorderColorOpacity } from '@edulastic/colors';

export const SideBar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${dashBorderColorOpacity};
  width: 117px;
  padding: 22px 7px;

  & > * {
    margin-bottom: 10px;
  }
  & > *:last-child {
    margin-bottom: 0;
  }
`;
