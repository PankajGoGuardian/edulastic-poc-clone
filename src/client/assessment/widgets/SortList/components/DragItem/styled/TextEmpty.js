import styled from "styled-components";

export const TextEmpty = styled.div`
  resize: none;
  width: ${({ showDragHandle, smallSize }) =>
    showDragHandle ? (smallSize ? "calc(100% - 30px)" : "calc(100% - 50px)") : "100%"};
  border-radius: 4px;
  min-height: ${({ smallSize }) => (smallSize ? 31 : 56)}px;
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  flex-grow: 1;
  font-size: ${({ smallSize, theme }) =>
    smallSize
      ? theme.widgets.sortList.dragItemTextEmptySmallFontSize
      : theme.widgets.sortList.dragItemTextEmptyFontSize};
`;
