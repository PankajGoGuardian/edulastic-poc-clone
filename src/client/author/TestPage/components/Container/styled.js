import styled from "styled-components";
import { mediumDesktopWidth } from "@edulastic/colors";

export const Content = styled.div`
  width: 100%;
  height: calc(100vh - 96px);
  left: 0;
  right: 0;

  @media (max-width: ${mediumDesktopWidth}) {
    min-height: calc(100vh - 60px);
  }
`;
