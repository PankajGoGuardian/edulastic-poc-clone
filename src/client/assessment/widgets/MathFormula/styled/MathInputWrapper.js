import styled from "styled-components";

const MathInputWrapper = styled.div`
  position: relative;
  max-width: 450px;
  width: ${({ width }) => (width ? width : "auto")};
`;

export default MathInputWrapper;
