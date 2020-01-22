import styled from "styled-components";

export default styled.div`
  display: inline-block;
  height: 100%;
  width: 100%;
  line-height: ${({ _lineHeight }) => `${_lineHeight}px`};
`;
