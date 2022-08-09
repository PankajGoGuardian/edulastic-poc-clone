import React from 'react'
import { render, cleanup, fireEvent, screen } from '@testing-library/react'
import configureMockStore from 'redux-mock-store'
import GetStartedModal from '../components/GetStarted'
import {
  SET_SHOW_GET_STARTED,
  SET_SHOW_JOIN_SCHOOL,
} from '../../Dashboard/ducks'

const mockStore = configureMockStore()
const store = mockStore({})

describe('Testing the GetStartedModal', () => {
  afterEach(() => {
    cleanup()
    store.clearActions()
  })

  it('> Render the GetStartedModal component', () => {
    render(<GetStartedModal store={store} isVisible />)
  })

  it('> should have all the default buttons and texts', () => {
    render(<GetStartedModal store={store} isVisible />)
    const modalTitle = screen.getByText(/Let's get started/)
    const modalDiscription = screen.getByText(/easy steps/)
    const nextButton = screen.getByRole('button', { name: 'Next' })
    const closeButton = document.querySelector('.ant-modal-close-x')

    expect(modalTitle).toBeDefined()
    expect(modalDiscription).toBeDefined()
    expect(nextButton).toBeDefined()
    expect(closeButton).toBeDefined()
  })

  it('> verify actions triggered when clicked on close button', () => {
    render(<GetStartedModal store={store} isVisible />)
    const closeButton = document.querySelector('.ant-modal-close-x')
    fireEvent.click(closeButton)
    const actions = store.getActions()
    expect(actions[0].type).toBe(SET_SHOW_GET_STARTED)
    expect(actions[0].payload).toBeFalsy()

    expect(actions[1]).toBeUndefined()
  })

  it('> verify actions triggered when clicked on next button', () => {
    render(<GetStartedModal store={store} isVisible />)
    const nextButton = screen.getByRole('button', { name: 'Next' })
    fireEvent.click(nextButton)
    const actions = store.getActions()
    expect(actions[0].type).toBe(SET_SHOW_GET_STARTED)
    expect(actions[0].payload).toBeFalsy()

    expect(actions[1].type).toBe(SET_SHOW_JOIN_SCHOOL)
    expect(actions[1].payload).toBeTruthy()
  })
})
