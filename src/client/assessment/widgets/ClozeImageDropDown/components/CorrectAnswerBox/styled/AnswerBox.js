import styled from "styled-components";

export const AnswerBox = styled.div`
  display: inline-flex;
  margin: 5px;
  min-width: 140px;
  border-radius: 4px;
  background: ${({ theme }) => theme.widgets.clozeImageDropDown.boxBgColor};
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
