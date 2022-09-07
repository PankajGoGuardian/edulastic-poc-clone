import '@testing-library/jest-dom'
import { screen, render, fireEvent, waitFor } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import configureMockStore from 'redux-mock-store'
import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router'

import OptionDynamicTest from './OptionDynamicTest'

const OptionDynamicTestVisibility = () => {
  const newTag = screen.getByText('New')
  expect(newTag).toBeInTheDocument()

  const title = screen.getByTestId('title')
  expect(title).toBeInTheDocument()

  const createSectionTest = screen.getByText('Create Section Test')
  expect(createSectionTest).toBeInTheDocument()

  const description = screen.getByTestId('description')
  expect(description).toBeInTheDocument()

  const createSectionBtn = screen.getByText('CREATE TEST')
  expect(createSectionBtn).toBeInTheDocument()

  const quickTour = screen.getByText('WATCH QUICK TOUR')
  expect(quickTour).toBeInTheDocument()
}

const history = createMemoryHistory()
const mockStore = configureMockStore()
const store = mockStore({})

describe('OptionDynamicTest', () => {
  test('Check visibility of DynamicTest Card', () => {
    render(
      <Router history={history}>
        <Provider store={store}>
          <OptionDynamicTest />
        </Provider>
      </Router>
    )
    OptionDynamicTestVisibility()
  })

  test('Open modal for quick watch tour', async () => {
    render(
      <Router history={history}>
        <Provider store={store}>
          <OptionDynamicTest />
        </Provider>
      </Router>
    )
    fireEvent.click(screen.getByText('WATCH QUICK TOUR'))
    await waitFor(() =>
      expect(
        screen.getByText('Get Started with SmartBuild')
      ).toBeInTheDocument()
    )
  })
})
