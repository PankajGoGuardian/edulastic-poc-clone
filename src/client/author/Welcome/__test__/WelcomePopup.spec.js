import React from 'react'
import { render, cleanup, fireEvent, screen } from '@testing-library/react'
import configureMockStore from 'redux-mock-store'
import '@testing-library/jest-dom/extend-expect'
import WelcomePopup from '../components/WelcomePopup'
import { SET_SHOW_GET_STARTED, SET_SHOW_WELCOME } from '../../Dashboard/ducks'

const mockStore = configureMockStore()
const storeData = {
  user: {
    user: {
      firstName: 'Test',
      lastName: 'User',
    },
  },
}
const store = mockStore(storeData)

const verifyActions = (actions) => {
  expect(actions[0].type).toBe(SET_SHOW_WELCOME)
  expect(actions[0].payload).toBeFalsy()

  expect(actions[1].type).toBe(SET_SHOW_GET_STARTED)
  expect(actions[1].payload).toBeTruthy()
}
describe('Testing the WelcomePopup', () => {
  afterEach(() => {
    cleanup()
    store.clearActions()
  })

  it('> Render the WelcomePopup component', () => {
    render(<WelcomePopup store={store} isVisible />)
  })

  it('> Verify the user name in the modal', () => {
    const userName = `${storeData.user.user.firstName} ${storeData.user.user.lastName}`
    render(<WelcomePopup store={store} isVisible />)
    const userNameElement = screen.getByText(/Hi there/)
    expect(userNameElement).toHaveTextContent(`Hi there, ${userName}! 👋`)
  })

  it('> Verify Anonymous is displayed when user name is not present', () => {
    const tempStore = mockStore({
      user: {},
    })
    render(<WelcomePopup store={tempStore} isVisible />)
    const userNameElement = screen.getByText(/Hi there/)
    expect(userNameElement).toHaveTextContent(`Hi there, Anonymous! 👋`)
  })

  it('> click on close button and verify actions', () => {
    render(<WelcomePopup store={store} isVisible />)
    const closeButton = document.querySelector('.ant-modal-close-x')
    fireEvent.click(closeButton)
    const actions = store.getActions()
    verifyActions(actions)
  })

  it('> verify modal is closed automatically after 3 seconds', async () => {
    render(<WelcomePopup store={store} isVisible />)
    await new Promise((r) => setTimeout(r, 3500))
    const actions = store.getActions()
    verifyActions(actions)
  })
})
