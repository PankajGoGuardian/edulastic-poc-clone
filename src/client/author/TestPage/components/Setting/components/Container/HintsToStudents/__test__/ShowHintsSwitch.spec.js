import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'

import { hintsSwitchTestId } from '../constants'
import ShowHintsSwitch from '../ShowHintsSwitch'

const defaultProps = {
  disabled: false,
  checked: true,
  onChangeHandler: jest.fn(),
}

describe('testing show hints switch', () => {
  test('switch should be checked', () => {
    render(<ShowHintsSwitch {...defaultProps} checked />)
    const _switch = screen.getByTestId(hintsSwitchTestId)
    expect(_switch).toBeChecked()
  })

  test('switch should be unchecked: checked=false', () => {
    render(<ShowHintsSwitch {...defaultProps} checked={false} />)
    const _switch = screen.getByTestId(hintsSwitchTestId)
    expect(_switch).not.toBeChecked()
  })

  test('switch should be disbaled', () => {
    render(<ShowHintsSwitch {...defaultProps} disabled />)
    const _switch = screen.getByTestId(hintsSwitchTestId)
    expect(_switch).toBeDisabled()
  })

  test('updateShowHints should be called on clicking', () => {
    render(<ShowHintsSwitch {...defaultProps} />)
    const _switch = screen.getByTestId(hintsSwitchTestId)
    fireEvent.click(_switch)
    expect(defaultProps.onChangeHandler).toHaveBeenCalledTimes(1)
  })
})
