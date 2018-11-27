import styled from 'styled-components';
import { greenDark } from '@edulastic/colors';

const Subtitle = styled.div`
  font-size: ${({ fontSize }) => fontSize || 14}px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.36;
  letter-spacing: 0.3px;
  text-align: left;
  color: ${({ color }) => color || greenDark};
  padding: ${({ padding }) => padding || '30px 0 16px 0'};
`;

export default Subtitle;
