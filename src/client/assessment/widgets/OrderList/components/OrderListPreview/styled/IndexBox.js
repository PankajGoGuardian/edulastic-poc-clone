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
        ? theme.checkbox.noAnswerIconColor
        : correct
        ? theme.checkbox.rightIconColor
        : theme.checkbox.wrongIconColor
    };
    width: ${smallSize ? 30 : 32}px;
  `}
`;
