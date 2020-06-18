import styled from "styled-components";
import { greyThemeLight, white } from "@edulastic/colors";

export const AnswerBox = styled.div`
  display: inline-flex;
  vertical-align: middle;
  cursor: pointer;
  margin: 0px 4px 4px;
  border-radius: 4px;
  border: 1px solid ${greyThemeLight};
  background: ${({ theme, checked, correct, isPrintPreview }) => {
    if (isPrintPreview) return white;
    if (checked === undefined && correct === undefined) {
      return theme.widgets.clozeText.boxBgColor;
    }
    if (checked === false) {
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
