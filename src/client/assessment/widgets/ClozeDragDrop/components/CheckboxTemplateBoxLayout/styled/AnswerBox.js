import styled from "styled-components";
import { white } from "@edulastic/colors";

export const AnswerBox = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
  cursor: pointer;
  border-radius: 2px;
  width: 100%;
  max-height: ${({ maxHeight }) => maxHeight || ""};
  background: ${({ theme, checked, correct, isPrintPreview }) => {
    if (isPrintPreview) return white;
    if (!checked && !correct) {
      return theme.widgets.clozeText.boxNoAnswerBgColor;
    }
    if (checked && !correct) {
      return theme.widgets.clozeText.boxWrongBgColor;
    }
    if (checked && correct) {
      return theme.widgets.clozeText.boxBgCorrectColor;
    }
  }};
`;
