import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import Dashboard from '../components/Dashboard'

jest.mock('../components/Header/Header', () => () => (
  <div data-testid="headerSection" />
))
jest.mock('../components/Showcase/showcase', () => () => (
  <div data-testid="mainContent" />
))

const mockStore = configureMockStore()

describe('Dashboard component', () => {
  test('test should render header and maincontent component when rendering Dashboard component', async () => {
    const store = mockStore({
      user: { user: { _id: 'id ' } },
    })
    render(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    )
    expect(screen.getByTestId('headerSection')).toBeInTheDocument()
    expect(screen.getByTestId('mainContent')).toBeInTheDocument()
  })
  test('test should render spin if no user id found in state when rendering Dashboard component', async () => {
    const store = mockStore({
      user: { user: {} },
    })
    render(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    )
    expect(
      document.querySelector('[class="ant-spin-dot-item"]')
    ).toBeInTheDocument()
  })
})
