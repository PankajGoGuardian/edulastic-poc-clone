import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'
import configureMockStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import MultipleAssessmentReportFilters from '../components/Filters'

jest.mock('../../../../common/components/autocompletes/GroupsAutoComplete')
jest.mock('../../../../common/components/autocompletes/ClassAutoComplete')
jest.mock('../../../../common/components/autocompletes/CourseAutoComplete')
jest.mock('../../../../common/components/autocompletes/SchoolAutoComplete')
jest.mock('../../../../common/components/autocompletes/TeacherAutoComplete')

const location = {
  pathname: '/author/reports/multiple-assessment-report-dw',
  search:
    '?termId=632307a1cabdd8000986640e&testSubjects=All&testGrades=All&tagIds=All&assessmentTypes=All&testIds=All&schoolIds=All&teacherIds=All&subjects=All&grades=All&courseId=All&classIds=All&groupIds=All&profileId=6322e2b799978a000a298469&reportId=',
  hash: '',
  key: 'mfur8j',
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
      <Provider store={store}>
        <MultipleAssessmentReportFilters
          location={location}
          filters={{ showApply: true }}
          showFilter={false}
          orgData={{ terms: [], schools: [] }}
          setFilters={() => {}}
          setFilterTagsData={() => {}}
          fetchFiltersDataRequest={() => {}}
        />
      </Provider>
    )
    const filtersButton = screen.getByText('FILTERS')
    expect(filtersButton).toBeInTheDocument()
    const performanceBand = screen.getByText('EDULASTIC PERFORMANCE BAND')
    expect(performanceBand).toBeInTheDocument()
    const applyRowFilter = screen.getByText('APPLY')
    expect(applyRowFilter).toBeInTheDocument()
  })
  test('Filters component visibility when showFilter is true ', async () => {
    render(
      <Provider store={store}>
        <MultipleAssessmentReportFilters
          Showfilter
          location={location}
          orgData={{ terms: [], schools: [] }}
          setFilters={() => {}}
          filters={{}}
          toggleFilter={() => {}}
          setFilterTagsData={() => {}}
          fetchFiltersDataRequest={() => {}}
        />
      </Provider>
    )
    const filtersButton = screen.getByText('FILTERS')
    expect(filtersButton).toBeInTheDocument()

    const studentsTab = screen.getByText('Select Students')
    expect(studentsTab).toBeInTheDocument()

    const testsTab = screen.getByText('Select Tests')
    expect(testsTab).toBeInTheDocument()

    const performanceTab = screen.getByText('Performance')
    expect(performanceTab).toBeInTheDocument()

    const demographicsTab = screen.getByText('Demographics')
    expect(demographicsTab).toBeInTheDocument()

    const applyFilterButton = screen.getByText('Apply')
    expect(applyFilterButton).toBeInTheDocument()

    const cancelButton = screen.getByText('Cancel')
    expect(cancelButton).toBeInTheDocument()
  })
})
