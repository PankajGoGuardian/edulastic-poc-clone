import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import configureMockStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import AssessmentsTable from '../components/AssessmentsTable'

const history = createMemoryHistory()

const tableData = [
  {
    totalQuestions: 0,
    assignmentId: '62fca80a92e57e0009aa8d00',
    groupId: '62daacbdffcb990009f78e2b',
    studentId: '61bc392ff6d9b7f1b6200626',
    maxScore: 5,
    reportKey: '62fca7e93d0413000aa70f08',
    score: 2.6667,
    testActivityId: '62fca80a92e57e0009aa8d01',
    testId: '62fca7e93d0413000aa70f08',
    totalTestItems: 3,
    assignmentDate: '1660725248288',
    testType: 'Class Assessment',
    title: 'Normal Test01',
    testName: 'Normal Test01',
    totalScore: 2.6667,
    totalMaxScore: 5,
    standardSet: 'Virginia Mathematics',
    subject: 'Mathematics',
    averageScore: 53.334,
    band: {
      color: '#EBDD54',
      threshold: 50,
      aboveStandard: 1,
      name: 'Basic',
    },
    assignmentDateFormatted: 'Aug 17, 2022',
    districtAvg: 53,
    groupAvg: 53,
    schoolAvg: 53,
    rawScore: '2.67 / 5',
  },
]

const mockStore = configureMockStore()
const store = mockStore({
  reportReducer: {
    reports: {
      isSharing: false,
    },
  },
})

describe('Data warehouse reports ', () => {
  test('Assesment Table component visibility ', async () => {
    render(
      <Router history={history}>
        <Provider store={store}>
          <AssessmentsTable />
        </Provider>
      </Router>
    )
    const assesmentNameTitle = screen.getAllByText('Assessment Name')[0]
    expect(assesmentNameTitle).toBeInTheDocument()
    const assesmentTypeTitle = screen.getByText('Assessment Type')
    expect(assesmentTypeTitle).toBeInTheDocument()
    const dayOfstartTitle = screen.getByText('Day of Assessment Start')
    expect(dayOfstartTitle).toBeInTheDocument()
    const performanceTitle = screen.getByText('Performance')
    expect(performanceTitle).toBeInTheDocument()
    const distirtAvgScore = screen.getByText('District (Avg. Score%)')
    expect(distirtAvgScore).toBeInTheDocument()
    const schoolAvgScoreTitle = screen.getByText('School (Avg Score%)')
    expect(schoolAvgScoreTitle).toBeInTheDocument()
    const classAvgScoreTitle = screen.getByText('Class (Avg Score%)')
    expect(classAvgScoreTitle).toBeInTheDocument()
    const claimsTitle = screen.getByText('Claim Levels')
    expect(claimsTitle).toBeInTheDocument()
  })
  test('Verify if Assessment Table render data on table ', async () => {
    render(
      <Router history={history}>
        <Provider store={store}>
          <AssessmentsTable
            tableData={tableData}
            isCsvDownloading={false}
            onCsvConvert={() => {}}
          />
        </Provider>
      </Router>
    )
    const tablebody = document.getElementsByClassName('ant-table-tbody')
    expect(tablebody).toHaveLength(2)
  })
  test('Verify onclick of testname page should navigate to LCB ', async () => {
    render(
      <Router history={history}>
        <Provider store={store}>
          <AssessmentsTable
            tableData={tableData}
            isCsvDownloading={false}
            onCsvConvert={() => {}}
          />
        </Provider>
      </Router>
    )
    const testName = screen.getAllByTestId('testName')[0]
    fireEvent.click(testName)
    expect(history.location.pathname).toBe(
      '/author/classboard/62fca80a92e57e0009aa8d00/62daacbdffcb990009f78e2b/test-activity/62fca80a92e57e0009aa8d01'
    )
  })
})
