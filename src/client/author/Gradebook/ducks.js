import { createSlice } from 'redux-starter-kit'
import { notification } from '@edulastic/common'
import { takeLatest, call, put, select } from 'redux-saga/effects'
import { keyBy } from 'lodash'
import { reportsApi, assignmentApi, groupApi } from '@edulastic/api'

// imported selectors
import { getCurrentTerm, getUserOrgData } from '../src/selectors/user'
import selectsData from '../TestPage/components/common/selectsData'

// transformers & constants
import { STATUS_LIST, PAGE_DETAIL } from './transformers'
import { getAllTestTypesMap } from '../../common/utils/testTypeUtils'

// slice
const slice = createSlice({
  name: 'gradebook',
  initialState: {
    filtersData: {
      assessments: [],
      statusList: [],
      classes: [],
      grades: [],
      subjects: [],
      terms: [],
      testTypes: [],
      groups: [],
    },
    loadingFilters: false,
    performanceData: {},
    loadingPerformanceData: false,
    showFilter: false,
    selectedFilters: {},
    pageDetail: { ...PAGE_DETAIL },
  },
  reducers: {
    fetchStudentPerformanceRequest: (state) => {
      state.loading = true
    },
    fetchStudentPerformanceCompleted: (state, { payload }) => {
      state.performanceData = payload
      state.loadingPerformanceData = false
    },
    fetchGradebookFiltersRequest: (state) => {
      state.loadingFilters = true
    },
    fetchGradebookFiltersCompleted: (state, { payload }) => {
      state.filtersData = payload
      state.loadingFilters = false
    },
    toggleShowFilter: (state) => {
      state.showFilter = !state.showFilter
    },
    setSelectedFilters: (state, { payload }) => {
      state.selectedFilters = payload
    },
    setPageDetail: (state, { payload }) => {
      state.pageDetail = payload
    },
  },
})

// actions & reducer
export const { actions, reducer } = slice

// sagas
function* fetchStudentPerformanceSaga({ payload }) {
  try {
    const { filters, studentId, pageDetail } = payload
    const {
      assessmentIds,
      classIds,
      grades,
      subjects,
      status,
      termId,
      testType,
      groupId,
    } = filters
    const newPayload = {
      studentId,
      status,
      ...pageDetail,
    }
    if (!studentId) {
      Object.assign(newPayload, {
        termId,
        assessmentIds: assessmentIds.join(','),
        classIds: classIds.join(','),
        grades: grades.join(','),
        subjects: subjects.join(','),
        testType,
        groupId,
      })
    }
    const response = yield call(reportsApi.fetchStudentPerformance, newPayload)
    yield put(actions.fetchStudentPerformanceCompleted(response))
  } catch (e) {
    yield put(actions.fetchStudentPerformanceCompleted({}))
    notification({ messageKey: 'failedToFetchStudentPerformanceGradeBook' })
  }
}

function* fetchGradebookFiltersSaga() {
  try {
    const { allGrades, allSubjects } = selectsData
    // grades
    const grades = allGrades.map(({ value, text }) => ({
      id: value,
      name: text,
    }))
    // subjects
    const subjects = allSubjects
      .filter((s) => s.value)
      .map(({ value, text }) => ({ id: value, name: text }))
    // testTypes
    const testTypeFullNames = getAllTestTypesMap()
    const testTypes = Object.keys(testTypeFullNames).map((key) => ({
      id: key,
      name: testTypeFullNames[key],
    }))
    testTypes.unshift({ id: '', name: 'All' })
    const currentTerm = yield select(getCurrentTerm)

    // assessments
    const { assignments, tests } = yield call(
      assignmentApi.fetchTeacherAssignments,
      {
        filters: { termId: currentTerm },
      }
    )
    const groupedTests = keyBy(tests, '_id')
    const assessments = assignments.map((a) => {
      const testTitle = groupedTests[a.testId]?.title?.trim() || a.title
      return { ...a, testTitle }
    })
    // classes & groups
    const classList = yield call(groupApi.fetchMyGroups)
    const classes = []
    const groups = []
    classList.forEach((c) => {
      c.id = c._id
      c.type === 'class' ? classes.push(c) : groups.push(c)
    })
    // terms
    const { terms = [] } = yield select(getUserOrgData)
    const termList = terms.map((t) => ({ ...t, id: t._id }))

    // status
    const statusList = [{ id: '', name: 'All' }, ...STATUS_LIST]
    // set filters data
    const filtersData = {
      assessments,
      classes,
      groups,
      terms: termList,
      grades,
      subjects,
      testTypes,
      statusList,
    }
    yield put(actions.fetchGradebookFiltersCompleted(filtersData))
  } catch (e) {
    yield put(actions.fetchGradebookFiltersCompleted({}))
    notification({ messageKey: 'failedToFetchFiltersData' })
  }
}

export function* watcherSaga() {
  yield takeLatest(
    actions.fetchStudentPerformanceRequest,
    fetchStudentPerformanceSaga
  )
  yield takeLatest(
    actions.fetchGradebookFiltersRequest,
    fetchGradebookFiltersSaga
  )
}

// selectors
export const selectors = {
  loading: (state) => state?.gradebookReducer?.loadingPerformanceData,
  loadingFilters: (state) => state?.gradebookReducer?.loadingFilters,
  filtersData: (state) => state?.gradebookReducer?.filtersData,
  gradebookData: (state) => state?.gradebookReducer?.performanceData,
  showFilter: (state) => state?.gradebookReducer?.showFilter,
  selectedFilters: (state) => state?.gradebookReducer?.selectedFilters,
  pageDetail: (state) => state?.gradebookReducer?.pageDetail,
}
