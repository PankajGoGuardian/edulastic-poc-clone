import styled from "styled-components";

export const AnswerBox = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
  cursor: pointer;
  border-radius: 4px;
  background: ${({ theme, checked, correct }) => {
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
