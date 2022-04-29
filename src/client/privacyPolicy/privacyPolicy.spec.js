import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import segmentApi from '@edulastic/api/src/segment'
import { userApi } from '@edulastic/api'
import configureMockStore from 'redux-mock-store'
import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import PrivacyPolicyModal from './index'

configure({ adapter: new Adapter() })

const mockStore = configureMockStore()
const store = mockStore({})

jest.spyOn(userApi, 'eulaPolicyStatusUpdate')

jest.spyOn(segmentApi, 'genericEventTrack')
segmentApi.genericEventTrack = jest.fn()

describe('Privacy Policy Modal Component', () => {
  test('test modal visibiltiy ', () => {
    const result = render(<PrivacyPolicyModal store={store} />)
    const moduleTitleElement = result.getByText(
      'End User License Agreement and Product Privacy Policy'
    )
    expect(moduleTitleElement).toBeInTheDocument()
    const checkBoxTextElement = screen.getByText(
      'By checking the box and clicking “Accept”, I agree to the Terms of Service and End User License Agreement and Privacy Policy of the Product'
    )
    expect(checkBoxTextElement).toBeInTheDocument()
    const acceptButton = result.getByTestId('acceptButton')
    expect(acceptButton).toBeDisabled()
    const checkbox = result.getByTestId('check')
    expect(checkbox).toBeEnabled()
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
