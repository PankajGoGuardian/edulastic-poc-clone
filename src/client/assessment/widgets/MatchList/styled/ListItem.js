import styled from "styled-components";
import { greyThemeLighter } from "@edulastic/colors";

export const ListItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  word-break: break-word;
  min-height: ${({ smallSize }) => (smallSize ? 26 : 32)}px;
  border-radius: 2px;
  font-weight: ${props => props.theme.widgets.matchList.listItemFontWeight};
  color: ${props => props.theme.widgets.matchList.listItemColor};
  border: 2px solid ${props => props.theme.widgets.matchList.listItemBorderColor};
  background: ${greyThemeLighter};
  padding: 4px 12px;
  overflow: hidden;

  .math-formula-display {
    text-align: center;
  }
`;
