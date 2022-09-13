import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, within } from '@testing-library/react'

import SettingDescription from '../SettingDescription'
import { settingDescriptionTestId } from '../constants'

const defaultProps = {
  description: 'Setting description',
  isSmallSize: 1,
  padding: '0',
  marginTop: '10px',
  marginBottom: '20px',
}

describe('testing SettingDescription component', () => {
  test('should render SettingDescription component in the view', () => {
    render(<SettingDescription {...defaultProps} />)
    const description = screen.getByTestId(settingDescriptionTestId)
    expect(description).toBeInTheDocument()
  })

  test('setting description section should render correct description passed as props', () => {
    render(<SettingDescription {...defaultProps} />)
    const { getByText } = within(screen.getByTestId(settingDescriptionTestId))
    expect(getByText(defaultProps.description)).toBeInTheDocument()
  })
})
