import styled from "styled-components";
import { white } from "@edulastic/colors";

export const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: stretch;
  cursor: pointer;
  background: ${({ checkStyle, correct, theme, isPrintPreview }) => {
    if (isPrintPreview) return white;
    return checkStyle
      ? correct
        ? `${theme.widgets.sortList.dragItemCorrectTextBgColor}`
        : `${theme.widgets.sortList.dragItemIncorrectTextBgColor}`
      : theme.widgets.sortList.dragItemContainerBgColor;
  }};
`;
