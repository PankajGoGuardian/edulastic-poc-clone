import styled from "styled-components";

export const Col = styled.div`
  display: flex;
  margin-bottom: 15px;
  flex-direction: column;
  width: ${({ md }) => (100 / 12) * md}%;
`;
