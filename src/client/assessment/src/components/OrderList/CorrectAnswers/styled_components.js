import styled from 'styled-components';
import { lightGrey, tabletWidth } from '@edulastic/colors';

import { TextField } from '@edulastic/common';

export const Header = styled.div`
  padding: 10px;
  background: ${lightGrey};
  display: inline-flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: ${tabletWidth}) {
    width: 100%;
  }
`;

export const PointField = styled(TextField)`
  width: 100px;
  padding: 0 0 0 40px;
  margin-right: 25px;
`;

export const HeaderInner = styled.div`
  height: 50px;
`;
