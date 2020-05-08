import styled from "styled-components";

export const Color = styled.div`
  background: ${({ color }) => color};
  width: 16px;
  height: 16px;
`;

export const Label = styled.div`
  font-size: 11px;
  text-transform: uppercase;
  margin: 0 10px 0 6px;
  white-space: nowrap;
`;
