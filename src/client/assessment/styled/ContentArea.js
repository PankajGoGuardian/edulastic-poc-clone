import styled from "styled-components";
import { desktopWidth } from "@edulastic/colors";

export const ContentArea = styled.div`
  width: 100%;
  padding-left: ${props => (props.isSidebarCollapsed ? "235px" : "320px")};

  @media (max-width: ${desktopWidth}) {
    max-width: 100%;
  }
`;
