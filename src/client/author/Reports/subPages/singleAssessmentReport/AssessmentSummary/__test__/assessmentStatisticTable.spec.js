import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'
import configureMockStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom'
import AssessmentStatisticTable from '../components/table/assessmentStatisticTable'

const mockStore = configureMockStore()

const history = createMemoryHistory()

const assessmentStatisticTableVisibility = () => {
  const tableheader = screen.getByTestId('tableTitle')
  expect(tableheader.textContent).toBe(
    'Assignment Statistics for assesmentname by Class'
  )
  const className = screen.getAllByText('Class Name')
  expect(className[0]).toBeInTheDocument()
  const assignedOn = screen.getByText('Assigned On')
  expect(assignedOn).toBeInTheDocument()
  const totalAssigned = screen.getByText('Total Assigned')
  expect(totalAssigned).toBeInTheDocument()
  const studentsSubmittedGraded = screen.getByText(
    'Students Submitted & Graded'
  )
  expect(studentsSubmittedGraded).toBeInTheDocument()
  const studentsStatusText = screen.getByText(
    'Students Not Started, In Progress & Absent'
  )
  expect(studentsStatusText).toBeInTheDocument()
  const avgScore = screen.getByText('Avg. Student Score (%)')
  expect(avgScore).toBeInTheDocument()
  const minScore = screen.getByText('Min. Score')
  expect(minScore).toBeInTheDocument()
  const variance = screen.getByText('Variance (P) of Score')
  expect(variance).toBeInTheDocument()
  const Stddev = screen.getByText('Std. dev.(P) of Score')
  expect(Stddev).toBeInTheDocument()
}

describe('Assessment statistic table  ', () => {
  test('test should render table', async () => {
    const store = mockStore({
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
    })

    render(
      <Router history={history}>
        <Provider store={store}>
          <AssessmentStatisticTable
            name="assesmentname"
            data={[
              {
                assignmentId: '62a6ef24a016470009d7848b',
                scores: [2],
                groupId: '621f24eacd98a60009733347',
                teacherId: '5e4a3b5b03b7ad092408c6f1',
                schoolId: '6108ee1201151b0009b59b3f',
                groupName: 'GRP CLASS',
                teacherName: 'teacher name',
                schoolName: 'school name',
                studentsGraded: 1,
                studentsAbsent: 0,
                minScore: 2,
                maxScore: 2,
                sampleCount: 1,
                totalScore: 2,
                totalMaxScore: 3,
                studentsAssigned: 1,
                assessmentDate: 1655107298844,
                dueDate: 1655746200000,
              },
            ]}
            isPrinting={false}
            // eslint-disable-next-line jsx-a11y/aria-role
            role="teacher"
          />
        </Provider>
      </Router>
    )
    assessmentStatisticTableVisibility()
  })
})
