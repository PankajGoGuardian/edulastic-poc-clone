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
  lockedCells
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
    <Wrapper>
      {rowsArray.map((row, i) => (
        <Ul key={i}>
          {columnsArray.map((col, j) => (
            <Li
              correct={isCorrectAnswer(i, j)}
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
  showAnswers: PropTypes.any
};

ShadesView.defaultProps = {
  lockedCells: undefined,
  correctAnswers: [],
  showAnswers: false
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

const getItemBackground = (alpha, defaultColor) => ({ active, showAnswers, correct, locked }) =>
  (showAnswers
    ? active && !locked
      ? correct
        ? green
        : red
      : locked
        ? Color(svgMapFillColor)
          .alpha(alpha)
          .string()
        : defaultColor
    : active
      ? Color(svgMapFillColor)
        .alpha(alpha)
        .string()
      : defaultColor);

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
  z-index: 10;
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
    content: "${({ showAnswers, correct, locked, active }) =>
    (showAnswers ? (active && !locked ? (correct ? '\\f00c' : '\\f00d') : '') : '')}";
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
  margin-top: 40px;
`;
