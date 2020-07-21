import styled from "styled-components";

const MathInputWrapper = styled.div`
  position: relative;
  max-width: 100%;
  min-width: ${({ minWidth }) => minWidth};
  border-radius: 2px;
  background: ${({ bg }) => bg};

  & > div {
    max-width: 100%;
  }
`;

export default MathInputWrapper;
