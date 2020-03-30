import styled from "styled-components";
import { EDIT } from "../../../constants/constantsForQuestions";

export const ContentWrapper = styled.div`
  padding: ${props => (props.view === EDIT ? 15 : 0)}px;
  border: ${props =>
    props.view === EDIT ? `solid 1px ${props.theme.widgets.clozeText.questionContainerBorderColor}` : null};
  border-radius: ${props => (props.view === EDIT ? 10 : 0)}px;
  width: 100%;

  p {
    font-size: ${({ fontSize }) => fontSize || "auto"};
  }
`;
