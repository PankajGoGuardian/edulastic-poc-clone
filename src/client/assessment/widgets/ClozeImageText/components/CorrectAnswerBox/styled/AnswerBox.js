import styled from "styled-components";

export const AnswerBox = styled.div`
  display: inline-flex;
  margin: 5px;
  min-width: 150px;
  border-radius: 4px;
  background: ${({ theme }) => theme.widgets.clozeImageText.boxBgColor};
`;
