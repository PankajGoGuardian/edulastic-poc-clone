import styled from "styled-components";

export const ListItem = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  min-height: ${({ smallSize }) => (smallSize ? 26 : 40)}px;
  border-radius: 4px;
  font-weight: ${props => props.theme.widgets.matchList.listItemFontWeight};
  color: ${props => props.theme.widgets.matchList.listItemColor};
  border: 1px solid ${props => props.theme.widgets.matchList.listItemBorderColor};
  /* TODO: assign these on resize? */
  img {
    max-width: 200px !important;
    max-height: 120px !important;
    width: auto !important;
    border: 2px solid red;
  }
`;
