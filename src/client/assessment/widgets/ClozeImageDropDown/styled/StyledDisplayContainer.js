import styled from "styled-components";

export const StyledDisplayContainer = styled.div`
  font-size: ${props => props.fontSize}px;
  width: 100%;
  display: inline-block;
  height: ${({ height }) => height || "max-content"};
`;
