import styled from "styled-components";
import { Rnd as ReactRnd } from "react-rnd";

export const RndWrapper = styled.div`
  /* 
    * override the default style of the rnd component when zoomed is applied 
    * only applied when it is not resizeable (in preview mode only)
  */
  .answer-draggable-wrapper {
    transform: ${({ isResizable, translateProps }) => !isResizable && `translate(${translateProps}) !important`};
    min-height: ${({ minHeight }) => `${minHeight}px`};
  }
`;

export const Rnd = styled(ReactRnd).attrs(({ isResizable }) => ({
  enableResizing: {
    bottom: !!isResizable,
    bottomLeft: !!isResizable,
    bottomRight: !!isResizable,
    left: !!isResizable,
    right: !!isResizable,
    top: !!isResizable,
    topLeft: !!isResizable,
    topRight: !!isResizable
  },
  className: "answer-draggable-wrapper"
}))``;
