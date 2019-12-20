import styled from "styled-components";

export const Text = styled.div`
  resize: none;
  border: none;
  display: flex;
  align-items: center;
  overflow: hidden;
  justify-content: space-between;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  ${({ showDragHandle, smallSize, styleType, correct, theme, showAnswer }) => `
    width: ${
      showDragHandle
        ? smallSize
          ? "calc(100% - 30px)"
          : "calc(100% - 40px)"
        : showAnswer
        ? smallSize
          ? "calc(100% - 30px)"
          : "calc(100% - 40px)"
        : "100%"
    };
    border: ${styleType === "button" ? `1px solid` : "none"};
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
