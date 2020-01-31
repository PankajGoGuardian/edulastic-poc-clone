import styled from "styled-components";

export const Table = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const TR = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const TH = styled.div`
  display: flex;
  margin: 8px;
  justify-content: center;
`;

export const TD = styled.div`
  display: flex;
  margin: 8px;
  align-items: ${({ center }) => (center ? "center" : null)};
`;
