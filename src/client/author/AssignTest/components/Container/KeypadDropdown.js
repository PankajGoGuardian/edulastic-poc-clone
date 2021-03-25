import React, { useEffect, useRef, useMemo } from 'react'
import { Select } from 'antd'
import { connect } from 'react-redux'
import isPlainObject from 'lodash/isPlainObject'
import isEmpty from 'lodash/isEmpty'

import { SelectInputStyled } from '@edulastic/common'
import { math } from '@edulastic/constants'

import { StyledSelectContainer } from '../../../../assessment/components/KeyPadOptions/styled/StyledSelectContainer'
import { customKeypadSelector } from '../../../../assessment/components/KeyPadOptions/ducks'

const { symbols } = math
const predefinedKeypads = [
  ...symbols,
  { value: 'item-level', label: 'Keypad set at item level' },
]

function KeypadDropdown({ keypadData, customKeypads, overrideSettings }) {
  const initialTestKeypad = useRef()

  useEffect(() => {
    if (isPlainObject(keypadData?.value)) {
      initialTestKeypad.current = keypadData
    }
  }, [])

  const keypadDropdownValue = useMemo(() => {
    if (isEmpty(keypadData) || keypadData?.type === 'item-level') {
      // for assignments with old test or new assignments with item level keypad
      return 'item-level'
    }
    if (keypadData.type === 'custom') {
      return keypadData.value?._id
    }

    return keypadData.value
  }, [keypadData])

  const handleChange = (value) => {
    const customKeypadIndex = customKeypads.findIndex(
      (keypad) => keypad._id === value
    )
    if (customKeypadIndex !== -1) {
      overrideSettings('keypad', {
        type: 'custom',
        value: customKeypads[customKeypadIndex],
        update: true,
      })
      return
    }

    const predefinedIndex = predefinedKeypads.findIndex(
      (keypad) => keypad.value === value
    )
    if (predefinedIndex !== -1) {
      overrideSettings('keypad', {
        type: 'predefined',
        value: predefinedKeypads[predefinedIndex].value,
        update: true,
      })
      return
    }
    if (initialTestKeypad.current?.value?._id === value) {
      overrideSettings('keypad', {
        type: 'custom',
        value: initialTestKeypad.current.value,
        updated: true,
      })
    }
  }

  return (
    <StyledSelectContainer>
      <SelectInputStyled
        defaultValue={keypadDropdownValue}
        onChange={handleChange}
        getPopupContainer={(triggerNode) => triggerNode.parentNode}
      >
        {predefinedKeypads.map((keypad) => (
          <Select.Option key={keypad.label} value={keypad.value}>
            {keypad.label}
          </Select.Option>
        ))}
        {customKeypads.length > 0 && (
          <Select.OptGroup label="My custom keypads">
            {customKeypads.map((keypad) => (
              <Select.Option key={keypad._id} value={keypad._id}>
                {keypad.label}
              </Select.Option>
            ))}
          </Select.OptGroup>
        )}
      </SelectInputStyled>
    </StyledSelectContainer>
  )
}

export default connect((state) => ({
  customKeypads: customKeypadSelector(state),
}))(KeypadDropdown)
