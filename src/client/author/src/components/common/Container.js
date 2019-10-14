import styled from "styled-components";
import { mobileWidth, mainBgColor, mediumDesktopWidth } from "@edulastic/colors";

export const Container = styled.div`
  padding: 20px 30px;
  background: ${mainBgColor};
  height: calc(100vh - 96px);

  @media (max-width: ${mediumDesktopWidth}) {
    height: calc(100vh - 60px);
  }
  @media (max-width: ${mobileWidth}) {
    height: initial;
    padding: 10px 25px;
  }
`;

export default Container;
