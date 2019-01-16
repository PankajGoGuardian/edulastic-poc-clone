import styled from 'styled-components';
import { IconCaretDown } from '@edulastic/icons';

const Icon = styled(IconCaretDown)`
   {
    position: absolute;
    left: 11rem;
    top: 0.9rem;
    fill: #12a6e8;
    width: 11px !important;
    height: 11px !important;
  }
  @media (max-width: 900px) {
    left: 10.5rem;
    top: 1.17rem;
  }
  @media (max-width: 768px) {
  }
`;

export default Icon;
