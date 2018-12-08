import styled from 'styled-components';

import { mainBgColor, dashBorderColor } from '@edulastic/colors';

const Toolbar = styled.div`
  display: flex;
  width: 100%;
  height: 38px;
  align-content: center;
  justify-content: space-between;
  align-items: stretch;
  background: ${mainBgColor};
  border: 1px solid ${dashBorderColor};
  border-radius: ${({ borderRadiusOnlyBottom, borderRadiusOnlyTop }) =>
    (borderRadiusOnlyBottom ? '0 0 4px 4px' : borderRadiusOnlyTop ? '4px 4px 0 0' : '4px')};
`;

export default Toolbar;
