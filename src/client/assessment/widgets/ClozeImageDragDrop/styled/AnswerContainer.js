import styled from "styled-components";

export const AnswerContainer = styled.div`
  img {
    height: ${({ height }) => `${height} !important`};
    width: ${({ width }) => `calc(${width} - (2 * 5px)) !important`};
  }
`;
