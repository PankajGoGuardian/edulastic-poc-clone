import React from "react";
import styled, { css } from "styled-components";
import { Tooltip } from "../../../../../../../../common/utils/helpers";

export const Button = ({ label, title, ...rest }) => (
  <Tooltip placement="top" title={title}>
    <ButtonWrapper {...rest}>{label}</ButtonWrapper>
  </Tooltip>
);

const activatedStyle = css`
  background: ${props => props.theme.mathEssayInput.inputLineButtonBgHoverActiveClassColor};
  color: ${props => props.theme.mathEssayInput.inputLineButtonHoverActiveClassColor};
`;
const ButtonWrapper = styled.div`
  width: 20px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  font-size: ${props => props.theme.mathEssayInput.inputLineButtonFontSize};
  border: 1px solid ${props => props.theme.mathEssayInput.inputLineButtonBorderColor};
  border-radius: 4px;
  margin-right: 6px;
  cursor: pointer;
  ${({ activated }) => activated && activatedStyle}
  :hover {
    ${activatedStyle}
  }

  :last-child {
    margin-right: 0;
  }
`;
