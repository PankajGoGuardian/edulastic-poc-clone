import React from 'react'
import chunk from 'lodash/chunk'
import { NumberBoardWrapper, Row, Button, Label } from './styled'

const NumberKeyboard = ({ buttons, onInput }) => {
  const rows = chunk(buttons, 3)

  const handleClickNumPad = (item) => (e) => {
    e?.preventDefault()
    if (item.handler && item.command) {
      onInput(item.handler, item.command)
    } else {
      onInput(item.value)
    }
  }

  return (
    <NumberBoardWrapper>
      {rows.map((row, rowIndex) => (
        <Row key={rowIndex} data-cy={`button-row-${rowIndex}`} direction="row">
          {row.map((item, i) => (
            <Button
              key={i}
              onClick={handleClickNumPad(item)}
              onTouchEnd={handleClickNumPad(item)}
              data-cy={`virtual-keyboard-${item.dataCy || item.value}`}
            >
              <Label>{item.label}</Label>
            </Button>
          ))}
        </Row>
      ))}
    </NumberBoardWrapper>
  )
}

export default NumberKeyboard
