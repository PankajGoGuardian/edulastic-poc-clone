import styled from 'styled-components';
import { grey } from '@edulastic/colors';

export const Text = styled.div`
  resize: none;
  width: 100%;
  border: none;
  height: 100%;
  border: 1px solid ${grey};
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  min-height: 50px;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
