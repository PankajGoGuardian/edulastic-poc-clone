import styled from "styled-components";
import { Button } from "antd";
import { themeColor, white } from "@edulastic/colors";

export const ThemeButton = styled(Button)`
  background: ${themeColor};
  border-color: ${themeColor};
  &:hover,
  &:focus {
    color: ${white};
    background: ${themeColor};
    border-color: ${themeColor};
  }
`;
