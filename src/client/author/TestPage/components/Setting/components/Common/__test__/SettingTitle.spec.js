import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, within } from '@testing-library/react'

import SettingTitle from '../SettingTitle'
import { settingTitleTestId } from '../constants'

const defaultProps = {
  title: 'Setting Title',
  tooltipTitle: 'Setting tooltip title',
  premium: true,
}

jest.mock(
  '../../../../../../AssignTest/components/Container/DollarPremiumSymbol',
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

jest.mock('antd', () => ({
  ...jest.requireActual('antd'),
  Tooltip: ({ title }) => <p data-testid="tooltip-test-id">{title}</p>,
}))

describe('testing SettingTitle component', () => {
  test('should render SettingTitle component in the view', () => {
    render(<SettingTitle {...defaultProps} />)
    const title = screen.getByTestId(settingTitleTestId)
    expect(title).toBeInTheDocument()
  })

  test('should render correct title passed to SettingTitle component', () => {
    render(<SettingTitle {...defaultProps} />)
    const { getByText } = within(screen.getByTestId(settingTitleTestId))
    expect(getByText(defaultProps.title)).toBeInTheDocument()
  })

  test('should not render premium symbol if premium prop is true', () => {
    render(<SettingTitle {...defaultProps} />)
    const premiumSymbol = screen.queryByText('Premium symbol')
    expect(premiumSymbol).not.toBeInTheDocument()
  })

  test('should render premium symbol if premium prop is false', () => {
    render(<SettingTitle {...defaultProps} premium={false} />)
    const premiumSymbol = screen.queryByText('Premium symbol')
    expect(premiumSymbol).toBeInTheDocument()
  })

  test('should render tooltip', async () => {
    render(<SettingTitle {...defaultProps} />)
    const tooltip = screen.getByTestId('tooltip-test-id')
    expect(tooltip).toBeInTheDocument()
  })
})
