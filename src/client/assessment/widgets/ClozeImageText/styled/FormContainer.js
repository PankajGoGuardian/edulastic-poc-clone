import styled from "styled-components";
import { extraDesktopWidth, largeDesktopWidth } from "@edulastic/colors";
import { FlexContainer } from "./FlexContainer";

export const FormContainer = styled(FlexContainer)`
  background: ${props => props.theme.widgets.clozeImageText.formContainerBgColor};
  font-size: ${props => props.theme.widgets.clozeImageText.formContainerFontSize};
  font-weight: ${props => props.theme.widgets.clozeImageText.formContainerFontWeight};
  color: ${props => props.theme.widgets.clozeImageText.formContainerColor};
  border-bottom: 1px solid ${props => props.theme.widgets.clozeImageText.formContainerBorderColor};
  border-radius: 10px 10px 0px 0px;
  flex-wrap: wrap;
  justify-content: flex-start;

  .size-controls,
  .position-controls {
    display: flex;
    padding: 4px 0px;
  }
`;
