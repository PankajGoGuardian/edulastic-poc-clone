import styled from "styled-components";
import { FlexRow } from "./FlexRow";

export const Item = styled(FlexRow)`
  display: grid;
  grid-template-columns: 40px 97%;
  align-items: stretch;
  height: max-content;
  border-radius: 4px;
  background-color: ${props => props.theme.widgets.sortList.correctAnswersItemBgColor};
  margin-right: 10px;
  font-weight: ${props => props.theme.widgets.sortList.correctAnswersItemFontWeight};
  margin-top: 14px;
`;
