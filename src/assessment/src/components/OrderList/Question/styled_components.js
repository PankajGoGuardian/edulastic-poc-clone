import styled from 'styled-components';
import TextareaAutosize from 'react-autosize-textarea';
import { grey } from '@edulastic/colors';

export const StyledTextarea = styled(TextareaAutosize)`
  resize: none;
  width: 100%;
  min-height: 130px;
  border-radius: 5px;
  padding: 20px 50px;
  box-sizing: border-box;
  border: 1px solid ${grey};
`;

export default StyledTextarea;
