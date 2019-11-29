import styled from "styled-components";

export const Text = styled.div`
  width: ${({ showDragHandle, smallSize }) =>
    showDragHandle ? (smallSize ? "calc(100% - 30px)" : "calc(100% - 50px)") : "100%"};

  background: ${({ checkStyle, correct, theme }) =>
    checkStyle
      ? correct
        ? `${theme.widgets.sortList.dragItemCorrectTextBgColor}`
        : `${theme.widgets.sortList.dragItemIncorrectTextBgColor}`
      : "none"};
  display: flex;
  position: relative;
  align-items: center;
  .math-formula-display {
    padding: 4px;
    padding-right: ${({ checkStyle }) => (checkStyle ? 40 : 4)}px;
  }
`;
