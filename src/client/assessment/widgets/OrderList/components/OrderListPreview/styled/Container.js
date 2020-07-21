import styled from "styled-components";
import { white } from "@edulastic/colors";

export const Container = styled.div`
  display: flex;
  margin-bottom: 5px;
  cursor: pointer;
  align-items: stretch;
  border-radius: 5px;
  position: relative;
  ${({ columns, correct, theme, isPrintPreview }) => `
      width: ${columns === 1 ? `${100 / columns}%` : "auto"};
      flex: ${columns === 1 ? null : 1};
      margin-right: ${columns === 1 ? null : "16px"};
      background: ${
        isPrintPreview
          ? white
          : correct !== undefined
          ? correct
            ? theme.checkbox.rightBgColor
            : theme.checkbox.wrongBgColor
          : theme.widgets.orderList.containerBgColor
      }
  `}
`;
