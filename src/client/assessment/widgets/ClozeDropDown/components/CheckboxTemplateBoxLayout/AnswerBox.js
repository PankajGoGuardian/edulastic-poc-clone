import React from "react";
import styled from "styled-components";
import { MathFormulaDisplay } from "@edulastic/common";
import { greyThemeLight } from "@edulastic/colors";
import { IconWrapper } from "./styled/IconWrapper";
import { RightIcon } from "./styled/RightIcon";
import { WrongIcon } from "./styled/WrongIcon";

const AnswerBox = ({ checked, correct, userAnswer, indexStr, inPopover, showIndex, lessMinWidth, ...rest }) => (
  <Container data-cy="answer-box" {...rest} checked={checked} correct={correct}>
    {showIndex && (
      <IndexBox data-cy="index" checked={checked} correct={correct}>
        {indexStr}
      </IndexBox>
    )}
    <AnswerContent inPopover={inPopover} dangerouslySetInnerHTML={{ __html: userAnswer || "" }} />
    <IconWrapper data-cy={`icon-${checked && correct}`} rightPosition={lessMinWidth ? 1 : 8}>
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
  border: 1px solid ${greyThemeLight};
  background: ${({ theme, checked, correct }) => {
    if (!checked) {
      return theme.widgets.clozeDropDown.boxNoAnswerBgColor;
    }
    if (!correct) {
      return theme.widgets.clozeDropDown.boxWrongBgColor;
    }
    if (correct) {
      return theme.widgets.clozeDropDown.boxBgCorrectColor;
    }
    return theme.widgets.clozeDropDown.boxBgColor;
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
      !checked
        ? theme.widgets.clozeDropDown.indexBoxNoAnswerBgColor
        : correct
        ? theme.widgets.clozeDropDown.indexBoxCorrectBgColor
        : theme.widgets.clozeDropDown.indexBoxIncorrectBgColor
    };
    color: ${theme.widgets.clozeDropDown.indexBoxColor};
    font-size: ${theme.widgets.clozeDropDown.indexBoxFontSize};
    font-weight: ${theme.widgets.clozeDropDown.indexBoxFontWeight};
  `}
`;
