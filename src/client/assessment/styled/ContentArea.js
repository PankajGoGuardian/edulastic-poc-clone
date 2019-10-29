import styled from "styled-components";
import { smallDesktopWidth, extraDesktopWidthMax } from "@edulastic/colors";

export const ContentArea = styled.div`
  width: 100%;
  padding-left: 235px;

  @media (min-width: ${extraDesktopWidthMax}) {
    padding-left: 325px;
  }

  @media (max-width: ${smallDesktopWidth}) {
    max-width: 100%;
    padding-left: 0;
  }
`;
