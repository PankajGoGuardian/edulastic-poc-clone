import styled from "styled-components";

export const IndexBox = styled.div`
  width: 32px;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  ${({ theme, checked, correct }) => `
    background: ${
      checked === undefined && correct === undefined
        ? theme.checkbox.noAnswerIconColor
        : checked === false
        ? theme.checkbox.noAnswerIconColor
        : checked && !correct
        ? theme.checkbox.wrongIconColor
        : theme.checkbox.rightIconColor
    };
    color: ${theme.widgets.clozeText.indexBoxColor};
    font-size: ${theme.widgets.clozeText.indexBoxFontSize};
    font-weight: ${theme.widgets.clozeText.indexBoxFontWeight};
  `}
`;
