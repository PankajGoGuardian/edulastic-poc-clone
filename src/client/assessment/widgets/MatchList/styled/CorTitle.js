import styled from "styled-components";

export const CorTitle = styled.div`
  font-weight: ${props => props.theme.widgets.matchList.corTitleFontWeight};
  min-height: 32px;
  border-radius: 4px;
  width: calc(50% - 50px);
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-self: stretch;
  background-color: #fff;
  word-break: break-word;
  padding: 4px 12px;
  overflow: hidden;
  border: ${({
    theme: {
      answerBox: { borderWidth, borderStyle, borderColor }
    }
  }) => `${borderWidth} ${borderStyle} ${borderColor}`};

  .math-formula-display {
    text-align: center;
  }
`;
