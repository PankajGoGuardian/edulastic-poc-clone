import styled from "styled-components";

export const RndWrapper = styled.div`
  /* 
    * override the default style of the rnd component when zoomed is applied 
    * only applied when it is not resizeable (in preview mode only)
  */
  .answer-draggable-wrapper {
    transform: ${({ isResizable, translateProps }) => !isResizable && `translate(${translateProps}) !important`};
  }
`;
