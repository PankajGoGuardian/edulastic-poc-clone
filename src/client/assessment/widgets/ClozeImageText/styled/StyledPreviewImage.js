import styled from "styled-components";

export const StyledPreviewImage = styled.img`
  width: ${({ width }) => width || "auto"};
  height: ${props => (props.smallSize ? "100%" : "auto")};
  user-select: none;
  pointer-events: none;
  object-fit: contain;
`;
