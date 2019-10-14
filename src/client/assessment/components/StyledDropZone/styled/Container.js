import styled from "styled-components";
import { FlexContainer } from "@edulastic/common";
import { lightBlue7 } from "@edulastic/colors";

export const Container = styled(FlexContainer)`
  height: 616px;
  align-items: ${({ style }) => (!style ? "normal" : style.alignItems)};
  justify-content: ${({ style }) => (!style ? "flex-start" : style.justifyContent)};
  width: 100%;
  border: ${({ theme, isDragActive }) =>
    isDragActive
      ? `2px solid ${theme.styledDropZone.containerDragActiveColor}`
      : `1px solid ${theme.styledDropZone.containerColor}`};
  &:focus {
    border: 1px solid ${lightBlue7};
  }
  &:active {
    border: 1px solid ${lightBlue7};
  }
`;
