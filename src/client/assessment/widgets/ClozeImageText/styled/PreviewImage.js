import styled from "styled-components";
import { black } from "@edulastic/colors";

export const PreivewImageWrapper = styled.div`
  position: relative;
  border: 1px dotted ${black};
  border-radius: 4px;
`;

export const PreviewImage = styled.img`
  height: ${({ height, maxHeight }) => (!maxHeight ? "100%" : height ? `${height}px` : "auto")};
  width: ${({ width, maxWidth }) => (!maxWidth ? "100%" : width < 700 ? `${width}px` : maxWidth)};
  user-select: none;
  pointer-events: none;
  max-width: unset !important;
`;
