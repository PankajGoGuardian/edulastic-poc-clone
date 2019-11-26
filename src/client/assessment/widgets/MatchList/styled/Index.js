import styled from "styled-components";

export const Index = styled.div`
  height: auto;
  width: 40px;
  display: ${({ preview }) => (preview ? "flex" : "none")};
  align-self: stretch;
  align-items: center;
  justify-content: center;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  background: ${({ correct, theme }) =>
    correct ? theme.widgets.matchList.indexCorrectBgColor : theme.widgets.matchList.indexIncorrectBgColor};
  color: ${props => props.theme.widgets.matchList.indexColor};
  font-weight: ${props => props.theme.widgets.matchList.indexFontWeight};
  font-size: ${props => props.theme.widgets.matchList.indexFontSize};
`;
