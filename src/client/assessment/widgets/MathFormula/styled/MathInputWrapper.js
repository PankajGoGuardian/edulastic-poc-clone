import styled from "styled-components";

const MathInputWrapper = styled.div`
  position: relative;
  max-width: 100%;
  min-width: ${({ width }) => width || "auto"};

  & > div {
    max-width: 100%;
  }
`;

export default MathInputWrapper;
