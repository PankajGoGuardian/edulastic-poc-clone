import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import chunk from 'lodash/chunk'
import cloneDeep from 'lodash/cloneDeep'
import flattenDeep from 'lodash/flattenDeep'
import isString from 'lodash/isString'
import { math as mathConstant } from '@edulastic/constants'
import NumberKeyboard from './NumberKeyboard'
import CustomKeyLabel from '../../CustomKeyLabel'

import {
  Container,
  SymbolsWrapper,
  PrevButton,
  NextButton,
  Row,
  Button,
  Label,
  ButtonLink,
} from './styled'

const { keyboardMethods } = mathConstant

const MainKeyboard = ({
  type,
  btns,
  onInput,
  fullKeybord,
  numbers,
  showPeriodic,
  openPeriodic,
}) => {
  const [boards, updateBoards] = useState({})
  const [current, updateCurrent] = useState(0)
  const numOfKeys = btns.length
  const showNumbers = numbers && current === 0

  useEffect(() => {
    const keybuttons = cloneDeep(btns)
    let keysPerRow = 4
    let limitRow = 3

    if (numOfKeys > 12 && numOfKeys <= 15) {
      keysPerRow = 5
    }
    if (numOfKeys > 15) {
      keysPerRow = 6
    }

    if (fullKeybord || type === keyboardMethods.CHEMISTRY) {
      keysPerRow = 8
      limitRow = 4
    }

    if (fullKeybord && numbers) {
      keysPerRow = 4
      limitRow = 5
    }

    if (!fullKeybord && numbers) {
      keysPerRow = 4
    }

    if (type === keyboardMethods.BASIC_MATRICES) {
      keysPerRow = 5
    }

    if (type === keyboardMethods.ADVANCED_TRIGNOMETRY) {
      limitRow = 6
    }

    if (type === keyboardMethods.BASIC_WO_NUMBER && numbers) {
      limitRow = 5
    }

    if (type === keyboardMethods.INTERMEDIATE) {
      limitRow = 4
    }

    if (type === keyboardMethods.INTERMEDIATE_WO_NUMBER) {
      keysPerRow = 6
      limitRow = 4
    }

    if (type === keyboardMethods.GEOMETRY) {
      keysPerRow = 5
      limitRow = 4
    }

    if (type === keyboardMethods.UNITS_SI) {
      keysPerRow = 7
      limitRow = 4
    }

    if (type === keyboardMethods.UNITS_US) {
      keysPerRow = 7
      limitRow = 5
    }

    const rows = chunk(keybuttons, keysPerRow)
    updateBoards(chunk(rows, limitRow))
    updateCurrent(0)
  }, [type, btns, numbers])

  const handleClick = (handler, command, numToMove) => () => {
    if (handler && command) {
      onInput(handler, command, numToMove)
    }
  }

  const onClickNext = () => {
    const next = current + 1
    if (next < boards.length) {
      updateCurrent(next)
    }
  }

  const onClickPrev = () => {
    const prev = current - 1
    if (prev >= 0) {
      updateCurrent(prev)
    }
  }

  let currentBoard = boards[current] || []
  if (!showNumbers && fullKeybord) {
    currentBoard = chunk(flattenDeep(currentBoard), 8)
  }

  return (
    <Container>
      {type === keyboardMethods.CHEMISTRY && (
        <ButtonLink onClick={openPeriodic}>
          {showPeriodic ? 'Hide periodic table' : 'Show periodic table'}
        </ButtonLink>
      )}
      <PrevButton
        onClick={onClickPrev}
        onTouchEnd={onClickPrev}
        hidden={current <= 0}
        data-cy="prevButton"
      />
      {showNumbers && <NumberKeyboard buttons={numbers} onInput={onInput} />}
      <SymbolsWrapper
        data-cy="virtual-keyboard-buttons"
        isVertical={!!showNumbers}
      >
        {currentBoard.map((row, rowIndex) => (
          <Row
            key={rowIndex}
            data-cy={`button-row-${rowIndex}`}
            isVertical={!!showNumbers}
          >
            {row.map(
              ({ label, handler, dataCy, command = 'cmd', numToMove }, i) => {
                let fontRate = 1
                if (typeof label === 'string' && label.length > 4) {
                  fontRate = 4.5 / label.length
                }

                return (
                  <Button
                    key={i}
                    fontSizeRate={fontRate}
                    isVertical={!!showNumbers}
                    onClick={handleClick(handler, command, numToMove)}
                    onTouchEnd={handleClick(handler, command, numToMove)}
                    data-cy={`virtual-keyboard-${dataCy}`}
                  >
                    {isString(label) ? (
                      <CustomKeyLabel value={label} />
                    ) : (
                      <Label>{label}</Label>
                    )}
                  </Button>
                )
              }
            )}
          </Row>
        ))}
      </SymbolsWrapper>
      <NextButton
        onClick={onClickNext}
        onTouchEnd={onClickNext}
        hidden={boards.length <= 0 || current >= boards.length - 1}
        data-cy="nextButton"
      />
    </Container>
  )
}

MainKeyboard.propTypes = {
  btns: PropTypes.array.isRequired,
  onInput: PropTypes.func.isRequired,
  fullKeybord: PropTypes.bool,
}

MainKeyboard.defaultProps = {
  fullKeybord: false,
}

export default MainKeyboard
