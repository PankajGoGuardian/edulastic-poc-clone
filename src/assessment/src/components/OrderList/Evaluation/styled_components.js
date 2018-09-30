import styled from 'styled-components';
import { lightGrey } from '@edulastic/colors';

import { TextField } from '@edulastic/common';

export const Header = styled.div`
  padding: 10px;
  background: ${lightGrey};
  display: inline-flex;
  align-items: center;
`;

export const PointField = styled(TextField)`
  width: 100px;
  padding: 0 0 0 40px;
  margin-right: 25px;
`;
