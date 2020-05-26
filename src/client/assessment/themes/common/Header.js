import styled from "styled-components";
import { themeColor, largeDesktopWidth, extraDesktopWidthMax, tabletWidth } from "@edulastic/colors";

const Header = styled.div`
  width: 100%;
  padding: 0 21px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: ${themeColor};
  z-index: 50;

  @media (min-width: ${largeDesktopWidth}) {
    padding: 0 30px;
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    padding: 0 40px;
  }
  @media (max-width: ${tabletWidth}) {
    flex-direction: column;
    height: auto;
  }
`;

export default Header;
