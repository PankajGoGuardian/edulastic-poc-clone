import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import configureMockStore from 'redux-mock-store'
import { REQUEST_NEW_PASSWORD_REQUEST } from '../ducks'
import { ForgotPasswordPopup } from '../components/forgotPasswordPopup'

const mockStore = configureMockStore()
describe('Test ForgotPasswordPopup with both wrong attempt and forgot password', () => {
  it('test #Password attempt exceeded popup', async () => {
    const store = mockStore({
      user: {
        requestingNewPassword: false,
        requestNewPasswordSuccess: false,
        tooManyAttempt: true,
      },
    })
    render(<ForgotPasswordPopup visible store={store} />)
    const moduleTitleElement = screen.getByText('Password attempt exceeded')
    expect(moduleTitleElement).toBeInTheDocument()
    const inputElement = screen.getByTestId('email-input')
    fireEvent.change(inputElement, { target: { value: 'dummy@dummy.com' } })
    const acceptButton = screen.getByTestId('send-reset')
    await userEvent.click(acceptButton)
    expect(store.getActions()[1].type).toEqual(REQUEST_NEW_PASSWORD_REQUEST)
  })
  it('test #Forgot password popup', async () => {
    const store = mockStore({
      user: {
        requestingNewPassword: false,
        requestNewPasswordSuccess: false,
        tooManyAttempt: false,
      },
    })
    render(<ForgotPasswordPopup visible store={store} />)
    const moduleTitleElement = screen.getByText('Forgot Password')
    expect(moduleTitleElement).toBeInTheDocument()
    const inputElement = screen.getByTestId('email-input')
    fireEvent.change(inputElement, { target: { value: 'dummy@dummy.com' } })
    const acceptButton = screen.getByTestId('send-reset')
    await userEvent.click(acceptButton)
    expect(store.getActions()[1].type).toEqual(REQUEST_NEW_PASSWORD_REQUEST)
  })
})
