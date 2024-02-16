import { testsApi, youtubeSearchApi } from '@edulastic/api'
import { all, call, put, select, takeLatest } from 'redux-saga/effects'
import { notification } from '@edulastic/common'
import { SentryError } from '@sentry/utils'
import { sessionFilters as sessionFilterKeys } from '@edulastic/constants/const/common'
import { videoQuizActions } from '.'

import { createAssessmentRequestAction } from '../../AssessmentCreate/ducks'
import { vqTestListSelector, vqVideoListSelector } from './selectors'
import { setFilterInSession } from '../../../common/utils/helpers'
import {
  getTestsPageSelector,
  receiveTestSuccessAction,
} from '../../TestList/ducks'
import { getUserIdSelector, getUserOrgId } from '../../src/selectors/user'
import { mapListDataFromTestList, mapListDataFromVideoList } from '../utils'
import { vqConst } from '../const'

function* testSearchRequestSaga({ payload: { search, sort, append = false } }) {
  try {
    const userId = yield select(getUserIdSelector)
    const districtId = yield select(getUserOrgId)
    const testsPage = yield select(getTestsPageSelector)

    const page = append ? testsPage + 1 : 1

    const { items: testList = [], count: totalTestCount } = yield call(
      testsApi.getAll,
      {
        search: {
          ...search,
        },
        sort,
        page,
        limit: vqConst.resultLimit,
      }
    )

    setFilterInSession({
      key: sessionFilterKeys.TEST_FILTER,
      filter: search,
      districtId,
      userId,
    })
    setFilterInSession({
      key: sessionFilterKeys.TEST_SORT,
      filter: sort,
      districtId,
      userId,
    })

    // use in test and other library selects searchType
    const existingList = yield select(vqTestListSelector)

    const formattedTestList = mapListDataFromTestList(testList)

    if (testList?.length) {
      if (append) {
        yield put(
          videoQuizActions.testSearchSuccess({
            testList: [...existingList, ...formattedTestList],
          })
        )
      } else {
        yield put(
          videoQuizActions.testSearchSuccess({
            testList: [...formattedTestList],
          })
        )
      }
      yield put(
        receiveTestSuccessAction({
          entities: [],
          count: totalTestCount,
          page,
          limit: vqConst.resultLimit,
        })
      )
    }
  } catch (err) {
    notification({ type: 'error', messageKey: 'receiveTestFailing' })
  } finally {
    yield put(videoQuizActions.resetIsLoading())
  }
}

function* ytSearchRequestSaga({
  payload: { searchString, nextPageToken = '', append = false },
}) {
  try {
    const {
      items: videoList = [],
      nextPageToken: ytNextPageToken = '',
    } = yield youtubeSearchApi.fetchYoutubeVideos({
      query: searchString,
      safeSearch: 'moderate',
      nextPageToken,
    })
    if (videoList.length) {
      const formattedVideoList = mapListDataFromVideoList(videoList)
      if (append) {
        const vqVideoList = yield select(vqVideoListSelector)
        yield put(
          videoQuizActions.ytSearchSuccess({
            videoList: [...vqVideoList, ...formattedVideoList],
            ytNextPageToken,
          })
        )
      } else {
        yield put(
          videoQuizActions.ytSearchSuccess({
            videoList: [...formattedVideoList],
            ytNextPageToken,
          })
        )
      }
    }
  } catch (error) {
    notification({ type: 'error', messageKey: 'youtubeSearchApiError' })
  } finally {
    yield put(videoQuizActions.resetIsLoading())
  }
}

function* createVQAssessmentRequestSaga({
  payload: { youtubeVideoId, validVideoUrl },
}) {
  try {
    let videoUrl = ''
    let thumbnail = ''
    if (youtubeVideoId) {
      const result = yield call(testsApi.getYoutubeThumbnail, youtubeVideoId)
      if (!result?.cdnLocation) {
        throw new Error('Failed to get thumbnail')
      }
      yield put(
        videoQuizActions.getYoutubeThumbnailSuccess(result?.cdnLocation)
      )
      videoUrl = `${vqConst.ytLinkPrefix}${youtubeVideoId}`
      thumbnail = result.cdnLocation
    } else {
      videoUrl = validVideoUrl
    }
    notification({
      type: 'info',
      messageKey: 'creatingTestForSelectedVideo',
    })
    yield put(
      createAssessmentRequestAction({
        videoUrl,
        ...(thumbnail && { thumbnail }),
      })
    )
  } catch (err) {
    yield put(videoQuizActions.resetIsLoading())
    SentryError.captureException(err)
    const errorMessage =
      err?.response?.data?.message || 'Failed to get thumbnail'
    notification({ type: 'error', msg: errorMessage })
  }
}

export default function* watcherSaga() {
  yield all([
    yield takeLatest(videoQuizActions.testSearchRequest, testSearchRequestSaga),
    yield takeLatest(videoQuizActions.ytSearchRequest, ytSearchRequestSaga),
    yield takeLatest(
      videoQuizActions.createVQAssessmentRequest,
      createVQAssessmentRequestSaga
    ),
  ])
}
