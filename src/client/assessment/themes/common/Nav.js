import styled, { css } from "styled-components";
import { themeColor } from "@edulastic/colors";

const sharedBtnStyle = css`
  background-color: transparent;
  position: fixed;
  top: 48%;
  z-index: 1;
  font-size: 40px;
  cursor: pointer;
  color: #000;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background-color: ${themeColor};
    color: #fff;
  }
`;
const BackArrow = styled.nav`
  ${sharedBtnStyle}
  left: 15px;
`;

const NextArrow = styled.nav`
  ${sharedBtnStyle}
  right: 15px;
`;

export default { NextArrow, BackArrow };
