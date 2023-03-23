import { message } from 'antd'
import { notification } from '@edulastic/common'
import { createSlice } from 'redux-starter-kit'
import { takeEvery, call, put, putResolve, all } from 'redux-saga/effects'
import { userApi } from '@edulastic/api'
import { push } from 'connected-react-router'
import { fetchUserAction } from '../student/Login/ducks'

const slice = createSlice({
  name: 'parentCode', //! FIXME key should be `slice` not `name`
  initialState: {
    loading: true,
    parentUserId: null,
    passwordProgress: false,
  },
  reducers: {
    sendParentCodeRequest: (state, { payload }) => {
      state.loading = true
    },
    sendParentCodeSucess: (state, { payload }) => {
      const { username, userId } = payload
      state.parentUserId = userId
      state.username = username
      state.loading = false
    },
    sendParentCodeError: (state) => {
      state.loading = false
    },
    hideLoading: (state) => {
      state.loading = false
      state.passwordProgress = false
    },
    resetPasswordRequest: (state) => {
      state.passwordProgress = true
    },
  },
})

export { slice }

function* sendParentCodeSaga({ payload }) {
  try {
    const result = yield call(userApi.sendParentCode, payload)
    if (result === 'expired') {
      notification({ messageKey: 'errorParentCodeExpired' })
      yield put(push('/login'))
    }
    if (!result) {
      notification({ messageKey: 'errorParentCodeNotFound' })
      yield put(push('/login'))
    }
    yield put(slice.actions.sendParentCodeSucess(result))
  } catch (e) {
    notification({ messageKey: 'errorParentCode' })
    yield put(slice.actions.sendParentCodeError())
    console.log('sendParent error', e)
  }
}

function* resetPasswordSaga({ payload }) {
  try {
    const { username, password: newPassword, role } = payload
    const result = yield call(userApi.resetMyPassword, {
      username,
      newPassword,
      role,
    })
    yield put(fetchUserAction())
    window.location.href = '/home/assignments'
  } catch (e) {
    notification({ messageKey: 'errorSettingPassword' })
    yield put(slice.actions.hideLoading())
    console.log('setting password error', e)
  }
}

export function* watcherSaga() {
  yield all([
    yield takeEvery(slice.actions.sendParentCodeRequest, sendParentCodeSaga),
    yield takeEvery(slice.actions.resetPasswordRequest, resetPasswordSaga),
  ])
}
