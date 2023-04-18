import { omit } from 'lodash'
import { collaborationApi, reportsApi } from '@edulastic/api'
import { notification } from '@edulastic/common'
import { all, call, put, takeLatest } from 'redux-saga/effects'
import { actions } from './actionReducers'
import { GOAL } from '../constants/form'
import { updateStudentCount } from './utils'

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
      msg: `${formType} created successfully`,
    })
  } catch (error) {
    const msg = `Error creating ${formType}.`
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

function* getGroupListSaga() {
  try {
    const response = yield call(collaborationApi.fetchGroups)
    yield put(actions.setGroupList(updateStudentCount(response.result || [])))
  } catch (error) {
    const msg = `Failed to fetch group.`
    notification({ msg: error?.response?.data?.message || msg })
  } finally {
    yield put(actions.getGoalsListComplete())
  }
}

export default function* watcherSaga() {
  yield all([
    takeLatest(actions.saveFormDataRequest, saveFormDataRequestSaga),
    takeLatest(actions.getGoalsList, getGoalsListSaga),
    takeLatest(actions.getGroupList, getGroupListSaga),
  ])
}
