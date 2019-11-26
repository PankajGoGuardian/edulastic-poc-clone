import styled from "styled-components";

export const IndexBox = styled.div`
  width: 40px;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  ${({ theme }) => `
    background: ${theme.widgets.clozeImageDragDrop.indexBoxBgColor};
    color: ${theme.widgets.clozeImageDragDrop.indexBoxColor};
    font-size: ${theme.widgets.clozeImageDragDrop.indexBoxFontSize};
    font-weight: ${theme.widgets.clozeImageDragDrop.indexBoxFontWeight};
  `}
`;
