import styled from 'styled-components';
import Color from 'color';
import {
  svgMapFillColor,
  svgMapStrokeColor,
  secondaryTextColor,
  red,
  green,
  white
} from '@edulastic/colors';

const getItemBackground = (alpha, defaultColor) => ({
  active,
  showAnswers,
  checkAnswers,
  correct,
  locked
}) => {
  const isCheckGreen = checkAnswers && active && !locked && correct;
  const isCheckRed = checkAnswers && active && !locked && !correct;
  const isCheckLocked = (checkAnswers && active && locked) || (checkAnswers && !active && locked);
  const isShowGreen = showAnswers && correct && !locked;
  const isShowLocked =
    (showAnswers && correct && locked) || (showAnswers && !correct && active && locked);
  const isShowRed = showAnswers && !correct && active && !locked;
  const isSimplyActive = !checkAnswers && !showAnswers && active;

  if (isCheckGreen || isShowGreen) {
    return green;
  }
  if (isCheckRed || isShowRed) {
    return red;
  }
  if (isCheckLocked || isShowLocked || isSimplyActive) {
    return Color(svgMapFillColor)
      .alpha(alpha)
      .string();
  }
  return defaultColor;
};

const getIcon = ({ showAnswers, correct, locked, checkAnswers, active }) => {
  const isCheckTick = checkAnswers && active && !locked && correct;
  const isShowTick = showAnswers && correct && !locked;
  const isCheckCross = checkAnswers && active && !locked && !correct;
  const isShowCross = showAnswers && !correct && active && !locked;

  if (isCheckTick || isShowTick) {
    return '\\f00c';
  }
  if (isCheckCross || isShowCross) {
    return '\\f00d';
  }
  return '';
};

export const Li = styled.li`
  width: ${({ width }) => width * 40}px;
  height: ${({ height }) => height * 40}px;
  background: ${getItemBackground(0.8, svgMapFillColor)};
  cursor: ${({ locked }) => (locked ? 'not-allowed' : 'pointer')};
  border: 2px solid ${svgMapStrokeColor};
  display: inline-block;
  margin-left: -2px;
  position: relative;
  padding: 0;
  z-index: 0;
  &:first-child {
    margin-left: 0;
  }
  &:hover {
    background: ${getItemBackground(0.6, 'transparent')};
    z-index: 11;
    border: 3px solid ${secondaryTextColor};
  }
  &::before {
    font-family: FontAwesome;
    content: "${getIcon}";
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 20;
    font-size: 20px;
    transform: translate(-50%, -50%);
    color: ${white};
  }
`;
