import React, { useMemo } from 'react'
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

function KeypadDropdown({
  keypadData,
  customKeypads,
  overrideSettings,
  testKeypadData,
  disabled,
}) {
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

  /**
   * if test is shared to a free user, he cannot edit the keypad from dropdown
   * but it should display the test keypad label correctly in the dropdown
   * so if keypad is not already available in custom keypads
   * we need this to show label correctly, else it would end up showing id
   */
  const testKeypad = useMemo(() => {
    if (
      testKeypadData?.type === 'custom' &&
      isPlainObject(testKeypadData?.value)
    ) {
      // to avoid duplication in user custom keypads
      const alreadyIncluded = customKeypads.some(
        (keypad) => keypad?._id === testKeypadData.value._id
      )
      if (!alreadyIncluded) {
        return testKeypadData.value
      }
    }
  }, [testKeypadData])

  const handleChange = (value) => {
    const customKeypadIndex = customKeypads.findIndex(
      (keypad) => keypad._id === value
    )
    if (customKeypadIndex !== -1) {
      overrideSettings('keypad', {
        type: 'custom',
        value: customKeypads[customKeypadIndex],
        updated: true,
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
        updated: true,
      })
      return
    }
    if (testKeypadData?.value?._id === value) {
      overrideSettings('keypad', {
        type: 'custom',
        value: testKeypadData.value,
        updated: true,
      })
    }
  }

  return (
    <StyledSelectContainer>
      <SelectInputStyled
        data-cy="key-pad-option"
        value={keypadDropdownValue}
        onChange={handleChange}
        getPopupContainer={(triggerNode) => triggerNode.parentNode}
        disabled={disabled}
      >
        {predefinedKeypads.map((keypad) => (
          <Select.Option key={keypad.label} value={keypad.value}>
            {keypad.label}
          </Select.Option>
        ))}
        {testKeypad && (
          <Select.Option value={testKeypad._id}>
            {testKeypad.label}
          </Select.Option>
        )}
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
