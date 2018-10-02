import styled from 'styled-components';
import { white } from '@edulastic/colors';

const Paper = styled.div`
  border-radius: 10px;
  background: ${white};
  padding: 40px;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);

  @media (max-width: 480px) {
    padding: 25px;
  }
`;

export default Paper;
