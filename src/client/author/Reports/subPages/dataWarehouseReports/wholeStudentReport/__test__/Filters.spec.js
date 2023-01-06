import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'
import configureMockStore from 'redux-mock-store'
import WholeStudentReportFilters from '../components/Filters'

jest.mock('../components/ClassAutoComplete', () => () => (
  <div data-testid="ClassAutoComplete" />
))
jest.mock(
  '../../../../common/components/autocompletes/CoursesAutoComplete',
  () => () => <div data-testid="Courses" />
)
jest.mock('../components/StudentAutoComplete', () => () => (
  <div data-testid="StudentAutoComplete" />
))

const location = {
  pathname: '/author/reports/whole-student-report/student/',
  search:
    '?reportId=&termId=62308b1b4f201d00091af3ab&grades=&subjects=&schoolIds=&classIds=&courseIds=&performanceBandProfileId=61bc37c222542500099eacc1&showApply=false',
  hash: '',
  key: 'wx6kly',
}

const mockStore = configureMockStore()
const store = mockStore({
  user: {
    user: {
      features: {},
    },
  },
})

describe('Data warehouse reports ', () => {
  test('Filters component visibility on initial render ', async () => {
    render(
      <WholeStudentReportFilters
        location={location}
        store={store}
        filters={{ showApply: true }}
        Showfilter={false}
        orgData={{ terms: [] }}
        setFilters={() => {}}
        setFilterTagsData={() => {}}
      />
    )
    const StudentAutoComplete = screen.getByTestId('StudentAutoComplete')
    expect(StudentAutoComplete).toBeInTheDocument()
    const performanceBand = screen.getByTestId('performanceBand')
    expect(performanceBand).toBeInTheDocument()
    const applyRowFilter = screen.getByTestId('applyRowFilter')
    expect(applyRowFilter).toBeInTheDocument()
  })
  test('Filters component visibility when showFilter is true ', async () => {
    render(
      <WholeStudentReportFilters
        store={store}
        filters={{ showApply: true }}
        Showfilter
        location={location}
        orgData={{ terms: [] }}
        setFilters={() => {}}
        setFilterTagsData={() => {}}
      />
    )
    const filtersButton = screen.getByTestId('filters')
    expect(filtersButton).toBeInTheDocument()
    const schoolYear = document.querySelector('[title="School Year"]')
    expect(schoolYear).toBeInTheDocument()
    const CourseAutoComplete = screen.getByTestId('Courses')
    expect(CourseAutoComplete).toBeInTheDocument()
    const classGrade = document.querySelector('[data-cy="classGrade"]')
    expect(classGrade).toBeInTheDocument()
    const classSubject = document.querySelector('[data-cy="classSubject"]')
    expect(classSubject).toBeInTheDocument()
    const ClassAutoComplete = screen.getByTestId('ClassAutoComplete')
    expect(ClassAutoComplete).toBeInTheDocument()
    const cancelFilterButton = screen.getByTestId('cancelFilter')
    expect(cancelFilterButton).toBeInTheDocument()
    const applyFilterButton = screen.getByTestId('applyFilter')
    expect(applyFilterButton).toBeInTheDocument()
  })
})
