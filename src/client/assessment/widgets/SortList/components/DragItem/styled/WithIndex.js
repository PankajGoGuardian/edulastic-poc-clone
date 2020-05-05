import styled from "styled-components";
import { title } from "@edulastic/colors";

export const WithIndex = styled.div`
  font-size: ${props => props.theme.widgets.sortList.dragItemWithIndexFontSize};
  font-weight: ${props => props.theme.widgets.sortList.dragItemWithIndexFontWeight};
  width: 40px;
  margin-right: 8px;
  background: ${({ checkStyle, correct, theme }) =>
    checkStyle
      ? correct
        ? `${theme.widgets.sortList.dragItemIndexBoxValidBgColor}`
        : `${theme.widgets.sortList.dragItemIndexBoxNotValidBgColor}`
      : "none"};
  color: ${title};
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: stretch;
`;
