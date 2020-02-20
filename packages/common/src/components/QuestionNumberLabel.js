import styled from "styled-components";
import { white } from "@edulastic/colors";

const QuestionNumberLabel = styled.section`
  background: ${({ theme }) => "#8ed863" || theme.themeColor};
  color: ${white};
  font-size: ${props => `1rem` || props.fontSize || props.theme.fontSize + "px"};
  font-weight: 700;
  margin-right: 1rem;
  width: auto;
  word-break: normal;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 35px;
  min-height: 35px;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

export default QuestionNumberLabel;
