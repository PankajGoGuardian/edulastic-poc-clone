import styled from "styled-components";
import { CorrectAnswersContainer } from "@edulastic/common";

export const StyledCorrectAnswersContainer = styled(CorrectAnswersContainer).attrs({
  minHeight: "auto",
  minWidth: "200px"
})`
  margin: 20px auto;
  & > h3 {
    color: ${props => props.theme.widgets.matchList.dragItemColor};
  }
`;
