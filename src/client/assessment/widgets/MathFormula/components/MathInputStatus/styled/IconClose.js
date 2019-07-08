import styled from "styled-components";
import { IconClose as Icon } from "@edulastic/icons";

export const IconClose = styled(Icon)`
  width: 12px;
  height: 12px;
  fill: ${props => props.theme.widgets.mathFormula.iconCloseColor};
  :hover {
    fill: ${props => props.theme.widgets.mathFormula.iconCloseColor};
  }
`;
