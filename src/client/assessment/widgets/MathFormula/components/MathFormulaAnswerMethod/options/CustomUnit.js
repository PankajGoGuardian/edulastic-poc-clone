import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { withTheme } from 'styled-components'
import { MathInput } from '@edulastic/common'

const CustomUnitPure = ({ onChange, customUnits }) => {
  const [keys, updateKeys] = useState(customUnits)
  const [keyboardType, setKeyboardType] = useState([])
  // this will need to restrict special characters in the future.
  // eslint-disable-next-line no-unused-vars
  const onKeyPressHandler = (e) => {
    const isSpecialChar = !(e.key.length > 1 || e.key.match(/[^a-zA-Z,\s]/g))
    const isArrowOrShift =
      (e.keyCode >= 37 && e.keyCode <= 40) ||
      e.keyCode === 16 ||
      e.keyCode === 8
    if (!(isSpecialChar || isArrowOrShift)) {
      const isValidKey = customUnits.includes(e.key)
      if (!isValidKey) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
  }

  const onChangeMathInput = (latex) => {
    updateKeys(latex)
  }

  const onBlurMathHandler = () => {
    onChange('customUnits', keys)
  }

  const handleChangeKeypad = (keyboard) => {
    setKeyboardType([keyboard])
  }

  useEffect(() => {
    updateKeys(customUnits)
  }, [customUnits])

  return (
    <MathInput
      fullWidth
      showDropdown
      value={keys}
      fromCustomUnits
      showResponse={false}
      symbols={keyboardType}
      // onKeyPress={onKeyPressHandler}
      onInput={onChangeMathInput}
      onBlur={onBlurMathHandler}
      onChangeKeypad={handleChangeKeypad}
    />
  )
}

CustomUnitPure.propTypes = {
  onChange: PropTypes.func.isRequired,
  customUnits: PropTypes.func.isRequired,
}

export const CustomUnit = withTheme(CustomUnitPure)
