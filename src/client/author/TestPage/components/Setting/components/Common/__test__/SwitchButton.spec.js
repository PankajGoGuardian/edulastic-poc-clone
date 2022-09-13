import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'

import { settingSwitchButtonTestId } from '../constants'
import SwitchButton from '../SwitchButton'

const defaultProps = {
  disabled: false,
  checked: true,
  onChangeHandler: jest.fn(),
}

describe('testing switch button', () => {
  test('should render switch button in the view', () => {
    render(<SwitchButton {...defaultProps} />)
    const switchButton = screen.getByTestId(settingSwitchButtonTestId)
    expect(switchButton).toBeInTheDocument()
  })

  test('switch button should be checked', () => {
    render(<SwitchButton {...defaultProps} checked />)
    const switchButton = screen.getByTestId(settingSwitchButtonTestId)
    expect(switchButton).toBeChecked()
  })

  test('switch button should be unchecked', () => {
    render(<SwitchButton {...defaultProps} checked={false} />)
    const switchButton = screen.getByTestId(settingSwitchButtonTestId)
    expect(switchButton).not.toBeChecked()
  })

  test('switch button should be enabled', () => {
    render(<SwitchButton {...defaultProps} />)
    const switchButton = screen.getByTestId(settingSwitchButtonTestId)
    expect(switchButton).not.toBeDisabled()
  })

  test('switch button should be disbaled', () => {
    render(<SwitchButton {...defaultProps} disabled />)
    const switchButton = screen.getByTestId(settingSwitchButtonTestId)
    expect(switchButton).toBeDisabled()
  })

  test('onChangeHandler should be called on clicking of switch button', () => {
    render(<SwitchButton {...defaultProps} />)
    const switchButton = screen.getByTestId(settingSwitchButtonTestId)
    fireEvent.click(switchButton)
    expect(defaultProps.onChangeHandler).toHaveBeenCalledTimes(1)
  })
})
