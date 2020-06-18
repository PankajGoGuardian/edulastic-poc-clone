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
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => !props.isPrintPreview && getCellColor(props.correct, props.theme)};
  padding: ${props => (props.smallSize ? 1 : 15)}px;
  position: relative;
  .inline-label {
    margin-right: ${({ isPrintPreview }) => (isPrintPreview ? "0px" : "10px")};
  }
  height: 100%;
`;
