import styled from "styled-components";

import { publisherCollectionBg, white, mainBgColor } from "@edulastic/colors";

export const StyledWrapper = styled.div`
  width: ${({ width }) => width || "50%"};
  padding: 35px;
  border-radius: 10px;
  background: ${mainBgColor};
  ${({ style }) => style};
`;

export const StyledPreviewContainer = styled.div`
  display: flex;
  flex-direction: ${({ flexDirection }) => flexDirection || "row"};
  border: 1px solid #dadae4;
`;

export const StyledTitle = styled.h3`
  font-weight: bold;
  font-size: 18px;
`;

export const StyledQuestionBody = styled.div`
  padding: 10px 0 0 0;
`;

export const StyledDivider = styled.div`
  padding: 10px;
  background: ${publisherCollectionBg};
`;
export const StyledCodeEvalWrapper = styled.div`
  width: 100%;
  border-radius: 10px;
  background: ${white};
`;
