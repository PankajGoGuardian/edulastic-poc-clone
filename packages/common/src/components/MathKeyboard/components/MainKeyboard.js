import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import chunk from "lodash/chunk";
import cloneDeep from "lodash/cloneDeep";
import NumberKeyboard from "./NumberKeyboard";
import { Container, SymbolsWrapper, PrevButton, NextButton, Row, Button, Label } from "./styled";

const MainKeyboard = ({ type, btns, onInput, fullKeybord, isDocbasedSection, numbers }) => {
  const [boards, updateBoards] = useState({});
  const [current, updateCurrent] = useState(0);
  const numOfKeys = btns.length;

  useEffect(() => {
    const keybuttons = cloneDeep(btns);
    let keysPerRow = 4;
    let limitRow = 3;

    if (numOfKeys > 12 && numOfKeys <= 15) {
      keysPerRow = 5;
    }
    if (numOfKeys > 15) {
      keysPerRow = 6;
    }

    if (fullKeybord) {
      keysPerRow = 8;
    }

    if (isDocbasedSection || numbers) {
      keysPerRow = 4;
    }

    if (type === "intermediate" && numbers) {
      limitRow = 5;
    }

    const rows = chunk(keybuttons, keysPerRow);
    updateBoards(chunk(rows, limitRow));
    updateCurrent(0);
  }, [btns]);

  const handleClick = (handler, command, numToMove) => () => {
    if (handler && command) {
      onInput(handler, command, numToMove);
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
    <Container>
      <PrevButton onClick={onClickPrev} hidden={current <= 0} />
      {numbers && <NumberKeyboard buttons={numbers} onInput={onInput} />}
      <SymbolsWrapper data-cy="virtual-keyboard-buttons" isVertical={!!numbers}>
        {currentBoard.map((row, rowIndex) => (
          <Row key={rowIndex} data-cy={`button-row-${rowIndex}`} isVertical={!!numbers}>
            {row.map(({ label, handler, command = "cmd", numToMove }, i) => {
              let fontRate = 1;
              if (typeof label === "string" && label.length > 4) {
                fontRate = 4.5 / label.length;
              }

              return (
                <Button
                  key={i}
                  fontSizeRate={fontRate}
                  isVertical={!!numbers}
                  onClick={handleClick(handler, command, numToMove)}
                  data-cy={`virtual-keyboard-${handler}`}
                >
                  <Label>{label}</Label>
                </Button>
              );
            })}
          </Row>
        ))}
      </SymbolsWrapper>
      <NextButton onClick={onClickNext} hidden={boards.length <= 0 || current >= boards.length - 1} />
    </Container>
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
