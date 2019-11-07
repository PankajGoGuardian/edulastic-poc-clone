import styled from "styled-components";
import { mobileWidth, extraDesktopWidthMax } from "@edulastic/colors";

const ContentWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: inherit;
  left: 0;
  right: 0;
  padding: 0px 30px 30px;
  overflow: visible;

  @media (max-width: ${mobileWidth}) {
    padding: 0px 25px;
  }
`;

export default ContentWrapper;
