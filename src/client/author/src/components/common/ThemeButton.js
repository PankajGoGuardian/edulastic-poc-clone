import styled from "styled-components";
import { Button } from "antd";
import { themeColor, white } from "@edulastic/colors";

export const ThemeButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  background: ${themeColor};
  border-color: ${themeColor};
  &:hover,
  &:focus {
    color: ${white};
    background: ${themeColor};
    border-color: ${themeColor};
  }
`;
