import styled, { css } from "styled-components";
import { themeColor } from "@edulastic/colors";

const sharedBtnStyle = css`
  background-color: transparent;
  position: absolute;
  top: 48%;
  z-index: 1;
  font-size: 40px;
  cursor: pointer;
  color: #000;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  @media (min-width: 1025px) {
    width: 60px;
    height: 60px;
    &:hover {
      background-color: ${themeColor};
      color: #fff;
    }
  }
`;
const BackArrow = styled.nav`
  ${sharedBtnStyle}
  left: 10px;
`;

const NextArrow = styled.nav`
  ${sharedBtnStyle}
  right: 10px;
`;

export default { NextArrow, BackArrow };
