import styled from "styled-components";

import { response as Dimensions } from "@edulastic/constants";

export const ResponseContainer = styled.span`
  border: 2px dotted
    ${props =>
      props.smallSize
        ? props.theme.widgets.clozeDragDrop.responseContainerSmallBorderColor
        : props.theme.widgets.clozeDragDrop.responseContainerBorderColor};
  min-width: ${props => (props.smallSize ? 140 : Dimensions.minWidth)}px;
  /* min-height: 30px; */
  padding: 5px 10px;
  margin: 0 10px 5px;
  min-height: ${props => (props.smallSize ? 40 : Dimensions.minHeight)}px;
  display: inline-flex;
  align-items: center;
  border-radius: 10px;
  overflow: hidden;
  img {
    max-width: 100px;
    max-height: 100px;
  }
  p {
    margin-bottom: 0px;
  }
`;
