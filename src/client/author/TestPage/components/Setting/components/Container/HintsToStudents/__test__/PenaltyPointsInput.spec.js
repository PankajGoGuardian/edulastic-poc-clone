import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'

import { penaltyPointsInputTestId } from '../constants'
import PenaltyPointsInput from '../PenaltyPointsInput'

const defaultProps = {
  penaltyOnUsingHints: 1,
  disabled: false,
  updatePenaltyPoints: jest.fn(),
}

describe('testing penalty points input', () => {
  test('it should render a text input', () => {
    render(<PenaltyPointsInput {...defaultProps} />)
    const input = screen.getByTestId(penaltyPointsInputTestId)
    expect(input).toBeInTheDocument()
  })

  test('it should render with value one', () => {
    render(<PenaltyPointsInput {...defaultProps} />)
    const input = screen.getByTestId(penaltyPointsInputTestId)
    expect(input).toHaveValue(1)
  })

  test('it should change value on input', () => {
    render(<PenaltyPointsInput {...defaultProps} />)
    const input = screen.getByTestId(penaltyPointsInputTestId)
    fireEvent.change(input, { target: { value: '10' } })
    expect(defaultProps.updatePenaltyPoints).toHaveBeenCalledWith(10)
  })
})
