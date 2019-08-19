import styled from "styled-components";

export const NumberPadWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: ${({ width }) => (width ? `${width}px` : "calc(65px * 4)")}; /* 65px is number button width */
  margin-right: 0px;
`;
