import styled from "styled-components";

export const Text = styled.div`
  width: ${({ showDragHandle, smallSize }) =>
    showDragHandle ? (smallSize ? "calc(100% - 30px)" : "calc(100% - 50px)") : "100%"};

  background: ${({ checkStyle, correct, theme, isPrintPreview }) => {
    if (isPrintPreview) return "transparent";
    return checkStyle
      ? correct
        ? `${theme.widgets.sortList.dragItemCorrectTextBgColor}`
        : `${theme.widgets.sortList.dragItemIncorrectTextBgColor}`
      : "none";
  }};
  display: flex;
  position: relative;
  /**
    removing align-items: center because choice can contain image
   */
  overflow: auto;
  .math-formula-display {
    /** 
      To cope up removing align item 
      current choice box height is 40px
    */
    padding: 10px;
    padding-right: ${({ checkStyle }) => (checkStyle ? 40 : 4)}px;
  }
`;
