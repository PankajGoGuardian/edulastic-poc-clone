import styled from "styled-components";

export const InnerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  border-radius: 5px;
  border-style: dotted;
  overflow: hidden;

  ${({
    theme,
    valid,
    preview,
    transparent,
    dragging,
    maxWidth,
    minWidth,
    minHeight,
    maxHeight,
    noBorder,
    width,
    padding
  }) => {
    let bgColor = theme.widgets.classification.dragItemBgColor;
    let borderColor = theme.widgets.classification.dragItemBorderColor;
    let borderWidth = noBorder ? 0 : 2;

    if (preview && valid !== undefined) {
      bgColor = theme.widgets.classification.dragItemNotValidBorderColor;
      borderColor = theme.widgets.classification.dragItemNotValidBgColor;
      borderWidth = 0;
    }

    if (preview && valid) {
      bgColor = theme.widgets.classification.dragItemValidBgColor;
      borderColor = theme.widgets.classification.dragItemValidBorderColor;
      borderWidth = 0;
    }

    if (transparent) {
      bgColor = "transparent";
    }

    return `
      border-color: ${borderColor};
      background-color: ${bgColor};
      opacity:  ${dragging ? 0.1 : 1};
      font-weight: ${theme.widgets.classification.dragItemFontWeight};
      border-width: ${borderWidth}px;
      width: ${width ? `${width}px` : ""};
      min-width: ${minWidth}px;
      max-width: ${maxWidth}px;
      min-height: ${minHeight}px;
      max-height: ${maxHeight}px;
      padding: ${padding};
    `;
  }}
`;
