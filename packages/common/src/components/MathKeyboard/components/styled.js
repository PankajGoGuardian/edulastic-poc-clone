import styled from "styled-components";
import { white, darkGrey, themeColor } from "@edulastic/colors";
import { math } from "@edulastic/constants";

const {
  KeyboardSize: { width: keyWidth, height: keyHeight }
} = math;

export const Container = styled.div`
  padding: 16px 24px;
  display: flex;
  flex-wrap: wrap;
  position: relative;
`;

export const SymbolsWrapper = styled.div`
  display: ${({ isVertical }) => (isVertical ? "flex" : "")};
`;

export const NumberBoardWrapper = styled.div`
  padding-right: 10px;
`;

export const PrevNext = styled.div`
  top: 0px;
  width: 22px;
  height: 100%;
  background: transparent;
  position: absolute;
  display: ${({ hidden }) => (hidden ? "none" : null)};
  cursor: pointer;
  &::after {
    content: "";
    position: absolute;
    border: 12px solid;
    top: 50%;
    transform: translateY(-50%);
    border-color: transparent;
  }
`;

export const PrevButton = styled(PrevNext)`
  left: 0px;
  &::after {
    left: -7px;
    border-right-color: ${darkGrey};
  }
  &:hover {
    &::after {
      border-right-color: ${themeColor};
    }
  }
`;

export const NextButton = styled(PrevNext)`
  right: 0px;
  &::after {
    right: -7px;
    border-left-color: ${darkGrey};
  }
  &:hover {
    &::after {
      border-left-color: ${themeColor};
    }
  }
`;

export const Row = styled.div`
  display: flex;
  flex-direction: ${({ isVertical }) => (isVertical ? "column" : "row")};
  margin-bottom: ${({ isVertical }) => (isVertical ? "0px" : "10px")};
  &:last-child {
    margin-bottom: 0px;
    > div {
      margin-right: ${({ isVertical }) => (isVertical ? "0px" : "")};
    }
  }
`;

export const Button = styled.div`
  width: ${keyWidth}px;
  height: ${keyHeight}px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #8d98a7;
  background: ${white};
  border-radius: 10px;
  margin-right: 10px;
  margin-bottom: ${({ isVertical }) => (isVertical ? "10px" : "")};
  font-size: ${props => {
    const fontSize = parseInt(props.theme.mathKeyboard.numFontSize, 10) * props.fontSizeRate;
    return `${fontSize}px !important`;
  }};
  font-weight: ${props => props.theme.mathKeyboard.numFontWeight};
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.5);
  user-select: none;
  cursor: pointer;
  &:last-child {
    margin-right: 0px;
  }
  &:hover {
    background: rgba(0, 0, 0, 0.08);
  }
  &:active {
    box-shadow: none;
  }
`;

export const Label = styled.span`
  white-space: nowrap;
  line-height: 1;
`;
