import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { Router } from 'react-router'
import configureMockStore from 'redux-mock-store'
import { createMemoryHistory } from 'history'
import PerformanceByStudents from '../index'
import { storeData, demographicFilters, settings } from './testData'

const mockStore = configureMockStore()
const store = mockStore(storeData)

const history = createMemoryHistory()

describe('single assessment report - PerformanceByStudents', () => {
  test('PerformanceByStudents component visibility ', async () => {
    render(
      <Provider store={store}>
        <Router history={history}>
          <PerformanceByStudents
            settings={settings}
            demographicFilters={demographicFilters}
            toggleFilter={() => {}}
          />
        </Router>
      </Provider>
    )

    const StudentsPerformanceBandsTitle = screen.getByText(
      'Students in Performance Bands(%)'
    )
    expect(StudentsPerformanceBandsTitle).toBeInTheDocument()
    const StudentScoreDistributionTitle = screen.getByText(
      'Student score distribution | Rubric Test (ID:98419)'
    )
    expect(StudentScoreDistributionTitle).toBeInTheDocument()
    const StudentPerformanceTitle = screen.getByText(
      'Student Performance | Rubric Test (ID:98419)'
    )
    expect(StudentPerformanceTitle).toBeInTheDocument()
  })
  test('PerformanceByStudentsTable component visibility  ', async () => {
    render(
      <Provider store={store}>
        <Router history={history}>
          <PerformanceByStudents
            settings={settings}
            demographicFilters={demographicFilters}
            toggleFilter={() => {}}
          />
        </Router>
      </Provider>
    )
    const PerformanceBandTitle = screen.getAllByText('Performance Band')
    expect(PerformanceBandTitle[0]).toBeInTheDocument()

    const StudentTitle = screen.getAllByText('Student')
    expect(StudentTitle[0]).toBeInTheDocument()
  })

  test('verify if PerformanceByStudentsTable renders data  ', async () => {
    render(
      <Provider store={store}>
        <Router history={history}>
          <PerformanceByStudents
            settings={settings}
            demographicFilters={demographicFilters}
            toggleFilter={() => {}}
          />
        </Router>
      </Provider>
    )
    const tablebody = document.getElementsByClassName('ant-table-tbody')
    expect(tablebody).toHaveLength(2)
  })
})
