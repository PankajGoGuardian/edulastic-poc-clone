import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'
import configureMockStore from 'redux-mock-store'
import { Router } from 'react-router'
import { Provider } from 'react-redux'
import { createMemoryHistory } from 'history'
import StandardsSelect from '../StandardsSelect'

const history = createMemoryHistory()

const mockStore = configureMockStore()
const store = mockStore({
  dictionaries: {
    curriculums: { curriculums: [] },
    standards: { data: [] },
  },
})

jest.mock('../StandardsModal', () => () => (
  <div data-testid="standards-modal" />
))

describe('StandardsSelect Component', () => {
  test('standard select', async () => {
    render(
      <Router history={history}>
        <Provider store={store}>
          <StandardsSelect preventInput />
        </Provider>
      </Router>
    )

    const text = screen.getByText('Select Standards')
    expect(text).toBeInTheDocument()
    const standardsModal = screen.getByTestId('standards-modal')
    expect(standardsModal).toBeInTheDocument()
  })
})
