import styled from 'styled-components';
import { Stimulus } from '@edulastic/common';

export const SmallStim = styled(Stimulus)`
  font-size: 14px;
  font-weight: ${({ bold }) => (bold ? 600 : 400)};
`;
