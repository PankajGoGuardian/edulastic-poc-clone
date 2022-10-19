import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import configureMockStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import { Router } from 'react-router'
import { createMemoryHistory } from 'history'
import { ResponseFrequencyTable } from '../components/table/responseFrequencyTable'
import {
  storeData,
  tableColumns as columns,
  tableData as data,
} from './testData'

const history = createMemoryHistory()

const mockStore = configureMockStore()
const store = mockStore(storeData)

describe('single assessment report - ResponseFrequency Table', () => {
  test('ResponseFrequency table component visibility ', async () => {
    render(
      <Router history={history}>
        <Provider store={store}>
          <ResponseFrequencyTable
            data={data}
            columns={columns}
            isPrinting={false}
          />
        </Provider>
      </Router>
    )
    const Standards = screen.getByText('Standards')
    expect(Standards).toBeInTheDocument()
    const maxScore = screen.getByText('Max Score')
    expect(maxScore).toBeInTheDocument()
    const performance = screen.getByText('Performance %')
    expect(performance).toBeInTheDocument()
    const skip = screen.getByText('Skip %')
    expect(skip).toBeInTheDocument()
    const response = screen.getByText('Response')
    expect(response).toBeInTheDocument()
  })
  test('verify on click of question the page should land on lcb ', async () => {
    render(
      <Router history={history}>
        <Provider store={store}>
          <ResponseFrequencyTable
            data={data}
            columns={columns}
            isPrinting={false}
          />
        </Provider>
      </Router>
    )
    const question = screen.getAllByText('Q2')
    expect(question[0]).toBeInTheDocument()

    fireEvent.click(question[0])
    expect(history.location.pathname).toBe(
      '/author/classboard/632bd0b912530a0009a88b67/632bcfc9e7d06d0009059cbd/question-activity/32829'
    )
  })
})
