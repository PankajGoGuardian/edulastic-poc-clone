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

export const IconWrapper = styled.div`
  height: 100%;
  background: ${props => getCellColor(props.correct, props.theme)};
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
