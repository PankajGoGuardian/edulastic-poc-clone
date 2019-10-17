import styled from "styled-components";

export const ListItem = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  word-break: break-word;
  min-height: ${({ smallSize }) => (smallSize ? 26 : 40)}px;
  border-radius: 4px;
  font-weight: ${props => props.theme.widgets.matchList.listItemFontWeight};
  color: ${props => props.theme.widgets.matchList.listItemColor};
  border: 1px solid ${props => props.theme.widgets.matchList.listItemBorderColor};
  padding: 8px 12px;

  & .katex .base {
    white-space: normal;
    width: fit-content;
  }
`;
