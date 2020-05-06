import styled from "styled-components";

export const Color = styled.div`
  background: ${({ color }) => color};
  width: 16px;
  height: 16px;
`;

export const Label = styled.div`
  font-size: 11px;
  text-transform: uppercase;
  margin: 0 12px 0 8px;
`;
