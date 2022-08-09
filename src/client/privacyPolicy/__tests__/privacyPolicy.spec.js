import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import segmentApi from '@edulastic/api/src/segment'
import { userApi } from '@edulastic/api'
import configureMockStore from 'redux-mock-store'
import { act } from 'react-dom/test-utils'
import PrivacyPolicyModal from '../index'
import { SET_SHOW_WELCOME } from '../../author/Dashboard/ducks'

const mockStore = configureMockStore()
const store = mockStore({
  user: {
    user: {
      features: {},
    },
  },
})

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

const clickOnAcceptButton = async () => {
  const acceptButton = screen.getByTestId('acceptButton')
  expect(acceptButton).toBeDisabled()
  const checkbox = screen.getByTestId('check')

  await act(async () => {
    await fireEvent.click(checkbox)
    await fireEvent.click(acceptButton)
  })
}

const acceptPolicy = async () => {
  userApi.eulaPolicyStatusUpdate = jest
    .fn()
    .mockReturnValue(Promise.resolve({}))
  render(<PrivacyPolicyModal store={store} />)
  await clickOnAcceptButton()
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

describe('Validate actions after accepting the privacy policy', () => {
  beforeEach(() => {
    jest
      .spyOn(userApi, 'getUserLocation')
      .mockReturnValueOnce(Promise.resolve({ result: {} }))
    userApi.eulaPolicyStatusUpdate = jest
      .fn()
      .mockReturnValue(Promise.resolve({}))
  })
  test('> the action for welcome modal should be triggered for teacher', async () => {
    const tempStore = mockStore({
      user: {
        user: {
          openIdProvider: '',
          features: {},
        },
      },
    })
    render(<PrivacyPolicyModal store={tempStore} userRole="teacher" />)
    await clickOnAcceptButton()
    expect(SET_SHOW_WELCOME).toBe(tempStore.getActions()[1].type)
  })

  test('> the action for welcome modal should not be triggered for cli teacher', async () => {
    const tempStore = mockStore({
      user: {
        user: {
          openIdProvider: 'cli',
          features: {},
        },
      },
    })
    render(<PrivacyPolicyModal store={tempStore} userRole="teacher" />)
    await clickOnAcceptButton()
    expect(tempStore.getActions()[1]).toBeUndefined()
  })

  test('> the action for welcome modal should not be triggered for publisher', async () => {
    const tempStore = mockStore({
      user: {
        user: {
          openIdProvider: '',
          features: {
            isPublisherAuthor: true,
            isCurator: false,
          },
        },
      },
    })
    render(<PrivacyPolicyModal store={tempStore} userRole="teacher" />)
    await clickOnAcceptButton()
    expect(tempStore.getActions()[1]).toBeUndefined()
  })

  test('> the action for welcome modal should not be triggered for curator', async () => {
    const tempStore = mockStore({
      user: {
        user: {
          openIdProvider: '',
          features: {
            isPublisherAuthor: false,
            isCurator: true,
          },
        },
      },
    })
    render(<PrivacyPolicyModal store={tempStore} userRole="district-admin" />)
    await clickOnAcceptButton()
    expect(tempStore.getActions()[1]).toBeUndefined()
  })
})
