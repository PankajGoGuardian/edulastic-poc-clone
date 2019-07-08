import styled from "styled-components";
import { IconCheck as Icon } from "@edulastic/icons";

export const IconCheck = styled(Icon)`
  width: 12px;
  height: 12px;
  fill: ${props => props.theme.widgets.mathFormula.iconCheckColor};
  :hover {
    fill: ${props => props.theme.widgets.mathFormula.iconCheckColor};
  }
`;
