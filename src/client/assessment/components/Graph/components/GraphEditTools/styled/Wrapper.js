import styled from "styled-components";

const padding = 19;

export const Wrapper = styled.div`
  top: ${props => `${Number(props.margin.top) + padding}px`};
  left: ${({ side, margin, width }) =>
    `${side === "left" ? Number(margin.left) + padding : Number(margin.left) + Number(width) - 40 - padding}px`};
  display: flex;
  flex-direction: column;
  position: absolute;
  z-index: 30;
`;
