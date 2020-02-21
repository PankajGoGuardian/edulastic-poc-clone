import styled from "styled-components";
import { smallDesktopWidth, mediumDesktopExactWidth, themeColor } from "@edulastic/colors";

const Header = styled.div`
  width: 100%;
  padding: 0 40px;
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

  @media (max-width: ${mediumDesktopExactWidth}) {
    padding: 0 30px;
  }
  @media (max-width: ${smallDesktopWidth}) {
    padding: 0 21px;
  }
  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
  }
`;

export default Header;
