import styled from 'styled-components';
import { grey } from '@edulastic/colors';

export const Container = styled.div`
  border: 1px solid ${grey};
  padding: 25px;
  margin-bottom: 15px;

  :last-child {
    margin-bottom: 0;
  }
`;
