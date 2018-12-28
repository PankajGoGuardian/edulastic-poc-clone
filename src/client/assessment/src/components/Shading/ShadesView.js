import React from 'react';
import PropTypes from 'prop-types';
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

const ShadesView = ({
  cellWidth,
  cellHeight,
  rowCount,
  colCount,
  onCellClick,
  shaded,
  correctAnswers,
  showAnswers,
  marginTop,
  lockedCells,
  checkAnswers
}) => {
  const rowsArray = Array(rowCount).fill(null);

  const columnsArray = Array(colCount).fill(null);

  const isLockedIndexExists = (i, j) =>
    Array.isArray(lockedCells) &&
    lockedCells.findIndex(shade => shade[0] === i && shade[1] === j) !== -1;

  const isShadeActive = (i, j) =>
    shaded.findIndex(shade => shade[0] === i && shade[1] === j) !== -1;

  const getActiveShadesCount = () => {
    let count = 0;

    rowsArray.forEach((row, i) => {
      columnsArray.forEach((col, j) => {
        if (isShadeActive(i, j) && !isLockedIndexExists(i, j)) {
          count++;
        }
      });
    });

    return count;
  };

  const isCorrectAnswer = (i, j) =>
    correctAnswers.findIndex(shade =>
      (Array.isArray(shade) ? shade[0] === i && shade[1] === j : shade === getActiveShadesCount())) !== -1;
  return (
    <Wrapper marginTop={marginTop}>
      {rowsArray.map((row, i) => (
        <Ul key={i}>
          {columnsArray.map((col, j) => (
            <Li
              correct={isCorrectAnswer(i, j)}
              checkAnswers={checkAnswers}
              showAnswers={showAnswers}
              locked={isLockedIndexExists(i, j)}
              active={isShadeActive(i, j) || isLockedIndexExists(i, j)}
              onClick={isLockedIndexExists(i, j) ? undefined : onCellClick(i, j)}
              height={cellHeight}
              width={cellWidth}
              key={j}
            />
          ))}
        </Ul>
      ))}
    </Wrapper>
  );
};

ShadesView.propTypes = {
  cellHeight: PropTypes.number.isRequired,
  cellWidth: PropTypes.number.isRequired,
  rowCount: PropTypes.number.isRequired,
  colCount: PropTypes.number.isRequired,
  onCellClick: PropTypes.func.isRequired,
  shaded: PropTypes.array.isRequired,
  lockedCells: PropTypes.any,
  correctAnswers: PropTypes.any,
  showAnswers: PropTypes.any,
  marginTop: PropTypes.any,
  checkAnswers: PropTypes.bool
};

ShadesView.defaultProps = {
  lockedCells: undefined,
  correctAnswers: [],
  showAnswers: false,
  marginTop: undefined,
  checkAnswers: false
};

export default ShadesView;

const Ul = styled.ul`
  line-height: 0;
  margin: 0;
  padding: 0;
  text-align: left;
  list-style-position: outside;
  border-collapse: separate;
  margin-top: -2px;
  &:first-child {
    margin-top: 0;
  }
`;

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
const Li = styled.li`
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

const Wrapper = styled.div`
  display: block;
  position: relative;
  padding: 1px 0;
  margin-top: ${({ marginTop }) => marginTop || 40}px;
`;
