import styled from "styled-components";

export const CorTitle = styled.div`
  font-weight: ${props => props.theme.widgets.matchList.corTitleFontWeight};
  min-height: 40px;
  border-radius: 4px;
  width: calc(50% - 50px);
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: #fff;
  margin-right: 44px;
  word-break: break-word;
  padding: 8px 12px;

  & .katex .base {
    white-space: normal;
    width: fit-content;
  }
`;
