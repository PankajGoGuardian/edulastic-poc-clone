import {
  courseApi,
  dataWarehouseApi,
  groupApi,
  reportsApi,
  schoolApi,
} from '@edulastic/api'
import { notification } from '@edulastic/common'
import { database } from '@edulastic/constants'
import { TEACHER } from '@edulastic/constants/const/roleType'
import { get, isEmpty, omit, omitBy } from 'lodash'
import moment from 'moment'
import { all, call, put, select, takeLatest } from 'redux-saga/effects'
import {
  getSchoolsByUserRoleSelector,
  getUserId,
  getUserOrgData,
  getUserOrgId,
  getUserRole,
} from '../../../../../src/selectors/user'
import { titleCase, ucFirst } from '../common/utils'
import { GOAL } from '../constants/form'
import { actions } from './actionReducers'
import { fieldKey } from './constants'
import { getAdvancedSearchFilterSelector } from './selectors'

function* saveFormDataRequestSaga({ payload }) {
  const { formType } = payload
  const isGoalFormType = formType === GOAL
  try {
    const apiToCall = isGoalFormType
      ? reportsApi.createGoal
      : reportsApi.createIntervention
    yield call(apiToCall, omit(payload, 'formType'))
    notification({
      type: 'success',
      msg: `${ucFirst(titleCase(formType))} created successfully`,
    })
  } catch (error) {
    const msg = `Error creating ${ucFirst(titleCase(formType))}.`
    notification({ msg: error?.response?.data?.message || msg })
  } finally {
    yield put(actions.saveFormDataComplete())
  }
}

function* getGoalsListSaga() {
  try {
    const goalsList = yield call(reportsApi.getGoals)
    yield put(actions.setGoalsList(goalsList))
  } catch (error) {
    const msg = `Failed to fetch goals.`
    notification({ msg: error?.response?.data?.message || msg })
  } finally {
    yield put(actions.getGoalsListComplete())
  }
}

function* getInterventionsListSaga({ payload }) {
  try {
    const interventionsList = yield call(
      reportsApi.getInterventions,
      omit(payload, 'id')
    )

    if (payload) {
      yield put(
        actions.setRelatedInterventions({ [payload.id]: interventionsList })
      )
    } else {
      yield put(actions.setInterventionsList(interventionsList))
    }
  } catch (error) {
    const msg = `Failed to fetch interventions.`
    notification({ msg: error?.response?.data?.message || msg })
  } finally {
    yield put(actions.getInterventionsListComplete())
  }
}

function* getAttendanceBandListSaga() {
  try {
    const attendanceBandList = yield call(reportsApi.fetchAttendanceBands)
    yield put(actions.setAttendanceBandList(attendanceBandList))
  } catch (error) {
    const msg = `Failed to fetch performance band.`
    notification({ msg: error?.response?.data?.message || msg })
  } finally {
    yield put(actions.getAttendanceBandListComplete())
  }
}

function* saveGroup({ payload }) {
  try {
    const query = yield select(getAdvancedSearchFilterSelector)
    const userId = yield select(getUserId)
    const districtId = yield select(getUserOrgId)
    const userOrgData = yield select(getUserOrgData)
    const groupData = payload
    // default start and end date
    groupData.parent = { id: userId }
    groupData.owners = [userId]
    groupData.type = 'custom'
    const term =
      userOrgData.terms.length &&
      userOrgData.terms.find(
        (t) => t.endDate > Date.now() && t.startDate < Date.now()
      )
    const defaultStartDate = moment()
    const defaultEndDate = term ? term.endDate : defaultStartDate.add(1, 'year')
    groupData.districtId = districtId

    groupData.endDate = moment(defaultEndDate).format('x')
    groupData.startDate = moment(defaultStartDate).format('x')

    const requestBody = omitBy(groupData, (value) => {
      if (typeof value === 'string' && !value.length) {
        return true
      }
      if (Array.isArray(value) && !value.length) {
        return true
      }
      return false
    })

    const response = yield call(dataWarehouseApi.saveGroupdDataWithAdvSearch, {
      groupData: requestBody,
      query,
    })

    yield put(actions.saveGroupComplete(get(response, 'data.result')))
    yield put(actions.setAdvancedSearchQuery())
    notification({
      type: 'success',
      msg: `Student group created successfully.`,
    })
  } catch (error) {
    const errorMessage = 'Unable to create group'
    notification({ type: 'error', msg: errorMessage })
    yield put(actions.saveGroupComplete())
  }
}

// 4. generator function
function* getAdvancedSearchClasses({ payload }) {
  try {
    const districtId = yield select(getUserOrgId)
    const requestBody = {
      limit: 25,
      page: 1,
      queryType: 'OR',
      includes: ['name'],
      districtId,
      search: {
        institutionIds: [],
        subjects: [],
        grades: [],
        active: [1],
        tags: [],
        name: payload.searchString,
      },
    }

    const response = yield call(groupApi.getGroups, requestBody)
    yield put(
      actions.setAdvancedSearchDetails({
        key: fieldKey.classes,
        data: response?.hits || [],
      })
    )
  } catch (error) {
    console.log(error)
    notification({ messageKey: 'somethingWentPleaseTryAgain' })
    yield put(actions.setAdvancedSearchDetails({ key: 'classes', data: [] }))
  }
}

function* getAdvancedSearchSchools({ payload }) {
  try {
    const districtId = yield select(getUserOrgId)
    const schoolsByUserRole = yield select(getSchoolsByUserRoleSelector)
    const userRole = yield select(getUserRole)
    const schoolIds = schoolsByUserRole.map(({ _id }) => _id).filter((x) => x)

    const requestBody = {
      limit: 25,
      districtId,
      search: {
        name: [
          { type: database.MATCH_TYPE.CONTAINS, value: payload.searchString },
        ],
      },
      sortField: 'name',
      order: database.SORT_ORDER.ASC,
    }

    if (userRole === TEACHER) {
      requestBody.schoolIds = schoolIds
    }

    const schools = yield call(schoolApi.getSchools, requestBody)
    yield put(
      actions.setAdvancedSearchDetails({
        key: fieldKey.schools,
        data: schools?.data || [],
      })
    )
  } catch (error) {
    console.log(error)

    notification({ messageKey: 'somethingWentPleaseTryAgain' })
    yield put(actions.setAdvancedSearchDetails({ key: 'schools', data: [] }))
  }
}
function* getAdvancedSearchCourses({ payload }) {
  try {
    const districtId = yield select(getUserOrgId)
    const requestBody = {
      limit: 25,
      page: 1,
      aggregate: true,
      active: 1,
      includes: ['name'],
      districtId,
      search: {
        name: [
          { type: database.MATCH_TYPE.CONTAINS, value: payload.searchString },
        ],
      },
      sortField: 'name',
      order: database.SORT_ORDER.ASC,
    }

    const response = yield call(courseApi.searchCourse, requestBody)
    const courses = []
    for (const key of Object.keys(response.result)) {
      courses.push({
        _id: response.result[key]?.[0],
        name: key,
      })
    }
    yield put(
      actions.setAdvancedSearchDetails({
        key: fieldKey.courses,
        data: courses || [],
      })
    )
  } catch (error) {
    console.log(error)

    notification({ messageKey: 'somethingWentPleaseTryAgain' })
    yield put(actions.setAdvancedSearchDetails({ key: 'courses', data: [] }))
  }
}

function* getAdvancedSearchAttendanceBand() {
  try {
    const response = yield call(reportsApi.fetchAttendanceBands)
    yield put(
      actions.setAdvancedSearchDetails({
        key: fieldKey.attendanceBands,
        data: !isEmpty(response) ? response : [],
        isAttendanceBand: true,
      })
    )
  } catch (error) {
    notification({ messageKey: 'somethingWentPleaseTryAgain' })
    yield put(
      actions.setAdvancedSearchDetails({
        key: fieldKey.attendanceBands,
        data: [],
      })
    )
  }
}
// function* setAdvancedSearchPerformanceBand({ payload }) {}
function* getAdvancedSearchData({ payload }) {
  try {
    const { query, paginationDetails } = payload

    const response = yield call(
      dataWarehouseApi.goalsAndInterventionsAdvanceSearchStudents,
      query,
      paginationDetails
    )

    const students = get(response, 'data.result', [])

    if (isEmpty(students)) {
      notification({
        type: 'info',
        msg: `No students are available in current search criteria`,
      })
      return yield put(actions.setAdvancedSearchDataComplete())
    }
    const { page = 1 } = paginationDetails

    yield put(
      actions.setAdvancedSearchDataComplete(
        students.map((student) => ({ ...student, page }))
      )
    )
  } catch (error) {
    const errorMessage = `Unable to fetch students's list`
    notification({ type: 'error', msg: errorMessage })
    yield put(actions.setAdvancedSearchDataComplete())
  }
}

export default function* watcherSaga() {
  yield all([
    takeLatest(actions.saveFormDataRequest, saveFormDataRequestSaga),
    takeLatest(actions.getGoalsList, getGoalsListSaga),
    takeLatest(actions.getInterventionsList, getInterventionsListSaga),
    takeLatest(actions.getAttendanceBandList, getAttendanceBandListSaga),
    takeLatest(actions.getAdvancedSearchClasses, getAdvancedSearchClasses),
    takeLatest(actions.getAdvancedSearchSchools, getAdvancedSearchSchools),
    takeLatest(actions.getAdvancedSearchCourses, getAdvancedSearchCourses),
    takeLatest(
      actions.getAdvancedSearchAttendanceBands,
      getAdvancedSearchAttendanceBand
    ),
    takeLatest(actions.getAdvancedSearchData, getAdvancedSearchData),
    takeLatest(actions.saveGroup, saveGroup),
  ])
}
