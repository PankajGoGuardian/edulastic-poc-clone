import styled, { css } from "styled-components";
import { white } from "@edulastic/colors";

const boxBgColor = css`
  background: ${({ theme, checked, correct, isPrintPreview }) => {
    if (isPrintPreview) return white;
    if (checked === undefined && correct === undefined) {
      return theme.checkbox.boxBgColor;
    }
    if (checked === false) {
      return theme.checkbox.noAnswerBgColor;
    }
    if (checked && !correct) {
      return theme.checkbox.wrongBgColor;
    }
    if (checked && correct) {
      return theme.checkbox.rightBgColor;
    }
  }};
`;

const indexBoxBgColor = css`
  background: ${({ theme, checked, correct, isPrintPreview }) => {
    if (isPrintPreview) return white;
    if (checked === undefined && correct === undefined) {
      return theme.checkbox.boxBgColor;
    }
    if (checked === false) {
      return theme.checkbox.noAnswerIconColor;
    }
    if (checked && !correct) {
      return theme.checkbox.wrongIconColor;
    }
    if (checked && correct) {
      return theme.checkbox.rightIconColor;
    }
  }};
`;

export const CheckBox = styled.div`
  display: flex;
  border-radius: 4px;
  ${boxBgColor};

  .index {
    width: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    align-self: stretch;
    flex-shrink: 0;
    color: ${white};
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    font-weight: ${({ theme }) => theme.semiBold};
    font-size: ${({ theme }) => theme.titleSectionFontSize};
    ${indexBoxBgColor};
  }

  .text {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-left: 16px;
  }
`;
