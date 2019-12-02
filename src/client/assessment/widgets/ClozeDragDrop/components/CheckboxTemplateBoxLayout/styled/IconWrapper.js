import styled from "styled-components";

export const IconWrapper = styled.div`
  position: absolute;
  right: ${({ rightPosition }) => `${rightPosition}px`};
  display: flex;
  height: 100%;
  width: 15px;
  align-items: center;
  justify-content: center;
  background: ${({ correct }) => (correct ? "#d3fea6" : "#fce0e8")};
`;
