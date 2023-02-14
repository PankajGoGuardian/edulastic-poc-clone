import '@testing-library/jest-dom'
import React from 'react'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { Provider } from 'react-redux'
import { createMemoryHistory } from 'history'
import configureMockStore from 'redux-mock-store'
import { Router } from 'react-router-dom'

import { PreVsPostTable } from '../components/Table'
import { selectedPerformanceBand, tableFilters, tableData } from './testData'
import { analyseByOptions, compareByOptions } from '../utils'

const history = createMemoryHistory()

const mockStore = configureMockStore()
const store = mockStore({
  reportReducer: {
    reports: {
      isPrinting: false,
      isSharing: false,
      isCsvDownloading: false,
    },
  },
})

jest.mock('../../../../common/components/tables/CsvTable', () => () => (
  <div data-testid="csvTable" />
))

const renderComponent = () => {
  render(
    <Router history={history}>
      <Provider store={store}>
        <PreVsPostTable
          dataSource={tableData}
          selectedTableFilters={tableFilters}
          selectedPerformanceBand={selectedPerformanceBand}
          compareByOptions={compareByOptions}
          analyseByOptions={analyseByOptions}
          setTableFilters={() => {}}
          handleAddToGroupClick={() => {}}
          isCsvDownloading={false}
        />
      </Provider>
    </Router>
  )
}

describe('Pre Vs Post Table', () => {
  afterEach(() => {
    cleanup()
    store.clearActions()
  })
  test('table component and section title visiblity', () => {
    renderComponent()
    const table = screen.getByTestId('csvTable')
    expect(table).toBeInTheDocument()
    const sectionTitle = screen.getByText('Performance Change By Class')
    expect(sectionTitle).toBeInTheDocument()
  })
  describe('table filters', () => {
    test('compare by dropdown visibiltiy, verify display of compare by options dropdown on click of dropdown', async () => {
      renderComponent()
      const compareBy = screen.getByText('Compare By Class')
      expect(compareBy).toBeInTheDocument()
      fireEvent.click(compareBy)
      await waitFor(() => {
        const compareByStudent = screen.getByText('Student')
        expect(compareByStudent).toBeInTheDocument()
      })
    })
    test('analyze by dropdown visibiltiy, verify display of analyze by options dropdown on click of dropdown', async () => {
      renderComponent()
      const analyzeBy = screen.getByText('Analyse By Score %')
      expect(analyzeBy).toBeInTheDocument()
      fireEvent.click(analyzeBy)
      await waitFor(() => {
        const analyseByRawScore = screen.getByText('Raw Score')
        expect(analyseByRawScore).toBeInTheDocument()
      })
    })
  })
})
