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
import EngagementReportFilters from '../filters'
import { Provider } from 'react-redux'
import { getAllTestTypesMap } from '../../../../../../../common/utils/testTypeUtils'
import { SET_FILTERS } from '../../filterDataDucks'
import { TEST_TYPES_VALUES_MAP } from '@edulastic/constants/const/testTypes'

jest.mock('../../../../../common/styled', () => ({
  ...jest.requireActual('../../../../../common/styled'),
  FilterLabel: ({ children }) => <label> {children} </label>,
}))

jest.mock('../../../../../common/components/autocompletes/SchoolAutoComplete')

const setTempTagsData = () => {}
const location = {
  search: () => {},
  pathname: '',
}
const setShowApply = jest.fn()

const mockStore = configureMockStore()
const storeData = {
  reportReducer: {
    reportERFilterDataReducer: {
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
    },
  },
  user: {
    user: {},
  },
}
const store = mockStore(storeData)

const props = {
  location,
  setTempTagsData,
  tagsData: {},
  setTagsData: () => {},
  history: [],
  setShowApply,
  onGoClick: () => {},
  setFirstLoad: () => {},
}
const verifyTestTypeOptions = () => {
  const testTypes = getAllTestTypesMap()

  Object.values(testTypes).forEach((testType) => {
    expect(screen.getByText(testType)).toBeInTheDocument()
  })
}

describe('Test type options in the filters modal for Engagement Report', () => {
  beforeEach(() => {
    cleanup()
    store.clearActions()
  })

  it('Render the filter component', () => {
    render(
      <Provider store={store}>
        <EngagementReportFilters {...props} />
      </Provider>
    )
  })

  it('should have all the test types as its option', async () => {
    render(
      <Provider store={store}>
        <EngagementReportFilters {...props} />
      </Provider>
    )

    const testTypeLabel = screen.getByText('Test Type')
    const testTypePlaceHolder = screen.getByText(/All Test Type/i)

    expect(testTypeLabel).toBeInTheDocument()
    expect(testTypePlaceHolder).toBeInTheDocument()
    expect(testTypePlaceHolder).toHaveStyle('display:block')

    userEvent.click(testTypePlaceHolder)
    await screen.findByText(/class assessment/i)

    verifyTestTypeOptions()
  })

  it('should display only the options that matches the search text', async () => {
    render(
      <Provider store={store}>
        <EngagementReportFilters {...props} />
      </Provider>
    )

    const searchInTestType = 'Assessment'
    const expectedLength = Object.values(
      getAllTestTypesMap()
    ).filter((testType) => testType.includes(searchInTestType)).length

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

  it('select an option from the screen', async () => {
    const commonAssessment = TEST_TYPES_VALUES_MAP.COMMON_ASSESSMENT

    render(
      <Provider store={store}>
        <EngagementReportFilters {...props} />
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
          action.type === SET_FILTERS &&
          action.payload?.assessmentTypes === commonAssessment
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
        reportERFilterDataReducer: {
          ...storeData.reportReducer.reportERFilterDataReducer,
          filters: {
            ...storeData.reportReducer.reportERFilterDataReducer.filters,
            assessmentTypes: classAssessment,
          },
        },
      },
    }
    const tempStore = mockStore(tempStoreData)

    render(
      <Provider store={tempStore}>
        <EngagementReportFilters {...props} />
      </Provider>
    )

    const testTypeLabel = screen.getByText('Test Type')
    const testTypePlaceHolder = screen.getByText(/All Test Type/i)

    expect(testTypeLabel).toBeInTheDocument()
    expect(testTypePlaceHolder).toBeInTheDocument()
    expect(testTypePlaceHolder).toHaveStyle('display:none')

    expect(screen.getAllByTitle(/Class Assessment/i)).toHaveLength(1)
  })
})
