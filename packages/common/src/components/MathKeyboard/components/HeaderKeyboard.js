import React from 'react'
import styled from 'styled-components'
import { HEADER_BUTTONS } from '../constants/headerButtons'
import { Label } from './styled'

const HeaderKeyboard = ({ onInput }) => {
  const handleClick = (handler, command, numToMove) => (e) => {
    e?.preventDefault()
    if (handler && command) {
      onInput(handler, command, numToMove)
    }
  }

  return (
    <HeaderKeyboardContainer>
      {HEADER_BUTTONS.map(
        ({ label, handler, command = 'cmd', numToMove }, i) => (
          <Button
            key={i}
            onClick={handleClick(handler, command, numToMove)}
            onTouchStart={handleClick(handler, command, numToMove)}
            data-cy={`header-keyboard-${handler}`}
          >
            <Label>{label}</Label>
          </Button>
        )
      )}
    </HeaderKeyboardContainer>
  )
}

export default HeaderKeyboard

const HeaderKeyboardContainer = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 8px 24px 0px;
`

const Button = styled.div`
  padding: 8px;
  padding-bottom: 0px;
  cursor: pointer;
  user-select: none;
`
