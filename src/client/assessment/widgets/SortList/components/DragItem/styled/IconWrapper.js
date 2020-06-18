import styled from "styled-components";

export const IconWrapper = styled.div`
  width: 40px;
  background: ${({ checkStyle, correct, theme, isPrintPreview }) => {
    if (isPrintPreview) return "transparent";
    return checkStyle
      ? correct
        ? `${theme.widgets.sortList.dragItemCorrectTextBgColor}`
        : `${theme.widgets.sortList.dragItemIncorrectTextBgColor}`
      : "none";
  }};
  position: absolute;
  right: 0px;
  height: 100%;
  align-items: center;
  justify-content: center;

  svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;
