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
import StandardsMasteryReportFilters from '../filters'
import { Provider } from 'react-redux'
import {
  getAllTestTypesMap,
  getNonPremiumTestTypes,
} from '../../../../../../../common/utils/testTypeUtils'
import {
  PREMIUM_TEST_TYPES,
  TEST_TYPES_VALUES_MAP,
  TEST_TYPE_LABELS,
} from '@edulastic/constants/const/testTypes'
import { pick } from 'lodash'
import { SET_FILTERS } from '../../filterDataDucks'

jest.mock('../../../../../common/styled', () => ({
  ...jest.requireActual('../../../../../common/styled'),
  FilterLabel: ({ children }) => <label> {children} </label>,
}))

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
  reportReducer: {
    reports: { testList: [] },
    reportStandardsPerformanceSummaryReducer: {
      standardsPerformanceSummary: {},
    },
    reportStandardsProgressReducer: {
      standardsProgress: {},
    },
    reportStandardsGradebookReducer: {
      standardsGradebook: {},
    },
    reportStandardsFilterDataReducer: {
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
    user: {
      features: {
        premium: false,
      },
    },
  },
}

const props = {
  location,
  setTempTagsData,
  tagsData: {},
  setTagsData: () => {},
  history: [],
  setShowApply,
}

const verifyTestTypeOptions = (isPremium) => {
  const testTypes = isPremium ? getAllTestTypesMap() : getNonPremiumTestTypes()

  Object.values(testTypes).forEach((testType) => {
    expect(screen.getByText(testType)).toBeInTheDocument()
  })

  if (!isPremium) {
    const premiumTestTypes = pick(TEST_TYPE_LABELS, PREMIUM_TEST_TYPES)
    Object.values(premiumTestTypes).forEach((testType) => {
      expect(screen.queryByText(testType)).not.toBeInTheDocument()
    })
  }
}

let store

describe('Test type options in the filters modal for Standard Mastery Report', () => {
  describe('Verify for free users', () => {
    beforeEach(() => {
      store = mockStore(storeData)
    })

    afterEach(() => {
      cleanup()
      store.clearActions()
    })

    it('Render the filter component', () => {
      render(
        <Provider store={store}>
          <StandardsMasteryReportFilters {...props} />
        </Provider>
      )
    })

    it('should have all free test types as its option', async () => {
      render(
        <Provider store={store}>
          <StandardsMasteryReportFilters {...props} />
        </Provider>
      )

      const testTypeLabel = screen.getByText('Test Type')
      const testTypePlaceHolder = screen.getByText(/All Test Type/i)

      expect(testTypeLabel).toBeInTheDocument()
      expect(testTypePlaceHolder).toBeInTheDocument()
      expect(testTypePlaceHolder).toHaveStyle('display:block')

      userEvent.click(testTypePlaceHolder)
      await screen.findByText(/class assessment/i)

      verifyTestTypeOptions(false)
    })

    it('select an option from the screen', async () => {
      render(
        <Provider store={store}>
          <StandardsMasteryReportFilters {...props} />
        </Provider>
      )

      const testTypeLabel = screen.getByText('Test Type')
      const testTypePlaceHolder = screen.getByText(/All Test Type/i)

      expect(testTypeLabel).toBeInTheDocument()
      expect(testTypePlaceHolder).toBeInTheDocument()
      expect(testTypePlaceHolder).toHaveStyle('display:block')

      userEvent.click(testTypePlaceHolder)
      const commonAssessmentOption = await screen.findByText(
        /common assessment/i
      )

      fireEvent.click(commonAssessmentOption)

      const actualAction = store
        .getActions()
        .find(
          (action) =>
            action.type === SET_FILTERS &&
            action.payload.assessmentTypes === 'common assessment'
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
          reportStandardsFilterDataReducer: {
            ...storeData.reportReducer.reportStandardsFilterDataReducer,
            filters: {
              ...storeData.reportReducer.reportStandardsFilterDataReducer
                .filters,
              assessmentTypes: classAssessment,
            },
          },
        },
      }
      const tempStore = mockStore(tempStoreData)

      render(
        <Provider store={tempStore}>
          <StandardsMasteryReportFilters {...props} />
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

  describe('Verify for premium users', () => {
    beforeEach(() => {
      store = mockStore({
        ...storeData,
        user: {
          user: {
            features: {
              premium: true,
            },
          },
        },
      })
    })

    afterEach(() => {
      cleanup()
      store.clearActions()
    })

    it('Render the filter component', () => {
      render(
        <Provider store={store}>
          <StandardsMasteryReportFilters {...props} />
        </Provider>
      )
    })

    it('should have all the test types as its option', async () => {
      render(
        <Provider store={store}>
          <StandardsMasteryReportFilters {...props} />
        </Provider>
      )

      const testTypeLabel = screen.getByText('Test Type')
      const testTypePlaceHolder = screen.getByText(/All Test Type/i)

      expect(testTypeLabel).toBeInTheDocument()
      expect(testTypePlaceHolder).toBeInTheDocument()
      expect(testTypePlaceHolder).toHaveStyle('display:block')

      userEvent.click(testTypePlaceHolder)
      await screen.findByText(/class assessment/i)

      verifyTestTypeOptions(true)
    })

    it('should display only the options that matches the search text', async () => {
      render(
        <Provider store={store}>
          <StandardsMasteryReportFilters {...props} />
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
          <StandardsMasteryReportFilters {...props} />
        </Provider>
      )

      const testTypeLabel = screen.getByText('Test Type')
      const testTypePlaceHolder = screen.getByText(/All Test Type/i)

      expect(testTypeLabel).toBeInTheDocument()
      expect(testTypePlaceHolder).toBeInTheDocument()
      expect(testTypePlaceHolder).toHaveStyle('display:block')

      userEvent.click(testTypePlaceHolder)
      const commonAssessmentOption = await screen.findByText(
        /common assessment/i
      )

      fireEvent.click(commonAssessmentOption)

      const actualAction = store
        .getActions()
        .find(
          (action) =>
            action.type === SET_FILTERS &&
            action.payload.assessmentTypes === commonAssessment
        )
      expect(actualAction).toBeDefined()

      // To check whether the apply button is enabled
      expect(setShowApply).toBeCalledWith(true)
    })

    it('should display class assessment in the test type', async () => {
      const classAssessment = TEST_TYPES_VALUES_MAP.ASSESSMENT
      const tempStoreData = {
        reportReducer: {
          ...storeData.reportReducer,
          reportStandardsFilterDataReducer: {
            ...storeData.reportReducer.reportStandardsFilterDataReducer,
            filters: {
              ...storeData.reportReducer.reportStandardsFilterDataReducer
                .filters,
              assessmentTypes: classAssessment,
            },
          },
        },
        user: {
          user: {
            features: {
              premium: true,
            },
          },
        },
      }
      const tempStore = mockStore(tempStoreData)

      render(
        <Provider store={tempStore}>
          <StandardsMasteryReportFilters {...props} />
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
})
