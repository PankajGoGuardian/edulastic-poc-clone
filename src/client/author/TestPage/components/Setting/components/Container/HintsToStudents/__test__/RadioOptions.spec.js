import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'

import RadioOptions from '../RadioOptions'
import {
  radioOptionTestId as mockRadioOptionTestId,
  penaltyPointsInputTestId,
} from '../constants'

const defaultProps = {
  disabled: false,
  penaltyOnUsingHints: 0,
  updatePenaltyPoint: jest.fn(),
}

jest.mock(
  '../../../../../../../../../../packages/common/src/components/RadioButton',
  () => ({
    __esModule: true,
    RadioBtn: ({ value, checked, onChange, children }) => (
      <span className="ant-radio">
        <input
          type="radio"
          className="ant-radio-input"
          value={value}
          checked={checked}
          onChange={onChange}
          data-testid={mockRadioOptionTestId}
        />
        <span className="ant-radio-inner" />
        <span>{children}</span>
      </span>
    ),
  })
)

describe('testing penalty options in show hints to students section', () => {
  test('it should render two options', () => {
    render(<RadioOptions {...defaultProps} />)
    const options = screen.getAllByTestId(mockRadioOptionTestId)
    expect(options).toHaveLength(2)
  })

  test('radio option 1 should be checked', () => {
    render(<RadioOptions {...defaultProps} />)
    const radioOption = screen.getByDisplayValue('noPenalty')
    expect(radioOption).toBeChecked()
    const radioOption2 = screen.getByDisplayValue('withPenalty')
    expect(radioOption2).not.toBeChecked()
  })

  test('radio option 2 should be checked', () => {
    render(<RadioOptions {...defaultProps} penaltyOnUsingHints={10} />)
    const radioOption = screen.getByDisplayValue('noPenalty')
    expect(radioOption).not.toBeChecked()
    const radioOption2 = screen.getByDisplayValue('withPenalty')
    expect(radioOption2).toBeChecked()
  })

  test('radio1 checked: default, radio2 checked: onClick', () => {
    render(<RadioOptions {...defaultProps} />)
    const radioOption1 = screen.getByDisplayValue('noPenalty')
    expect(radioOption1).toBeChecked()
    const radioOption2 = screen.getByDisplayValue('withPenalty')
    fireEvent.click(radioOption2)
    expect(radioOption2).toBeChecked()
  })

  test('option 2 should render a text input', () => {
    render(<RadioOptions {...defaultProps} />)
    const textInput = screen.getByTestId(penaltyPointsInputTestId)
    expect(textInput).toBeInTheDocument()
    expect(textInput).toBeDisabled()
  })
  test('option 2 should render a text input but disabled', () => {
    render(<RadioOptions {...defaultProps} />)
    const textInput = screen.getByTestId(penaltyPointsInputTestId)
    expect(textInput).toBeInTheDocument()
    expect(textInput).toBeDisabled()
  })

  test('option 2 should render a text input which should not be disabled', () => {
    render(<RadioOptions {...defaultProps} penaltyOnUsingHints={10} />)
    const textInput = screen.getByTestId(penaltyPointsInputTestId)
    expect(textInput).toBeInTheDocument()
    expect(textInput).not.toBeDisabled()
  })
})
