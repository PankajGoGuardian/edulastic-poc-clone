import styled from "styled-components";

export const StyledCorrectAnswerbox = styled.div`
  padding: 16px 25px;
  font-size: ${props => props.fontSize};
  width: ${({ width }) => width || "100%"};
  background: ${({ theme }) => theme.widgets.clozeDragDrop.responseContainerBgColor};
`;
