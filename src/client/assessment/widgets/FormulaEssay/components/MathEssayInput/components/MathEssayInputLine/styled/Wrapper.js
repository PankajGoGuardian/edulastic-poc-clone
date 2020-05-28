import styled, { css } from "styled-components";

export const Wrapper = styled.div`
  position: relative;
  min-height: 33px;

  ${props =>
    props.active &&
    css`
      border-color: ${props.theme.mathEssayInput.inputWrapperActiveClassBorderColor};
      border-left-color: ${props.theme.mathEssayInput.inputWrapperActiveClassBorderLeftColor};
      border-right-color: ${props.theme.mathEssayInput.inputWrapperActiveClassBorderRightColor};
    `}
`;
