import styled from "styled-components";

export const ZoneTitle = styled.div`
  font-size: ${({ theme, isComment }) =>
    isComment ? theme.styledDropZone.zoneTitleCommentFontSize : theme.styledDropZone.zoneTitleFontSize};
  font-weight: ${props => props.theme.styledDropZone.zoneTitleFontWeight};
  text-transform: uppercase;
  color: ${({ theme }) => theme.styledDropZone.zoneTitleColor};
  margin-top: ${({ isComment }) => (isComment ? 8 : 0)}px;
`;
