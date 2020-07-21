import styled from "styled-components";

export const Text = styled.div`
  resize: none;
  border: none;
  display: flex;
  align-items: center;
  overflow: hidden;
  justify-content: space-between;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  img {
    max-height: ${({ maxHeight }) => maxHeight}px;
    max-width: ${({ maxWidth }) => maxWidth}px;
    width: auto;
  }
  ${({ showDragHandle, smallSize, correct, theme, showAnswer }) => `
    width: ${
      showDragHandle
        ? smallSize
          ? "calc(100% - 30px)"
          : "calc(100% - 32px)"
        : showAnswer
        ? smallSize
          ? "calc(100% - 30px)"
          : "calc(100% - 32px)"
        : "100%"
    };
    padding: ${smallSize ? "2px 5px" : "2px 15px"};
    padding-right:${correct === undefined ? "" : "30px"};
    border-color: ${
      correct !== undefined
        ? correct
          ? theme.widgets.orderList.correctContainerBgColor
          : theme.widgets.orderList.incorrectContainerBgColor
        : theme.widgets.orderList.textBorderColor
    };
  `}
`;
