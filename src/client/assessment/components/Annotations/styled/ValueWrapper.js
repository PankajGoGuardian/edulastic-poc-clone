import styled from "styled-components";

export const ValueWrapper = styled.div.attrs({ className: "value-wrapper" })`
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 0px 4px;
  overflow: hidden;
  width: 100%;

  height: ${({ isOverHight }) => isOverHight && "100%"};
`;
