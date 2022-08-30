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

jest.mock(
  '../../../../../../../AssignTest/Components/Container/DollarPremiumSymbol',
  () => ({
    __esModule: true,
    default: ({ premium }) => {
      if (premium) {
        return null
      }
      return <span data-testid="premium-dollar-symbol">Premium symbol</span>
    },
  })
)

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
