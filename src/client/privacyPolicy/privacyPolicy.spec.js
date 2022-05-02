import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import segmentApi from '@edulastic/api/src/segment'
import { userApi } from '@edulastic/api'
import configureMockStore from 'redux-mock-store'
import PrivacyPolicyModal from './index'

const mockStore = configureMockStore()
const store = mockStore({})

jest.spyOn(userApi, 'eulaPolicyStatusUpdate')

jest.spyOn(segmentApi, 'genericEventTrack')
segmentApi.genericEventTrack = jest.fn()

describe('Privacy Policy Modal Component', () => {
  beforeEach(() => {
    jest
      .spyOn(userApi, 'getUserLocation')
      .mockImplementation(() =>
        Promise.resolve({ result: { isEEAUser: true } })
      )
  })
  test('test modal components visibility ', async () => {
    const result = render(<PrivacyPolicyModal store={store} />)
    const moduleTitleElement = screen.getByText(
      'End User License Agreement and Product Privacy Policy'
    )
    expect(moduleTitleElement).toBeInTheDocument()
    const checkBoxTextElement = screen.getByText(
      'By checking the box and clicking “Accept”, I agree to the Terms of Service and End User License Agreement and Privacy Policy of the Product'
    )
    const eulaPolicyContent = result.getByTestId('eulaPolicyContent')
    expect(eulaPolicyContent).toBeInTheDocument()
    const productPrivacyPolicy = result.getByTestId('productPrivacyPolicy')
    expect(productPrivacyPolicy).toBeInTheDocument()
    expect(checkBoxTextElement).toBeInTheDocument()
    const acceptButton = screen.getByTestId('acceptButton')
    expect(acceptButton).toBeDisabled()
    const checkbox = screen.getByTestId('check')
    expect(checkbox).toBeEnabled()
    await waitFor(() => {
      expect(screen.getByTestId('eeaPolicyContent')).toBeInTheDocument()
    })
  })
  test('click checkbox and accept policy', async () => {
    userApi.eulaPolicyStatusUpdate = jest
      .fn()
      .mockReturnValue(Promise.resolve({}))
    const result = render(<PrivacyPolicyModal store={store} />)
    const acceptButton = result.getByTestId('acceptButton')
    expect(acceptButton).toBeDisabled()
    const checkbox = result.getByTestId('check')
    await userEvent.click(checkbox)
    await userEvent.click(acceptButton)
    expect(userApi.eulaPolicyStatusUpdate).toBeCalled()
  })
})
