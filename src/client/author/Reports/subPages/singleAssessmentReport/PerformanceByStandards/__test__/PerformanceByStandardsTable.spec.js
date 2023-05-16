import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import PerformanceAnalysisTable from '../components/table/performanceAnalysisTable'
import { reports } from './testData'

const mockStore = configureMockStore()
const store = mockStore({
  user: {
    user: {
      features: {},
    },
  },
  reportReducer: {
    reportPerformanceByStandardsReducer: {},
    reports: {
      isCsvDownloading: false,
    },
  },
})

describe('single assessment report - PerformanceAnalysisTable', () => {
  test('PerformanceAnalysisTable component visibility ', async () => {
    render(
      <Provider store={store}>
        <PerformanceAnalysisTable
          viewBy="standard"
          report={reports}
          analyzeBy="score"
          compareBy="students"
          selectedDomains={[]}
          selectedStandards={[]}
          isCsvDownloading={false}
        />
      </Provider>
    )
    const student = screen.getAllByText('Student')
    expect(student[0]).toBeInTheDocument()
    const avgStdPerformance = screen.getAllByText('Avg. standard Performance')
    expect(avgStdPerformance[0]).toBeInTheDocument()
  })
  test('verify if PerformanceAnalysisTable renders data  ', async () => {
    render(
      <Provider store={store}>
        <PerformanceAnalysisTable
          viewBy="standard"
          report={reports}
          analyzeBy="score"
          compareBy="students"
          selectedDomains={[]}
          selectedStandards={[]}
          isCsvDownloading={false}
        />
      </Provider>
    )
    const tablebody = document.getElementsByClassName('ant-table-tbody')
    expect(tablebody).toHaveLength(2)
  })
})
