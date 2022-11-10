import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router'
import configureMockStore from 'redux-mock-store'
import Table from '../components/Table'

const history = createMemoryHistory()

const mockStore = configureMockStore()
const store = mockStore({
  reportReducer: {
    reports: {
      isSharing: false,
    },
  },
})

test('Assessment Table', () => {
  render(
    <Router history={history}>
      <Provider store={store}>
        <Table
          overallAssessmentsData={[
            {
              testId: '5e7cb5fd03b7ad09244ee5a5',
              maxScore: 12,
              totalScore: 6,
              totalStudentCount: 2,
              testType: 'assessment',
              assessmentDate: 1664271788881,
              schoolId: '6322fd96cfc33d00095e904c',
              uniqId: '5e7cb5fd03b7ad09244ee5a5_assessment',
              averageScorePercentage: 50,
              band: {
                color: '#EBDD54',
                threshold: 50,
                aboveStandard: 1,
                name: 'Basic',
                rank: 1,
              },
              totalMaxScore: 12,
              totalTotalScore: 6,
              testName: '6 Excerpt from In Caverns of Blue Ice (assessment)',
              isIncomplete: true,
              averageScore: 1,
            },
          ]}
          tableData={[
            {
              id: '6322fd96cfc33d00095e904c',
              school: '6322fd96cfc33d00095e904c',
              totalStudentCount: 2,
              tests: [
                {
                  testId: '5e7cb5fd03b7ad09244ee5a5',
                  maxScore: 12,
                  totalScore: 6,
                  totalStudentCount: 2,
                  testType: 'assessment',
                  assessmentDate: 1664271788881,
                  schoolId: '6322fd96cfc33d00095e904c',
                  uniqId: '5e7cb5fd03b7ad09244ee5a5_assessment',
                  averageScorePercentage: 50,
                  band: {
                    color: '#EBDD54',
                    threshold: 50,
                    aboveStandard: 1,
                    name: 'Basic',
                    rank: 1,
                  },
                  totalMaxScore: 12,
                  totalTotalScore: 6,
                  testName:
                    '6 Excerpt from In Caverns of Blue Ice (assessment)',
                  isIncomplete: true,
                  averageScore: 1,
                },
              ],
              groupId: '63230f8ec737000009ac3e6f',
              groupName: 'Nikki Grade2 ELA 2022-23',
              groupType: 'class',
              teacherId: '63230015c14cc500091adc8a',
              teacherName: 'Nikki Giovanni',
              schoolId: '6322fd96cfc33d00095e904c',
              schoolName: 'Oak Ridge High School',
            },
          ]}
          settings={{
            selectedCompareBy: {
              key: 'school',
              title: 'School',
              hiddenFromRole: ['teacher'],
            },
          }}
        />
      </Provider>
    </Router>
  )
  const columns = document.getElementsByClassName('ant-table-column-title')
  expect(columns[0].innerHTML).toBe('School')
  const testname = screen.getByText(
    '6 Excerpt from In Caverns of Blue Ice (assessment) *'
  )
  expect(testname).toBeInTheDocument()
})
