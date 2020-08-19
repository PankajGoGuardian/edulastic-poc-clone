import styled from "styled-components";
import { FlexContainer } from "@edulastic/common";
import { greyishBorder } from "@edulastic/colors";

export const Item = styled(FlexContainer)`
  align-items: stretch;
  height: max-content;
  border-radius: 4px;
  margin-right: 10px;
  background-color: ${props => props.theme.widgets.sortList.correctAnswersItemBgColor};
  font-weight: ${props => props.theme.widgets.sortList.correctAnswersItemFontWeight};
  border: 1px solid ${greyishBorder};
  margin-top: 14px;
`;
