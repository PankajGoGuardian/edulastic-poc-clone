import styled from "styled-components";

export const AnswerBox = styled.div`
  display: flex;
  margin: 5px;
  min-width: 150px;
  border-radius: 4px;
  background: ${({ theme }) => theme.widgets.clozeImageDragDrop.boxBgColor};
  border: ${({
    theme: {
      answerBox: { borderWidth, borderStyle, borderColor }
    }
  }) => `${borderWidth} ${borderStyle} ${borderColor}`};
  border-radius: ${({
    theme: {
      answerBox: { borderRadius }
    }
  }) => borderRadius};
`;
