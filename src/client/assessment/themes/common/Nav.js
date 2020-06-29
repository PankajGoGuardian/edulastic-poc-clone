import styled, { css } from "styled-components";
import { themeColor, smallDesktopWidth } from "@edulastic/colors";

const sharedBtnStyle = css`
  background-color: transparent;
  position: ${({ position }) => position || "fixed"};
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
  font-size: 26px;
  cursor: pointer;
  border-radius: ${props => props.borderRadius || "50%"};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #878a91;

  @media (min-width: 1025px) {
    width: ${props => props.width || "40"}px;
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
  left: ${props => props.left || "4px"};
  width: ${props => props.width || "40"}px;
`;

const NextArrow = styled.nav`
  ${sharedBtnStyle}
  right: ${props => props.right || "4px"};
  width: ${props => props.width || "40"}px;
`;

export default { NextArrow, BackArrow };
