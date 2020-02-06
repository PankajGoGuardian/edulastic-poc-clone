import styled from "styled-components";
import { mediumDesktopExactWidth } from "@edulastic/colors";

export const PointsText = styled.span`
  font-size: ${props => props.theme.widgetOptions.labelFontSize};
  text-transform: uppercase;

  @media (max-width: ${mediumDesktopExactWidth}) {
    font-size: ${props => props.theme.smallFontSize};
  }
`;
