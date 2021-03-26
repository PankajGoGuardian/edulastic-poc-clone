import React, { useEffect, useMemo, useRef } from 'react'
import { connect } from 'react-redux'
import { Select } from 'antd'
import isPlainObject from 'lodash/isPlainObject'

import { SelectInputStyled } from '@edulastic/common'
import { math } from '@edulastic/constants'

import {
  customKeypadSelector,
  testKeypadSelector,
} from '../../../../../../assessment/components/KeyPadOptions/ducks'
import { StyledSelectContainer } from '../../../../../../assessment/components/KeyPadOptions/styled/StyledSelectContainer'

const KeypadDropdown = ({
  onChangeHandler,
  disabled,
  value,
  testKeypad,
  customKeypads,
}) => {
  const initialTestKeypad = useRef()

  useEffect(() => {
    initialTestKeypad.current = testKeypad
  }, [])

  const predefinedKeypads = useMemo(() => {
    const keypadList = [
      ...math.symbols,
      {
        type: 'item-level',
        value: 'item-level-keypad',
        label: 'Keypad set at item level',
      },
    ]

    if (isPlainObject(initialTestKeypad.current)) {
      const sameId = (obj) => obj._id === initialTestKeypad.current._id
      const includedInCustom = customKeypads.find(sameId)
      if (!includedInCustom) {
        keypadList.push(initialTestKeypad.current)
      }
    }

    return keypadList
  }, [customKeypads])

  const allKeypadsInTest = useMemo(() => {
    return predefinedKeypads.concat(customKeypads)
  }, [predefinedKeypads, customKeypads])

  const getKeypadData = (keypadIdentifier) => {
    const hasSameId = (keypad) => keypad._id === keypadIdentifier
    const customKeypadData = allKeypadsInTest.find(hasSameId)
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

  return (
    <StyledSelectContainer hasCustomKeypads={customKeypads.length > 0}>
      <SelectInputStyled
        data-cy="test-keypad"
        value={value}
        disabled={disabled}
        onChange={handleChange}
        getPopupContainer={(trigger) => trigger.parentNode}
      >
        {predefinedKeypads.map((keypad) => {
          return (
            <Select.Option
              key={keypad._id || keypad.value}
              value={keypad._id || keypad.value}
            >
              {keypad.label}
            </Select.Option>
          )
        })}
        {customKeypads.length > 0 && (
          <Select.OptGroup label="My Custom Keypads">
            {customKeypads.map((keypad) => {
              return (
                <Select.Option
                  key={keypad._id || keypad.value}
                  value={keypad._id || keypad.value}
                >
                  {keypad.label}
                </Select.Option>
              )
            })}
          </Select.OptGroup>
        )}
      </SelectInputStyled>
    </StyledSelectContainer>
  )
}

export default connect((state) => ({
  customKeypads: customKeypadSelector(state),
  testKeypad: testKeypadSelector(state),
}))(KeypadDropdown)
