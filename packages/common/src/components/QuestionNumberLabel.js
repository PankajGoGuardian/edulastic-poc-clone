import styled from "styled-components";
import { white } from "@edulastic/colors";

const QuestionNumberLabel = styled.div`
  font-size: ${props => props.fontSize || props.theme.fontSize}px;
  font-weight: 700;
  margin-right: 6px;
`;

export default QuestionNumberLabel;
