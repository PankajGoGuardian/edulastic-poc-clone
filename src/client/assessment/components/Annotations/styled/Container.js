import styled from "styled-components";
import { greyThemeLight, greyThemeLighter } from "@edulastic/colors";
import { FlexContainer } from "@edulastic/common";

export const Container = styled(FlexContainer)`
  border-radius: 4px;
  border: ${({ noBorder }) => `${noBorder ? 0 : 1}px solid ${greyThemeLight}`};
  background: ${({ isRnd }) => (isRnd ? "transparent" : greyThemeLighter)};
  height: 100%;
  overflow: hidden;
  align-items: flex-start;
  justify-content: flex-start;

  .fr-box {
    width: 100%;
  }
  .fr-view {
    overflow: hidden;
    width: 100%;
    min-height: 40px;
    padding: 8px 15px;
    text-align: left;
  }

  .drag-ans.wrap-text {
    max-width: 100%;
  }
`;
