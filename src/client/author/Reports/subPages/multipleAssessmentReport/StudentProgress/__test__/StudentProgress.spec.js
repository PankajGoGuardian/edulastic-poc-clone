import '@testing-library/jest-dom'
import React from 'react'
import { render, cleanup, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import { BrowserRouter as Router } from 'react-router-dom'
import StudentProgress from '../index'
import { settings, studentProgress, location } from './testData'

const mockStore = configureMockStore()
const store = mockStore({
  user: {
    user: {},
  },
  reportReducer: {
    reportStudentProgressReducer: {
      studentProgress,
    },
    reports: {
      isCsvDownloading: false,
    },
  },
})

describe('StudentProgress - Multiple assessment report ', () => {
  beforeEach(() => {
    cleanup()
  })
  test('StudentProgress component visibility', async () => {
    render(
      <Router>
        <Provider store={store}>
          <StudentProgress
            settings={settings}
            toggleFilter={() => {}}
            location={location}
          />
        </Provider>
      </Router>
    )
    const studentProgressTitle = screen.getByText('Student progress over time')
    expect(studentProgressTitle).toBeInTheDocument()
    const TrendTable = screen.getByTestId('TrendTable')
    expect(TrendTable).toBeInTheDocument()
  })
  test('StudentProgress TrendTable component visibility', async () => {
    render(
      <Router>
        <Provider store={store}>
          <StudentProgress
            settings={settings}
            toggleFilter={() => {}}
            location={location}
          />
        </Provider>
      </Router>
    )
    const Student = screen.getAllByText('Student')
    expect(Student[0]).toBeInTheDocument()
    const Trend = screen.getByText('Trend')
    expect(Trend).toBeInTheDocument()
    const ClassName = screen.getByText('Class Name')
    expect(ClassName).toBeInTheDocument()
    const test = screen.getByText('test')
    expect(test).toBeInTheDocument()
  })
  test('Verify if StudentProgress Table render data on table', async () => {
    render(
      <Router>
        <Provider store={store}>
          <StudentProgress
            settings={settings}
            toggleFilter={() => {}}
            location={location}
          />
        </Provider>
      </Router>
    )
    const tablebody = document.getElementsByClassName('ant-table-tbody')
    expect(tablebody).toHaveLength(2)
  })
})
