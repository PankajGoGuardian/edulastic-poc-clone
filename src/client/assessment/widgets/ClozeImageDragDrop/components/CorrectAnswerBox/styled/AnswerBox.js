import styled from "styled-components";

export const AnswerBox = styled.div`
  display: flex;
  margin: 5px;
  min-width: 150px;
  border-radius: 4px;
  background: ${({ theme }) => theme.widgets.clozeImageDragDrop.boxBgColor};
`;
