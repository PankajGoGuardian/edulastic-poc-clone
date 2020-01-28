import styled from "styled-components";
import { Layout, Button } from "antd";
import { themeColor, fadedBlack, white, mediumDesktopExactWidth, extraDesktopWidthMax } from "@edulastic/colors";

export const Wrapper = styled(Layout)`
  width: 100%;
`;

export const Title = styled.div`
  font-weight: 700;
  font-size: 16px;
  padding: ${({ padding }) => padding};
  margin: ${({ margin }) => margin};
`;

export const Description = styled.p`
  font-size: 16px;
  color: ${fadedBlack};
`;

export const Container = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-evenly;
`;

export const ActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-evenly;
  height: 110px;
  margin-right: 20px;
`;

export const ThemeButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  background: ${({ inverse }) => (inverse ? themeColor : white)};
  border-color: ${themeColor};
  color: ${({ inverse }) => (inverse ? white : themeColor)};
  width: ${({ width }) => width || "200px"};
  height: 40px;
  padding: 8px;
  font-size: 11px;
  font-weight: 600;

  &:hover,
  &:focus {
    color: ${white};
    background: ${themeColor};
    border-color: ${themeColor};
  }
`;
