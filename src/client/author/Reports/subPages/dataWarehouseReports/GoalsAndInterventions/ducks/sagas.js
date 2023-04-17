import { omit } from 'lodash'
import { reportsApi } from '@edulastic/api'
import { notification } from '@edulastic/common'
import { all, call, put, takeLatest } from 'redux-saga/effects'
import { actions } from './actionReducers'
import { GOAL } from '../constants/form'

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
    yield put(actions.saveFormDataComplete(false))
  }
}

export default function* watcherSaga() {
  yield all([takeLatest(actions.saveFormDataRequest, saveFormDataRequestSaga)])
}
