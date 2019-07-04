import styled from "styled-components";

const convertNumToPixel = val => {
  if (val.toString().search("px") === -1) {
    return `${val}px`;
  }
  return val;
};

export const AnswerContainer = styled.div`
  img {
    height: ${({ height }) => `${convertNumToPixel(height)} !important`};
    width: ${({ width }) => `calc(${convertNumToPixel(width)} - (2 * 5px)) !important`};
  }
`;
