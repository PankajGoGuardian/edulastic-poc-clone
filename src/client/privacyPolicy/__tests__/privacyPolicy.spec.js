import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import segmentApi from '@edulastic/api/src/segment'
import { userApi } from '@edulastic/api'
import configureMockStore from 'redux-mock-store'
import PrivacyPolicyModal from '../index'

const mockStore = configureMockStore()
const store = mockStore({})

jest.mock('../../../../packages/api/src/utils/API')

jest.spyOn(userApi, 'eulaPolicyStatusUpdate')

jest.spyOn(segmentApi, 'genericEventTrack')
segmentApi.genericEventTrack = jest.fn()

const componentsVisibility = () => {
  const moduleTitleElement = screen.getByText(
    'End User License Agreement and Product Privacy Policy'
  )
  expect(moduleTitleElement).toBeInTheDocument()
  const checkBoxTextElement = screen.getByText(
    'By checking the box and clicking “Accept”, I agree to the Terms of Service and End User License Agreement and Privacy Policy of the Product'
  )
  const eulaPolicyContent = screen.getByTestId('eulaPolicyContent')
  expect(eulaPolicyContent).toBeInTheDocument()
  const productPrivacyPolicy = screen.getByTestId('productPrivacyPolicy')
  expect(productPrivacyPolicy).toBeInTheDocument()
  expect(checkBoxTextElement).toBeInTheDocument()
  const acceptButton = screen.getByTestId('acceptButton')
  expect(acceptButton).toBeDisabled()
  const checkbox = screen.getByTestId('check')
  expect(checkbox).toBeEnabled()
}

const acceptPolicy = async () => {
  userApi.eulaPolicyStatusUpdate = jest
    .fn()
    .mockReturnValue(Promise.resolve({}))
  render(<PrivacyPolicyModal store={store} />)
  const acceptButton = screen.getByTestId('acceptButton')
  expect(acceptButton).toBeDisabled()
  const checkbox = screen.getByTestId('check')
  await userEvent.click(checkbox)
  await userEvent.click(acceptButton)
  expect(userApi.eulaPolicyStatusUpdate).toBeCalled()
}

describe('Privacy Policy Modal Non EEA USER', () => {
  beforeEach(() => {
    jest
      .spyOn(userApi, 'getUserLocation')
      .mockReturnValueOnce(Promise.resolve({ result: {} }))
  })
  test('test modal components visibility ', async () => {
    await waitFor(() => {
      render(<PrivacyPolicyModal store={store} />)
    })
    componentsVisibility()
    const eeaPolicyContent = screen.queryByTestId('eeaPolicyContent')
    expect(eeaPolicyContent).toBeNull()
  })
  test('click checkbox and accept policy', async () => {
    acceptPolicy()
  })
})

describe('privacy Policy Modal EEA USER', () => {
  beforeEach(() => {
    jest
      .spyOn(userApi, 'getUserLocation')
      .mockReturnValueOnce(Promise.resolve({ result: { isEEAUser: true } }))
  })
  test('test modal components visibility with eeaPolicyContent ', async () => {
    render(<PrivacyPolicyModal store={store} />)
    componentsVisibility()
    await waitFor(() => {
      expect(screen.getByTestId('eeaPolicyContent')).toBeInTheDocument()
    })
  })
  test('click checkbox and accept policy', async () => {
    acceptPolicy()
  })
})
