import '@testing-library/jest-dom'
import { screen, render } from '@testing-library/react'
import configureMockStore from 'redux-mock-store'
import { createMemoryHistory } from 'history'
import { Router } from 'react-router'
import { Provider } from 'react-redux'
import React from 'react'
import PeerPerformance from '../../index'
import { metricInfo, settings, filters, initialState } from './testData'

const peerPerformanceTextVisibility = () => {
  const compareBy = screen.getByText('Compare by School')
  expect(compareBy).toBeInTheDocument()

  const analyseBy = screen.getByText('Analyze by Score (%)')
  expect(analyseBy).toBeInTheDocument()

  const peerPerformanceTable = screen.getByTestId('peerPerformanceTable')
  expect(peerPerformanceTable).toBeInTheDocument()

  const stackedBarChart = screen.getByTestId('barChart')
  expect(stackedBarChart).toBeInTheDocument()
}

const mockStore = configureMockStore()
const history = createMemoryHistory()

const state = initialState

describe('PeerPerformance component', () => {
  test('test should render "No data available currently" info text when metricInfo has no data', async () => {
    const store = mockStore({ ...state })
    render(
      <Router history={history}>
        <Provider store={store}>
          <PeerPerformance
            settings={{
              selectedTest: { _id: 'id', title: 'title' },
              requestFilters: { termId: 'termId' },
            }}
            toggleFilter={() => {}}
          />
        </Provider>
      </Router>
    )
    expect(screen.getByText('No data available currently.'))
  })
  test('test component visibility when metricInfo contains data', async () => {
    const store = mockStore({
      ...state,
      reportReducer: {
        reportPeerPerformanceReducer: {
          peerPerformance: {
            meta: {
              test: {
                _id: 'id',
                title: 'title',
              },
            },
            districtAvg: 0,
            districtAvgPerf: 0,
            metaInfo: [],
            metricInfo,
          },
        },
        reports: {
          isPrinting: false,
        },
        user: {
          user: {
            role: 'teacher',
          },
        },
      },
    })
    render(
      <Router history={history}>
        <Provider store={store}>
          <PeerPerformance
            settings={settings}
            toggleFilter={() => {}}
            filters={filters}
          />
        </Provider>
      </Router>
    )
    peerPerformanceTextVisibility()
  })
})
