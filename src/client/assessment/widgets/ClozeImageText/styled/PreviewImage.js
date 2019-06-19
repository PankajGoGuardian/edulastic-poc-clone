import styled from "styled-components";
import { black } from "@edulastic/colors";

export const PreivewImage = styled.div`
  position: relative;
  border: 1px dotted ${black};
  border-radius: 4px;
  height: ${({ height, maxHeight }) => (!maxHeight ? "100%" : height ? `${height}px` : "auto")};
  width: ${({ width, maxWidth }) => (!maxWidth ? "100%" : width ? `${width}px` : maxWidth)};
  user-select: none;
  pointer-events: none;
  max-width: unset !important;
  background-size: ${({ height, width, maxWidth, maxHeight }) => `${width || maxWidth}px ${height || maxHeight}px`};
  background-repeat: no-repeat;
  background-image: url(${({ imageSrc }) => imageSrc || ""});
`;
