import styled from "styled-components";
import { white } from "@edulastic/colors";

export const IndexBox = styled.div`
  color: ${white};
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  ${({ correct, smallSize, theme, showAnswer }) => `
    font-size: ${theme.widgets.orderList.indexFontSize};
    font-weight: ${theme.widgets.orderList.indexFontWeight};
    background: ${
      showAnswer
        ? theme.widgets.orderList.indexColor
        : correct
        ? theme.widgets.orderList.iconCheckColor
        : theme.widgets.orderList.iconCloseColor
    };
    width: ${smallSize ? 30 : 40}px;
  `}
`;
