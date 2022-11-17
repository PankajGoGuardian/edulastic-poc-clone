import '@testing-library/jest-dom'
import React from 'react'
import { render, cleanup, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import { BrowserRouter as Router } from 'react-router-dom'
import StandardsGradebook from '../index'
import { settings, standardsGradebook, ddfilter } from './testData'

const mockStore = configureMockStore()
const store = mockStore({
  reportReducer: {
    reportStandardsFilterDataReducer: {
      standardsFilters: {},
    },
    reportStandardsGradebookReducer: {
      standardsGradebook,
    },
    reports: {
      isCsvDownloading: false,
    },
  },
})

describe('StandardsGradebook - Standards Mastery Report', () => {
  beforeEach(() => {
    cleanup()
  })
  test('StandardsGradebook component visibility', async () => {
    render(
      <Router>
        <Provider store={store}>
          <StandardsGradebook
            settings={settings}
            standardsGradebook={standardsGradebook}
            toggleFilter={() => {}}
            ddfilter={ddfilter}
          />
        </Provider>
      </Router>
    )
    const masteryLevelTitle = screen.getByText(
      'Mastery Level Distribution by Standard'
    )
    expect(masteryLevelTitle).toBeInTheDocument()
  })
  test('StandardsGradebookTable component visibility', async () => {
    render(
      <Router>
        <Provider store={store}>
          <StandardsGradebook
            settings={settings}
            standardsGradebook={standardsGradebook}
            toggleFilter={() => {}}
            ddfilter={ddfilter}
          />
        </Provider>
      </Router>
    )
    const School = screen.getAllByText('School')
    expect(School[0]).toBeInTheDocument()
    const avgStdTitle = screen.getByText('Avg. Standard Performance')
    expect(avgStdTitle).toBeInTheDocument()
  })
})
