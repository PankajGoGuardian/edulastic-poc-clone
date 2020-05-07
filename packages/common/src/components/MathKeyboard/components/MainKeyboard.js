import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import chunk from "lodash/chunk";
import cloneDeep from "lodash/cloneDeep";
import { white, darkGrey, themeColor } from "@edulastic/colors";

const limitRow = 3;
const MainKeyboard = ({ btns, onInput, fullKeybord }) => {
  const [boards, updateBoards] = useState({});
  const [current, updateCurrent] = useState(0);
  const numOfKeys = btns.length;

  useEffect(() => {
    const keybuttons = cloneDeep(btns);

    let keysPerRow = 4;
    if (numOfKeys > 12 && numOfKeys <= 15) {
      keysPerRow = 5;
    }
    if (numOfKeys > 15) {
      keysPerRow = 6;
    }

    if (fullKeybord) {
      keysPerRow = 6;
    }

    const rows = chunk(keybuttons, keysPerRow);
    updateBoards(chunk(rows, limitRow));
  }, [btns]);

  const handleClick = (handler, command) => () => {
    if (handler && command) {
      onInput(handler, command);
    }
  };

  const onClickNext = () => {
    const next = current + 1;
    if (next < boards.length) {
      updateCurrent(next);
    }
  };

  const onClickPrev = () => {
    const prev = current - 1;
    if (prev >= 0) {
      updateCurrent(prev);
    }
  };

  const currentBoard = boards[current] || [];
  return (
    <Wrapper>
      <PrevButton onClick={onClickPrev} hidden={current <= 0} />
      <div data-cy="virtual-keyboard-buttons">
        {currentBoard.map((row, rowIndex) => (
          <Row key={rowIndex} data-cy={`button-row-${rowIndex}`}>
            {row.map(({ label, handler, command = "cmd" }, i) => {
              let fontRate = 1;
              if (typeof label === "string" && label.length > 4) {
                fontRate = 4.5 / label.length;
              }

              return (
                <Button
                  key={i}
                  fontSizeRate={fontRate}
                  onClick={handleClick(handler, command)}
                  data-cy={`virtual-keyboard-${handler}`}
                >
                  <Label>{label}</Label>
                </Button>
              );
            })}
          </Row>
        ))}
      </div>
      <NextButton onClick={onClickNext} hidden={boards.length <= 0 || current >= boards.length - 1} />
    </Wrapper>
  );
};

MainKeyboard.propTypes = {
  btns: PropTypes.array.isRequired,
  onInput: PropTypes.func.isRequired,
  fullKeybord: PropTypes.bool
};

MainKeyboard.defaultProps = {
  fullKeybord: false
};

export default MainKeyboard;

const Wrapper = styled.div`
  padding: 16px 24px;
  display: flex;
  flex-wrap: wrap;
  position: relative;
  flex-direction: column;
`;

const PrevNext = styled.div`
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

const PrevButton = styled(PrevNext)`
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

const NextButton = styled(PrevNext)`
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

const Row = styled.div`
  display: flex;
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0px;
  }
`;

const Button = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #8d98a7;
  background: ${white};
  border-radius: 10px;
  margin-right: 10px;
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

const Label = styled.span`
  white-space: nowrap;
  line-height: 1;
`;
