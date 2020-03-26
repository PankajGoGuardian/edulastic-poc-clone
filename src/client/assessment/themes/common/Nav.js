import styled, { css } from "styled-components";
import { themeColor, smallDesktopWidth } from "@edulastic/colors";

const sharedBtnStyle = css`
  background-color: transparent;
  position: ${({ position }) => position || "fixed"};
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
  font-size: 40px;
  cursor: pointer;
  color: #000;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (min-width: 1025px) {
    width: 40px;
    height: 40px;
    &:hover {
      background-color: ${themeColor};
      color: #fff;
    }
  }

  @media (max-width: ${smallDesktopWidth}) {
    width: 35px;
  }
`;
const BackArrow = styled.nav`
  ${sharedBtnStyle}
  left: 4px;
`;

const NextArrow = styled.nav`
  ${sharedBtnStyle}
  right: 4px;
`;

export default { NextArrow, BackArrow };
