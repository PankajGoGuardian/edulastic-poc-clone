import styled from "styled-components";
import {
  themeColor,
  themeLightGrayBgColor,
  white,
  mediumDesktopExactWidth,
  extraDesktopWidthMax
} from "@edulastic/colors";

export const Title = styled.h1`
  color: white;
  font-size: 24px;
  font-weight: bold;
  margin: 0;
  padding: 0;
`;

export const HeaderWrapper = styled.div`
  background: ${({ theme }) => theme.headerBgColor || themeColor};
  height: ${({ theme }) => theme.HeaderHeight.md}px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 30px;

  @media (min-width: ${mediumDesktopExactWidth}) {
    height: ${({ theme }) => theme.HeaderHeight.md}px;
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    height: ${({ theme }) => theme.HeaderHeight.xl}px;
  }
`;

export const ActionBtnWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 415px;
`;

export const HeaderActionBtn = styled.button`
  width: ${({ width }) => width};
  height: 42px;
  color: ${themeColor};
  background: ${white};
  border: none;
  outline: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: ${themeLightGrayBgColor};
  }
`;
