import styled from "styled-components";
import { desktopWidth } from "@edulastic/colors";

export const ContentArea = styled.div`
  max-width: 76.7%;
  margin-left: auto;

  @media (max-width: ${desktopWidth}) {
    max-width: 100%;
  }
`;
