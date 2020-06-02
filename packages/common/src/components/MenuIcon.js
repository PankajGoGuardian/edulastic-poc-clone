import styled from "styled-components";
import { IconMenuOpenClose } from "@edulastic/icons";
import { tabletWidth, greyThemeDark2 } from "@edulastic/colors";

export const MenuIcon = styled(IconMenuOpenClose)`
  display: none;
  fill: ${greyThemeDark2};
  width: 18px;
  pointer-events: all;

  @media (max-width: ${tabletWidth}) {
    display: block;
    position: absolute;
    left: 12px;
  }
`;
