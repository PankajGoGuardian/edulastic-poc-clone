import styled from "styled-components";
import { StyledPaperWrapper } from "../../../styled/Widget";

export const PreviewContainer = styled(StyledPaperWrapper)`
  padding: 0;
  overflow: ${({ hideInternalOverflow }) => (hideInternalOverflow ? null : "auto")})};
  position: relative;
`;
