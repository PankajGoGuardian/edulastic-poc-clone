import styled from 'styled-components';
import { mobileWidth } from '@edulastic/colors';

import { mainBgColor } from '../../utils/css';

export const Container = styled.div`
  padding: 25px 40px;
  background: ${mainBgColor};

  @media (max-width: ${mobileWidth}) {
    padding: 10px 25px;
  }
`;

export default Container;
