import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import StandardsModal from '../StandardsModal'
import { themes } from '../../../../theme'

jest.mock('../PopupRowSelect', () => () => <div data-testid="PopupRowSelect" />)

describe('StandardModal Component', () => {
  test('StandardModal', async () => {
    render(
      <ThemeProvider theme={themes.default}>
        <StandardsModal visible />
      </ThemeProvider>
    )
    const heading = screen.getByText('Select Standards for This Question')
    expect(heading).toBeInTheDocument()
    const popupRowSelect = screen.getByTestId('PopupRowSelect')
    expect(popupRowSelect).toBeInTheDocument()
    const cancel = screen.getByText('CANCEL')
    expect(cancel).toBeInTheDocument()
    const apply = screen.getByText('APPLY')
    expect(apply).toBeInTheDocument()
  })
})
