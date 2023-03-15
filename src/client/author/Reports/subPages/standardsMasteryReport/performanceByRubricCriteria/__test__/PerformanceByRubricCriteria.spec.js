import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router'
import configureMockStore from 'redux-mock-store'
import PerformanceByRubricCriteria from '..'
import { reportChartData, reportTableData, settings } from './testData'

const mockStore = configureMockStore()
const store = mockStore({
  reportReducer: {
    reportPerformanceByRubricsCriteriaReducer: {
      reportChartData,
      reportTableData,
      error: '',
      loadingReportChartData: false,
      loadingReportTableData: false,
    },
    reports: {
      isCsvDownloading: false,
    },
  },
})

jest.mock('../components/table/performanceByRubricCriteriaTable', () => () => (
  <div data-testid="table" />
))

jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts')
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }) => (
      <OriginalModule.ResponsiveContainer width={800} height={800}>
        {children}
      </OriginalModule.ResponsiveContainer>
    ),
  }
})

const history = createMemoryHistory()

describe('Performance by Rubric Criteria report', () => {
  beforeEach(() => {
    render(
      <Router history={history}>
        <Provider store={store}>
          <PerformanceByRubricCriteria settings={settings} />
        </Provider>
      </Router>
    )
  })
  test('Report visibilty', () => {
    const title = screen.getByText('Performance by Rubric criteria')
    expect(title).toBeInTheDocument()
    const description = screen.getByTestId('description')
    expect(description).toBeInTheDocument()
    const table = screen.getByTestId('table')
    expect(table).toBeInTheDocument()
  })

  test('Chart Visibility', () => {
    const chartSurface = document.querySelector(
      '.recharts-responsive-container'
    )
    expect(chartSurface).toBeInTheDocument()
    const yAxisLabel = screen.getByText('DISTRIBUTION OF RESPONSES')
    expect(yAxisLabel).toBeInTheDocument()
    const criteria = screen.getByText('Content')
    expect(criteria).toBeInTheDocument()
  })

  test('tooltip should be visible on hovering over x-axis label', async () => {
    const criteria = screen.getByText('Content')
    fireEvent.mouseOver(criteria)
    await waitFor(() => {
      const tooltip = screen.getByTestId('xAxis-tooltip')
      expect(tooltip.innerHTML).toBe('Content')
    })
  })
})
