import styled from 'styled-components';
import { textColor, grey } from '@edulastic/colors';

export const CorrectAnswerItem = styled.div`
  width: calc(100% - 40px);
  display: flex;
  align-items: stretch;
  margin-bottom: 10px;
  cursor: pointer;
  background: ${grey};
  margin-left: 40px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  border-left: 2px solid ${textColor};
`;
