import styled from "styled-components";

export const DropContainer = styled.div`
  height: 600px;
  width: 700px;
  overflow: hidden;
  position: relative;
  border: 1px gray solid;
  img {
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
`;
