import styled from "styled-components";

export const Index = styled.div`
  height: auto;
  width: 32px;
  display: ${({ preview }) => (preview ? "flex" : "none")};
  align-self: stretch;
  align-items: center;
  flex-shrink: 0;
  justify-content: center;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  background: ${({ correct, correctAnswer, theme }) =>
    correctAnswer
      ? theme.checkbox.noAnswerIconColor
      : correct
      ? theme.checkbox.rightIconColor
      : theme.checkbox.wrongIconColor};
  color: ${props => props.theme.widgets.matchList.indexColor};
  font-weight: ${props => props.theme.widgets.matchList.indexFontWeight};
  font-size: ${props => props.theme.widgets.matchList.indexFontSize};
`;
