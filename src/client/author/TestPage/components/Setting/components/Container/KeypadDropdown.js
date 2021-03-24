import React, { useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { Select } from 'antd'

import { SelectInputStyled } from '@edulastic/common'

import { allKeypadForTestSelector } from '../../../../../../assessment/components/KeyPadOptions/ducks'

const { Option } = Select

const KeypadDropdown = ({
  onChangeHandler,
  allKeyboardsForTest,
  disabled,
  value,
}) => {
  const initialKeypads = useRef(allKeyboardsForTest)

  const getKeypadData = (keypadIdentifier) => {
    const allKeypads = initialKeypads.current
    const hasSameId = (keypad) => keypad._id === keypadIdentifier
    const customKeypadData = allKeypads.find(hasSameId)
    const keypadType = customKeypadData
      ? 'custom'
      : keypadIdentifier === 'item-level-keypad'
      ? 'item-level'
      : 'predefined'
    const keypadValue = customKeypadData || keypadIdentifier

    return { type: keypadType, value: keypadValue, updated: true }
  }

  const handleChange = (identifier) => {
    const keypadData = getKeypadData(identifier)
    onChangeHandler(keypadData)
  }

  useEffect(() => {
    initialKeypads.current = allKeyboardsForTest
  }, [])

  return (
    <SelectInputStyled
      data-cy="test-keypad"
      value={value}
      disabled={disabled}
      onChange={handleChange}
      getPopupContainer={(trigger) => trigger.parentNode}
    >
      {initialKeypads.current.map((keypad) => {
        return (
          <Option
            key={keypad._id || keypad.value}
            value={keypad._id || keypad.value}
          >
            {keypad.label}
          </Option>
        )
      })}
    </SelectInputStyled>
  )
}

export default connect((state) => ({
  allKeyboardsForTest: allKeypadForTestSelector(state),
}))(KeypadDropdown)
