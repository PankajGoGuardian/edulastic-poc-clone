import styled from 'styled-components';
import { TextField } from '../common';
import { lightGrey } from '../../../utils/css';

export const Header = styled.div`
  padding: 10px;
  background: ${lightGrey};
  display: flex;
  align-items: center;
`;

export const PointField = styled(TextField)`
  width: 100px;
  padding: 0 0 0 40px;
  margin-right: 25px;
`;
