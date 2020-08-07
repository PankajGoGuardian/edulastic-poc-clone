import styled from "styled-components";

export const MathInputWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  position: ${props => (props.docBasedQType == "math" ? "relative" : "")};
`;
