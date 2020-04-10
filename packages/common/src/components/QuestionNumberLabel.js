import styled from "styled-components";
import { white } from "@edulastic/colors";

const QuestionNumberLabel = styled.section`
  background: ${({ theme }) => theme.questionLabelColor};
  color: ${white};
  font-size: ${({ fontSize, theme }) => fontSize || (theme.fontSize && `${theme.fontSize}px`) || `1rem`};
  font-weight: 700;
  margin-right: 1rem;
  width: auto;
  word-break: normal;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: ${({ width }) => width || 35}px;
  min-height: ${({ height }) => height || 35}px;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

export default QuestionNumberLabel;
