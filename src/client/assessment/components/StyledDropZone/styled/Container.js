import styled from "styled-components";
import { FlexContainer } from "@edulastic/common";
import { lightBlue7 } from "@edulastic/colors";

export const Container = styled(FlexContainer)`
  min-height: 200px;
  width: 100%;
  border-radius: 2px;
  border: ${({ theme, isDragActive }) =>
    isDragActive
      ? `1px solid ${theme.styledDropZone.containerDragActiveColor}`
      : `1px dashed ${theme.styledDropZone.containerBorderColor}`};
  background: ${({ theme }) => theme.styledDropZone.containerBackground};
  &:focus {
    border: 1px solid ${lightBlue7};
  }
  &:active {
    border: 1px solid ${lightBlue7};
  }
`;
