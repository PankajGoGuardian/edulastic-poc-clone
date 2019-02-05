import styled from 'styled-components';
import { FlexContainer } from '@edulastic/common';
import { dashBorderColor, mainBlueColor } from '@edulastic/colors';

export const Container = styled(FlexContainer)`
  height: 616px;
  width: 100%;
  border: ${({ isDragActive }) =>
    (isDragActive ? `2px solid ${mainBlueColor}` : `1px solid ${dashBorderColor}`)};
`;
