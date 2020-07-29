import styled from "styled-components";

export const ImageContainer = styled.img`
  width: ${props => (props.width ? `${props.width}px` : "auto")};
  height: ${({ height }) => (height ? `${height}px` : "auto")};
  top: ${({ top }) => top || 0}px;
  left: ${({ left }) => left || 0}px;
  position: absolute !important;
  z-index: 0 !important;
  max-height: 600px;
  max-width: 700px;
  margin-right: 0px;
`;
