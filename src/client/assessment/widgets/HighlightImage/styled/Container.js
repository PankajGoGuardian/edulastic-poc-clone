import styled from 'styled-components';
import { FlexContainer } from '@edulastic/common';
import { dashBorderColorOpacity, dashBorderColor } from '@edulastic/colors';

export const Container = styled(FlexContainer)`
  min-height: 67px;
  width: ${({ width }) => width || '100%'};
  padding: 14px 28px 14px 14px;
  background: ${dashBorderColorOpacity};
  margin-top: 20px;
  border-bottom: 1px solid ${dashBorderColor};
`;
