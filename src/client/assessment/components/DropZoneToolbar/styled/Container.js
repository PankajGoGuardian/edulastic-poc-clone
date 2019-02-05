import styled from 'styled-components';
import { FlexContainer } from '@edulastic/common';
import { dashBorderColorOpacity } from '@edulastic/colors';

export const Container = styled(FlexContainer)`
  min-height: 67px;
  padding: 14px;
  background: ${dashBorderColorOpacity};
  margin-top: 20px;
`;
