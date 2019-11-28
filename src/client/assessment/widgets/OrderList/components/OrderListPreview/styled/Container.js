import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  margin-bottom: 15px;
  cursor: pointer;
  align-items: stretch;
  border-radius: 5px;
  position: relative;
  ${({ columns, correct, theme }) => `
      width: ${columns === 1 ? `${100 / columns}%` : "auto"};
      flex: ${columns === 1 ? null : 1};
      margin-right: ${columns === 1 ? null : "16px"};
      background: ${
        correct !== undefined
          ? correct
            ? theme.widgets.orderList.correctContainerBgColor
            : theme.widgets.orderList.incorrectContainerBgColor
          : theme.widgets.orderList.containerBgColor
      }
  `}
`;
