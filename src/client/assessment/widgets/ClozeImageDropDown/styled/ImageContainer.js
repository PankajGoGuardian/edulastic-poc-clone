import styled from "styled-components";

// This is reported by `no-useless-concat`.
export const ImageContainer = styled.div`
  position: relative;
  top: 0px;
  left: 0px;
  min-height: ${props => (props.imageUrl ? "100%" : "400px")};
  padding: 0px;
  width: ${props => (props.width ? `${props.width}` : props.imageUrl ? "auto" : "100%")};
  height: ${({ height }) => (!height ? "100%" : `${height}`)};
  overflow-y: auto;
`;
