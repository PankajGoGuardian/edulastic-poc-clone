import styled from "styled-components";
import { IconEdit as Icon } from "@edulastic/icons";

export const IconEdit = styled(Icon)`
  width: 10px;
  height: 10px;
  fill: ${props => props.theme.correctAnswers.iconPlusColor};
  margin-right: 10px;
  &:hover {
    fill: ${props => props.theme.correctAnswers.iconPlusColor};
  }
`;
