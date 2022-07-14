import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'
import configureMockStore from 'redux-mock-store'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import AssessmentSummary from '../index'

jest.mock('../components/charts/pieChart', () => ({
  SimplePieChart: () => <div data-testid="SimplePieChart" />,
}))

jest.mock('../../../../common/components/tables/CsvTable', () => () => (
  <div data-testid="AssessmentStatisticTable" />
))

const state = {
  reportReducer: {
    reportAssessmentSummaryReducer: {
      assessmentSummary: {
        meta: {
          test: {
            _id: 'id',
            title: 'title',
          },
        },
        bandInfo: {},
        metricInfo: [],
      },
    },
    reports: {
      isPrinting: false,
    },
  },
  user: {
    user: {
      role: 'teacher',
    },
  },
}

const assessmentSummaryVisibility = () => {
  const overallStatisticsHeading = screen.getByText(
    'Overall Statistics of title (ID:id)'
  )
  expect(overallStatisticsHeading).toBeInTheDocument()
  const averageScoreText = screen.getByText('Average Score')
  expect(averageScoreText).toBeInTheDocument()
  const averageStudentScoreText = screen.getByText('Average Student Score')
  expect(averageStudentScoreText).toBeInTheDocument()
  const totalAssignedText = screen.getByText('Total Assigned')
  expect(totalAssignedText).toBeInTheDocument()
  const studentSubmittedText = screen.getByText('Students Submitted & Graded')
  expect(studentSubmittedText).toBeInTheDocument()
  const studentsStatusText = screen.getByText(
    'Students Not Started, In Progress & Absent'
  )
  expect(studentsStatusText).toBeInTheDocument()
  const performancebandtitle = screen.getByText(
    'Students in Performance Bands (%)'
  )
  expect(performancebandtitle).toBeInTheDocument()
  const pieChartComponent = screen.getByTestId('SimplePieChart')
  expect(pieChartComponent).toBeInTheDocument()
  const AssessmentStatisticTable = screen.getByTestId(
    'AssessmentStatisticTable'
  )
  expect(AssessmentStatisticTable).toBeInTheDocument()
}

const mockStore = configureMockStore()

const history = createMemoryHistory()

describe('AssessmentSummary component ', () => {
  test('test should render "No data available currently" info text when metricInfo has no data', async () => {
    const store = mockStore({ ...state })
    render(
      <Router history={history}>
        <AssessmentSummary
          settings={{
            selectedTest: { _id: 'id', title: 'title' },
            requestFilters: { termId: 'termId' },
          }}
          store={store}
          toggleFilter={() => {}}
        />
      </Router>
    )
    expect(screen.getByText('No data available currently.'))
  })

  test('test should render reports are not available info text if user is cliUser and metricInfo has no data', () => {
    const store = mockStore({ ...state })
    render(
      <Router history={history}>
        <AssessmentSummary
          settings={{
            selectedTest: { _id: 'id', title: 'title' },
            requestFilters: { termId: 'termId' },
            cliUser: true,
          }}
          setShowHeader={() => {}}
          store={store}
          preventHeaderRender={() => {}}
          toggleFilter={() => {}}
        />
      </Router>
    )
    expect(
      screen.getByText(
        'Reports are not available for this test yet. Please try again later...'
      )
    )
  })
  test('test component visibility when metricInfo contains data', async () => {
    const store = mockStore({
      ...state,
      reportReducer: {
        reportAssessmentSummaryReducer: {
          assessmentSummary: {
            meta: {
              test: {
                _id: 'id',
                title: 'title',
              },
            },
            bandInfo: {},
            metricInfo: [
              {
                assessmentDate: 1640078652191,
                assignmentId: '61c1a002dde63f000a3e609b',
                dueDate: 1642527000000,
                groupId: '61c15f5cbbf96f0009980310',
                groupName: 'group name',
                maxScore: 0,
                minScore: 0,
                sampleCount: 1,
                schoolId: '61c1535a4e910200093e401c',
                schoolName: 'school name',
                scores: [0],
                studentsAbsent: 0,
                studentsAssigned: 1,
                studentsGraded: 1,
                teacherId: '61c157664e910200093e404e',
                teacherName: '',
                totalMaxScore: 2,
                totalScore: 0,
              },
            ],
          },
        },
        reports: {
          isPrinting: false,
        },
      },
    })
    render(
      <Router history={history}>
        <AssessmentSummary
          settings={{
            selectedTest: {
              key: '61c19cde81e5bf0009e4c8ce',
              title: 'T1',
            },
            requestFilters: {
              termId: '61bc37c222542500099eacc4',
              assignedBy: 'anyone',
            },
            tagsData: {
              termId: {
                key: '61bc37c222542500099eacc4',
                title: '2021-22',
              },

              assignedBy: {
                key: 'anyone',
                title: 'Anyone',
              },
              testId: {
                key: '61c19cde81e5bf0009e4c8ce',
                title: 'Test1',
              },
            },
          }}
          store={store}
          toggleFilter={() => {}}
        />
      </Router>
    )
    assessmentSummaryVisibility()
  })
})
