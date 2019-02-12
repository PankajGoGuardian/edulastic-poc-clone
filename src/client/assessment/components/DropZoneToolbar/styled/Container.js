import styled from 'styled-components';
import { FlexContainer } from '@edulastic/common';

export const Container = styled(FlexContainer)`
  min-height: 67px;
  padding: 14px;
  background: ${props => props.theme.dropZoneToolbar.containerBgColor};
  margin-top: 20px;
`;
