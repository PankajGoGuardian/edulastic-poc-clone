import React, { useEffect, useMemo, useRef } from 'react'
import { TextInputStyled } from '@edulastic/common'

function setCaretPosition(ctrl) {
  const caretPos = (ctrl.value?.length || 0) - 2
  if (caretPos >= 0 && ctrl.selectionEnd > caretPos) {
    if (ctrl.setSelectionRange) {
      ctrl.setSelectionRange(caretPos, caretPos)
      // ctrl.focus()
    } else if (ctrl.createTextRange) {
      const range = ctrl.createTextRange()
      range.collapse(true)
      range.moveEnd('character', caretPos)
      range.moveStart('character', caretPos)
      range.select()
    }
  }
}

const RadianInput = ({ name, value, onChange, onBlur }) => {
  const inputRef = useRef()

  const handleChange = (evt) => {
    onChange({
      target: {
        value: (evt.target.value || '').replace(' π', ''),
        name: evt.target.name,
      },
    })
  }

  const handleBlur = (evt) => {
    onBlur({
      target: {
        value: (evt.target.value || '').replace(' π', ''),
        name: evt.target.name,
      },
    })
  }

  const handleClick = (evt) => {
    setCaretPosition(evt.target)
  }

  const handleKeyUp = (evt) => {
    const code = evt.which || evt.keyCode
    if (code === 39) {
      setCaretPosition(evt.target)
    }
  }

  const valueToRender = useMemo(() => {
    if (!value) {
      return ''
    }
    return `${value} π`
  }, [value])

  useEffect(() => {
    if (inputRef.current?.input) {
      setCaretPosition(inputRef.current?.input)
    }
  }, [value])

  return (
    <TextInputStyled
      type="text"
      name={name}
      value={valueToRender}
      onChange={handleChange}
      onBlur={handleBlur}
      onClick={handleClick}
      onKeyUp={handleKeyUp}
      disabled={false}
      inputRef={inputRef}
      height="35px"
      align="center"
      padding="0px 4px"
    />
  )
}

export default RadianInput
