import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import PerformanceOverTimeTable from '../components/table/PerformanceOvetTimeTable'
import { dataSource, backendPagination } from './testData'

const mockStore = configureMockStore()
const store = mockStore({
  reportReducer: {
    reportPerformanceOverTimeReducer: {
      performanceOverTime: {},
    },
    reports: {
      isCsvDownloading: false,
    },
  },
})

describe('Mutliple Assessment report - PerformanceOverTimeTable', () => {
  test('PerformanceOverTimeTable component visibility', async () => {
    render(
      <Provider store={store}>
        <PerformanceOverTimeTable
          dataSource={dataSource}
          isCsvDownloading={false}
          backendPagination={backendPagination}
        />
      </Provider>
    )
    const assessmentDate = screen.getByText('Assessment Date')
    expect(assessmentDate).toBeInTheDocument()
    const type = screen.getByText('Type')
    expect(type).toBeInTheDocument()
    const MaxPossibleScore = screen.getByText('Max Possible Score')
    expect(MaxPossibleScore).toBeInTheDocument()
    const Questions = screen.getByText('Questions')
    expect(Questions).toBeInTheDocument()
    const Assigned = screen.getByText('Assigned')
    expect(Assigned).toBeInTheDocument()
    const Submitted = screen.getByText('Submitted')
    expect(Submitted).toBeInTheDocument()
    const Absent = screen.getByText('Absent')
    expect(Absent).toBeInTheDocument()
    const minScore = screen.getByText('Min. Score')
    expect(minScore).toBeInTheDocument()
    const maxScore = screen.getByText('Max. Score')
    expect(maxScore).toBeInTheDocument()
    const avgScore = screen.getByText('Avg. Student (Score%)')
    expect(avgScore).toBeInTheDocument()
  })
  test('verify if  PerformanceOverTimeTable renders data', async () => {
    render(
      <Provider store={store}>
        <PerformanceOverTimeTable
          dataSource={dataSource}
          isCsvDownloading={false}
          backendPagination={backendPagination}
        />
      </Provider>
    )
    const tablebody = document.getElementsByClassName('ant-table-tbody')
    expect(tablebody).toHaveLength(2)
  })
})
