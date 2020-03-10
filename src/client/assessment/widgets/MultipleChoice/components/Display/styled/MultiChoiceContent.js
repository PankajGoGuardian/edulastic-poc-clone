import styled from "styled-components";
import { red, strikeOutHover } from "@edulastic/colors";

const getDegree = (charCount = 0) => {
  let degrees;

  if (charCount <= 5) {
    degrees = 30;
  } else if (charCount > 5 && charCount <= 10) {
    degrees = 20;
  } else if (charCount > 10 && charCount <= 18) {
    degrees = 15;
  } else if (charCount > 18 && charCount <= 25) {
    degrees = 10;
  } else if (charCount > 25 && charCount <= 35) {
    degrees = 7.5;
  } else if (charCount > 35 && charCount < 100) {
    degrees = 5;
  } else {
    degrees = 3;
  }
  return degrees;
};

export const MultiChoiceContent = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  font-weight: ${props => props.theme.widgets.multipleChoice.multiChoiceContentFontWeight};
  font-size: ${props => props.fontSize || props.theme.widgets.multipleChoice.multiChoiceContentFontSize};
  margin-left: ${({ uiStyleType }) =>
    uiStyleType === "radioBelow" ? "0px" : uiStyleType === "block" ? "52px" : "8px"};

  ${({ isCrossAction, hovered, charCount }) => {
    let color = strikeOutHover;
    if (isCrossAction) {
      color = red;
    }
    const count = getDegree(charCount);
    return (
      (isCrossAction || hovered) &&
      `
      position: relative;
      display: inline-block;

      &:before, &:after {
        content: "";
        width: 100%;
        position: absolute;
        right: 0;
        top: 50%;
        z-index: 1;
      }

      &:before {
        border-bottom: 4px solid ${color};
        transform: skewY(-${count}deg);
      }
      
      &:after {
        border-bottom: 4px solid ${color};
        transform: skewY(${count}deg);
      }
    `
    );
  }}

  &:hover {
    &:before,
    &:after {
      opacity: 0.5;
    }
  }
`;

export const MultipleChoiceLabelContainer = styled.div`
  display: block;
`;

MultiChoiceContent.displayName = "MultiChoiceContent";
