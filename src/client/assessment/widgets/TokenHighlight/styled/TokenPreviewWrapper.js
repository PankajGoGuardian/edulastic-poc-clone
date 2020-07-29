import styled, { css } from "styled-components";
import { greyThemeLight, greyThemeLighter } from "@edulastic/colors";

const borderStyle = css`
  border-radius: 2px;
  padding: 8px 14px;
  border: 1px solid ${greyThemeLight};
  background: ${greyThemeLighter};
`;

export const TokenPreviewWrapper = styled.div`
  width: 100%;
  ${({ showBorder }) => showBorder && borderStyle}
`;
