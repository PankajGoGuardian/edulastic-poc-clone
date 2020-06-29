import styled from "styled-components";

export const IndexBox = styled.div`
  width: 40px;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  flex-shrink: 0;
  ${({ theme, checked, correct }) => `
    background: ${
      !checked && !correct
        ? theme.widgets.clozeText.indexBoxNoAnswerBgColor
        : checked && !correct
        ? theme.widgets.clozeText.indexBoxIncorrectBgColor
        : theme.widgets.clozeText.indexBoxCorrectBgColor
    };
    color: ${theme.widgets.clozeText.indexBoxColor};
    font-size: ${theme.widgets.clozeText.indexBoxFontSize};
    font-weight: ${theme.widgets.clozeText.indexBoxFontWeight};
  `}
`;
