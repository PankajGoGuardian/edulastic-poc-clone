import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: stretch;
  cursor: pointer;
  background: ${({ checkStyle, correct, theme }) =>
    checkStyle
      ? correct
        ? `${theme.widgets.sortList.dragItemCorrectTextBgColor}`
        : `${theme.widgets.sortList.dragItemIncorrectTextBgColor}`
      : theme.widgets.sortList.dragItemContainerBgColor};
`;
