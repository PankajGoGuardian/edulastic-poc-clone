import styled from "styled-components";
import { extraDesktopWidthMax } from "@edulastic/colors";

export const PointsText = styled.span`
  font-size: ${props => props.theme.smallFontSize};
  text-transform: uppercase;

  @media (min-width: ${extraDesktopWidthMax}) {
    font-size: ${props => props.theme.widgetOptions.labelFontSize};
  }
`;
