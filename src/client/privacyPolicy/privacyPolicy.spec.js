import '@testing-library/jest-dom'
import React from 'react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import segmentApi from '@edulastic/api/src/segment'
import userApi from '@edulastic/api/src/user'
import PrivacyPolicyModal from './index'

jest.mock('@edulastic/common')
jest.mock('react-redux', () => {
  const { connect, ...restFns } = jest.requireActual('react-redux')
  return {
    connect,
    ...Object.keys(restFns).reduce((acc, cur) => ({
      ...acc,
      [cur]: jest.fn(),
    })),
  }
})

jest.spyOn(userApi, 'eulaPolicyStatusUpdate')

jest.spyOn(segmentApi, 'genericEventTrack')
segmentApi.genericEventTrack = jest.fn()

describe('PrivacyModal component', () => {
  test('rendernormally and button click working', async () => {
    userApi.eulaPolicyStatusUpdate = jest
      .fn()
      .mockReturnValue(Promise.resolve({}))
    const result = render(<PrivacyPolicyModal userID="testUserId" />)
    const acceptButton = result.getByTestId('acceptButton')
    expect(acceptButton).toBeDisabled()
    const checkbox = result.getByTestId('check')
    await userEvent.click(checkbox)
    expect(acceptButton).not.toBeDisabled()
    await userEvent.click(acceptButton)
    expect(userApi.eulaPolicyStatusUpdate).toBeCalled()
  })
})
