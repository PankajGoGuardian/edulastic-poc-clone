import styled from "styled-components";

const getCellColor = (correct, theme) => {
  switch (correct) {
    case true:
      return theme.widgets.matrixChoice.correctCellInputWrapperBgColor;
    case "incorrect":
      return theme.widgets.matrixChoice.incorrectCellInputWrapperBgColor;
    default:
      return "";
  }
};

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => !props.isPrintPreview && getCellColor(props.correct, props.theme)};
  padding: ${props => (props.smallSize ? 1 : 16)}px;
  position: relative;
  .inline-label {
    margin-right: ${({ isPrintPreview }) => (isPrintPreview ? "0px" : "10px")};
  }
  height: calc(100% - 4px);
  width: calc(100% - 4px);
`;
