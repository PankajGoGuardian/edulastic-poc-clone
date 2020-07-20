import styled from "styled-components";
import { white, greyishBorder } from "@edulastic/colors";

export const AnswersWrapper = styled.div`
  padding-left: 20px;
  display: flex;

  .correct-answer-item {
    min-width: 140px;
    min-height: 32px;
    background: ${white};
    border-radius: 4px;
    border: 1px solid ${greyishBorder};
    margin-right: 5px;
    display: flex;
    align-items: center;

    .index {
      width: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      align-self: stretch;
      flex-shrink: 0;
      color: ${white};
      font-weight: ${({ theme }) => theme.semiBold};
      font-size: ${({ theme }) => theme.titleSectionFontSize};
      background: ${({ theme }) => theme.checkbox.noAnswerIconColor};
    }

    .text {
      padding-left: 8px;
    }
  }
`;
