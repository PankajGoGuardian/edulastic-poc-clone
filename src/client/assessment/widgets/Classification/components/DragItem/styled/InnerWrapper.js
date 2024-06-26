import styled from "styled-components";
import { themeColorHoverBlue } from "@edulastic/colors";

export const InnerWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 5px;
  border-style: dotted;
  overflow: hidden;
  position: relative;
  padding: 4px;

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
    width,
    showIcon,
    isPrintPreview
  }) => {
    let bgColor = theme.widgets.classification.dragItemBgColor;
    let borderColor = theme.widgets.classification.dragItemBorderColor;

    if (preview && valid !== undefined) {
      bgColor = theme.widgets.classification.dragItemNotValidBorderColor;
      borderColor = theme.widgets.classification.dragItemNotValidBgColor;
    }

    if (preview && valid) {
      bgColor = theme.widgets.classification.dragItemValidBgColor;
      borderColor = theme.widgets.classification.dragItemValidBorderColor;
    }

    if (!preview && transparent) {
      bgColor = "transparent";
    }

    if (isPrintPreview && bgColor !== "#FFFFFF") {
      bgColor = "transparent";
    }

    return `
      border-color: ${showIcon ? "transparent" : borderColor};
      background-color: ${bgColor};
      opacity:  ${dragging ? 0.1 : 1};
      font-weight: ${theme.widgets.classification.dragItemFontWeight};
      border-width: 2px;
      width: ${width ? `${width + 10}px` : ""};
      min-width: ${minWidth}px;
      max-width: ${maxWidth - 25}px;
      min-height: ${minHeight}px;
      max-height: ${maxHeight}px;
      padding-right: ${showIcon ? "20px" : ""};
    `;
  }}

  &:hover {
    border-color: ${themeColorHoverBlue};
    background: ${themeColorHoverBlue};
    & * {
      color: white !important;
    }
  }
`;
