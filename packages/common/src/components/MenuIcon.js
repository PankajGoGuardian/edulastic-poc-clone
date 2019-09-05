import styled from "styled-components";
import { IconMenuOpenClose } from "@edulastic/icons";
import { tabletWidth, white } from "@edulastic/colors";

export const MenuIcon = styled(IconMenuOpenClose)`
  display: none;
  fill: ${white};
  width: 18px;
  margin-right: 25px !important;
  pointer-events: all;

  @media (max-width: ${tabletWidth}) {
    display: block;
    margin-right: 15px !important;
  }
`;
