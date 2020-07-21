import styled from "styled-components";

export const Text = styled.div`
  width: ${({ showDragHandle, smallSize }) =>
    showDragHandle ? (smallSize ? "calc(100% - 30px)" : "calc(100% - 50px)") : "100%"};

  background: ${({ checkStyle, correct, theme, isPrintPreview }) => {
    if (isPrintPreview) return "transparent";
    return checkStyle ? (correct ? `${theme.checkbox.rightBgColor}` : `${theme.checkbox.wrongBgColor}`) : "none";
  }};
  display: flex;
  position: relative;
  /**
    removing align-items: center because choice can contain image
   */
  overflow: auto;
  .math-formula-display {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-right: 40px;
  }
`;
