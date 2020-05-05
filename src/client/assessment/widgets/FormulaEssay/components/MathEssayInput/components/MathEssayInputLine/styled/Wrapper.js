import styled, { css } from "styled-components";
import { greyThemeLighter } from "@edulastic/colors";

export const Wrapper = styled.div`
  border: 1px solid ${props => props.theme.mathEssayInput.inputWrapperBorderColor};
  background: ${greyThemeLighter};
  position: relative;

  ${props =>
    props.active &&
    css`
      border-color: ${props.theme.mathEssayInput.inputWrapperActiveClassBorderColor};
      border-left-color: ${props.theme.mathEssayInput.inputWrapperActiveClassBorderLeftColor};
      border-right-color: ${props.theme.mathEssayInput.inputWrapperActiveClassBorderRightColor};
    `}
`;
