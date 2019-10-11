import styled from "styled-components";
import { white } from "@edulastic/colors";

const QuestionNumberLabel = styled.section`
  font-size: ${props => props.fontSize || props.theme.fontSize}px;
  font-weight: 700;
  margin-right: 6px;
  width: auto;
  word-break: normal;
`;

export default QuestionNumberLabel;
