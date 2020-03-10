import React from "react";
import styled from "styled-components";
import { MathFormulaDisplay } from "@edulastic/common";
import { IconWrapper } from "./styled/IconWrapper";
import { RightIcon } from "./styled/RightIcon";
import { WrongIcon } from "./styled/WrongIcon";

const AnswerBox = ({ checked, correct, userAnswer, indexStr, inPopover, showIndex, lessMinWidth, ...rest }) => (
  <Container {...rest} checked={checked} correct={correct}>
    {showIndex && (
      <IndexBox checked={checked} correct={correct}>
        {indexStr}
      </IndexBox>
    )}
    <AnswerContent inPopover={inPopover} dangerouslySetInnerHTML={{ __html: userAnswer || "" }} />
    <IconWrapper rightPosition={lessMinWidth ? 1 : 8}>
      {checked && correct && <RightIcon />}
      {checked && !correct && <WrongIcon />}
    </IconWrapper>
  </Container>
);
export default AnswerBox;

const Container = styled.div`
  display: inline-flex;
  position: relative;
  vertical-align: middle;
  cursor: pointer;
  border-radius: 4px;
  background: ${({ theme, checked, correct }) => {
    if (checked === undefined && correct === undefined) {
      return theme.widgets.clozeDropDown.boxBgColor;
    }
    if (checked === false) {
      return theme.widgets.clozeDropDown.boxNoAnswerBgColor;
    }
    if (checked && !correct) {
      return theme.widgets.clozeDropDown.boxWrongBgColor;
    }
    if (checked && correct) {
      return theme.widgets.clozeDropDown.boxBgCorrectColor;
    }
  }};
`;

const AnswerContent = styled(MathFormulaDisplay)`
  overflow: hidden;
  padding: 8px 10px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  display: inline-block;
  vertical-align: middle;
  line-height: 1.2;
  ${({ showIndex, inPopover }) => `
    max-width: ${showIndex ? 560 : 600}px;
    width: ${showIndex ? "calc(100% - 60px)" : "100%"};
    padding-right: ${showIndex ? 5 : 20}px;
    text-overflow: ${inPopover ? "" : "ellipsis"};
    white-space: ${inPopover ? "" : "nowrap"};
  `}
`;

const IndexBox = styled.div`
  width: 40px;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  ${({ theme, checked, correct }) => `
    background: ${
      checked === undefined && correct === undefined
        ? theme.widgets.clozeDropDown.indexBoxBgColor
        : checked === false
        ? theme.widgets.clozeDropDown.indexBoxNoAnswerBgColor
        : checked && !correct
        ? theme.widgets.clozeDropDown.indexBoxIncorrectBgColor
        : theme.widgets.clozeDropDown.indexBoxCorrectBgColor
    };
    color: ${theme.widgets.clozeDropDown.indexBoxColor};
    font-size: ${theme.widgets.clozeDropDown.indexBoxFontSize};
    font-weight: ${theme.widgets.clozeDropDown.indexBoxFontWeight};
  `}
`;
