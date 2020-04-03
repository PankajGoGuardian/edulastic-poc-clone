import styled from "styled-components";
import { StyledPaperWrapper } from "../../../styled/Widget";

export const PreviewContainer = styled(StyledPaperWrapper)`
  position: relative;
  border-radius: 0px;
  overflow: ${({ hideInternalOverflow }) => (hideInternalOverflow ? null : "auto")};
`;
