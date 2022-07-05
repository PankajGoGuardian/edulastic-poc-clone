import '@testing-library/jest-dom'
import React from 'react'
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import configureMockStore from 'redux-mock-store'
import SingleAssessmentReportFilters from '../filters'
import { Provider } from 'react-redux'
import { getAllTestTypesMap } from '../../../../../../../common/utils/testTypeUtils'
import { SET_FILTERS_OR_TEST_ID } from '../../filterDataDucks'
import { TEST_TYPES_VALUES_MAP } from '@edulastic/constants/const/testTypes'

jest.mock('../../../../../common/styled', () => ({
  ...jest.requireActual('../../../../../common/styled'),
  FilterLabel: ({ children }) => <label> {children} </label>,
}))

jest.mock(
  '../../../../../common/components/autocompletes/AssessmentAutoComplete'
)
jest.mock('../../../../../common/components/autocompletes/SchoolAutoComplete')
jest.mock('../../../../../common/components/autocompletes/CourseAutoComplete')
jest.mock('../../../../../common/components/autocompletes/TeacherAutoComplete')
jest.mock('../../../../../common/components/autocompletes/ClassAutoComplete')
jest.mock('../../../../../common/components/autocompletes/GroupsAutoComplete')

const setTempTagsData = () => {}
const location = {
  search: () => {},
  pathname: '',
}
const setShowApply = jest.fn()

const mockStore = configureMockStore()
const storeData = {
  tests: {
    entity: {},
  },
  reportReducer: {
    reports: { testList: [] },
    reportSARFilterDataReducer: {
      loading: false,
      filters: {
        termId: '',
        testGrades: '',
        testSubjects: '',
        tagIds: '',
        assessmentTypes: '',
        grades: '',
        subjects: '',
        courseId: 'All',
        classIds: '',
        groupIds: '',
        standardsProficiencyProfile: '',
        performanceBandProfile: '',
        assignedBy: 'anyone',
      },
      testId: '',
    },
  },
  user: {
    user: {},
  },
  groupsReducer: {
    data: {},
  },
  classesReducer: {
    data: {},
  },
  coursesReducer: {
    data: {},
  },
  teacherReducer: {
    data: {},
  },
  schoolsReducer: {
    data: {},
  },
}
const store = mockStore(storeData)

const verifyTestTypeOptions = () => {
  const testTypes = getAllTestTypesMap()

  Object.values(testTypes).forEach((testType) => {
    expect(screen.getByText(testType)).toBeInTheDocument()
  })
}

const props = {
  location,
  setTempTagsData,
  tagsData: {},
  setTagsData: () => {},
  history: [],
  setShowApply,
}

describe('Test type options in the filters modal for Single Assessment Report', () => {
  beforeEach(() => {
    cleanup()
    store.clearActions()
  })

  it('Render the filter component', () => {
    render(
      <Provider store={store}>
        <SingleAssessmentReportFilters {...props} />
      </Provider>
    )
  })

  it('should have all the test types as its option', async () => {
    render(
      <Provider store={store}>
        <SingleAssessmentReportFilters {...props} />
      </Provider>
    )

    const testTypeLabel = screen.getByText('Test Type')
    const testTypePlaceHolder = screen.getByText(/All Test Type/i)

    expect(testTypeLabel).toBeInTheDocument()
    expect(testTypePlaceHolder).toBeInTheDocument()

    // All Test Type will be displayed when its style is display:block
    expect(testTypePlaceHolder).toHaveStyle('display:block')

    userEvent.click(testTypePlaceHolder)
    await screen.findByText(/class assessment/i)

    verifyTestTypeOptions()
  })

  it('should display only the options that matches the search text', async () => {
    const searchInTestType = 'Assessment'
    const expectedLength = Object.values(
      getAllTestTypesMap()
    ).filter((testType) => testType.includes(searchInTestType)).length

    render(
      <Provider store={store}>
        <SingleAssessmentReportFilters {...props} />
      </Provider>
    )

    const testTypeLabel = screen.getByText('Test Type')
    const testTypePlaceHolder = screen.getByText(/All Test Type/i)

    expect(testTypeLabel).toBeInTheDocument()
    expect(testTypePlaceHolder).toBeInTheDocument()

    userEvent.click(testTypePlaceHolder)
    await screen.findByText(/class assessment/i)
    userEvent.type(testTypePlaceHolder, searchInTestType)

    await waitForElementToBeRemoved(() => screen.queryByText(/quiz/i))

    expect(screen.getAllByTitle(/Assessment/i)).toHaveLength(expectedLength)
  })

  it('select an option from the dropdown', async () => {
    const commonAssessment = TEST_TYPES_VALUES_MAP.COMMON_ASSESSMENT

    render(
      <Provider store={store}>
        <SingleAssessmentReportFilters {...props} />
      </Provider>
    )

    const testTypeLabel = screen.getByText('Test Type')
    const testTypePlaceHolder = screen.getByText(/All Test Type/i)

    expect(testTypeLabel).toBeInTheDocument()
    expect(testTypePlaceHolder).toBeInTheDocument()
    expect(testTypePlaceHolder).toHaveStyle('display:block')

    userEvent.click(testTypePlaceHolder)
    const commonAssessmentOption = await screen.findByText(/common assessment/i)

    fireEvent.click(commonAssessmentOption)

    const actualAction = store
      .getActions()
      .find(
        (action) =>
          action.type === SET_FILTERS_OR_TEST_ID &&
          action.payload?.filters?.assessmentTypes === commonAssessment
      )
    expect(actualAction).toBeDefined()

    // To check whether the apply button is enabled
    expect(setShowApply).toBeCalledWith(true)
  })

  it('should display class assessment in the test type', async () => {
    const classAssessment = TEST_TYPES_VALUES_MAP.ASSESSMENT
    const tempStoreData = {
      ...storeData,
      reportReducer: {
        ...storeData.reportReducer,
        reportSARFilterDataReducer: {
          ...storeData.reportReducer.reportSARFilterDataReducer,
          filters: {
            ...storeData.reportReducer.reportSARFilterDataReducer.filters,
            assessmentTypes: classAssessment,
          },
        },
      },
    }
    const tempStore = mockStore(tempStoreData)

    render(
      <Provider store={tempStore}>
        <SingleAssessmentReportFilters {...props} />
      </Provider>
    )

    const testTypeLabel = screen.getByText('Test Type')
    const testTypePlaceHolder = screen.getByText(/All Test Type/i)

    expect(testTypeLabel).toBeInTheDocument()
    expect(testTypePlaceHolder).toBeInTheDocument()

    // All Test Type will be hidden when its style is display:none
    expect(testTypePlaceHolder).toHaveStyle('display:none')

    expect(screen.getAllByTitle(/Class Assessment/i)).toHaveLength(1)
  })
})
