import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

import TitleSection from '../Title'
import { titleComponentTestId, hintsSwitchTestId } from '../constants'

const defaultProps = {
  showHintsToStudents: true,
  updateShowHints: jest.fn(),
  disabled: false,
}

describe('testing show hints to students title section', () => {
  test('title section should render', () => {
    render(<TitleSection {...defaultProps} />)
    const title = screen.getByTestId(titleComponentTestId)
    expect(title).toBeInTheDocument()
  })

  test('title section should render along with switch', () => {
    render(<TitleSection {...defaultProps} />)
    const title = screen.getByTestId(titleComponentTestId)
    const _switch = screen.getByTestId(hintsSwitchTestId)
    expect(title).toBeInTheDocument()
    expect(_switch).toBeInTheDocument()
  })
})
