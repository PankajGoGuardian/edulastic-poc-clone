import React from 'react'
import { render, cleanup, fireEvent, screen } from '@testing-library/react'
import configureMockStore from 'redux-mock-store'
import { Router } from 'react-router'
import { createMemoryHistory } from 'history'
import CreateAssignmentModal from '../components/Container'
import '@testing-library/jest-dom/extend-expect'
import { SET_SHOW_ASSIGNMENT_CREATION } from '../../Dashboard/ducks'

const mockStore = configureMockStore()
const store = mockStore({})
const history = createMemoryHistory()

const renderComponent = () => {
  render(
    <Router history={history}>
      <CreateAssignmentModal store={store} visible />
    </Router>
  )
}

describe('Testing the CreateAssignmentModal', () => {
  afterEach(() => {
    cleanup()
    store.clearActions()
  })

  it('> Render the CreateAssignmentModal component', () => {
    renderComponent()
  })

  it('> Verify the default element of the modal', () => {
    renderComponent()
    const modalTitle = screen.getByText(/Create assignment/)
    const modalDescription = screen.getByText(/make your assignment/)
    const firstSection = screen.getByText(/Pre-built assessment/)
    const chooseFromLibraryButton = screen.getByText(/Choose from library/)
    const divider = screen.getByText('OR')
    const secondSection = screen.getByText(/Create your own test/)
    const authorATestButton = screen.getByText(/Author a test/)

    expect(modalTitle).toBeInTheDocument()
    expect(modalDescription).toBeInTheDocument()
    expect(firstSection).toBeInTheDocument()
    expect(chooseFromLibraryButton).toBeInTheDocument()
    expect(divider).toBeInTheDocument()
    expect(secondSection).toBeInTheDocument()
    expect(authorATestButton).toBeInTheDocument()
  })

  it('> Verify the actions triggered when the modal is closed', () => {
    renderComponent()
    const closeButton = document.querySelector('.ant-modal-close-x')
    fireEvent.click(closeButton)

    const action = store.getActions()
    expect(action[0].type).toBe(SET_SHOW_ASSIGNMENT_CREATION)
    expect(action[0].payload).toBeFalsy()
    expect(history.location?.pathname).toBe('/') // user is not navigated to any url
  })

  it('> Verify navigation to test library page when clicked on Choose from library', () => {
    renderComponent()
    const chooseFromLibraryButton = screen.getByText(/Choose from library/)
    fireEvent.click(chooseFromLibraryButton)

    const action = store.getActions()
    expect(action[0].type).toBe(SET_SHOW_ASSIGNMENT_CREATION)
    expect(action[0].payload).toBeFalsy()
    expect(history.location?.pathname).toBe('/author/tests')
  })

  it('> Verify navigation to create test page when clicked on Author a test', () => {
    renderComponent()
    const authorATestButton = screen.getByText(/Author a test/)
    fireEvent.click(authorATestButton)

    const action = store.getActions()
    expect(action[0].type).toBe(SET_SHOW_ASSIGNMENT_CREATION)
    expect(action[0].payload).toBeFalsy()
    expect(history.location?.pathname).toBe('/author/tests/select')
  })
})
