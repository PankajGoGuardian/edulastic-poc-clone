import { testsApi, youtubeSearchApi } from '@edulastic/api'
import { all, call, put, select, takeLatest } from 'redux-saga/effects'
import { captureSentryException, notification } from '@edulastic/common'

import { SMART_FILTERS } from '@edulastic/constants/const/filters'
import { videoQuizActions } from '.'
import { createAssessmentRequestAction } from '../../AssessmentCreate/ducks'
import {
  vqPageSelector,
  vqTestListSelector,
  vqVideoListSelector,
} from './selectors'

import { mapListDataFromTestList, mapListDataFromVideoList } from '../utils'
import { vqConst } from '../const'
import { DEFAULT_TEST_TITLE } from '../../TestPage/utils'

function* testSearchRequestSaga({ payload: { search, sort, append = false } }) {
  try {
    const vqPage = yield select(vqPageSelector)

    const page = append ? vqPage + 1 : 1

    const { items: testList = [], count: totalTestCount } = yield call(
      testsApi.getAll,
      {
        search: {
          ...search,
          status:
            search.filter === SMART_FILTERS.ENTIRE_LIBRARY ? '' : search.status,
        },
        sort,
        page,
        limit: vqConst.resultLimit,
      }
    )

    // use in test and other library selects searchType
    const existingList = yield select(vqTestListSelector)

    const formattedTestList = mapListDataFromTestList(testList)

    if (append) {
      yield put(
        videoQuizActions.testSearchSuccess({
          testList: [...existingList, ...formattedTestList],
          count: totalTestCount,
          page,
        })
      )
    } else {
      yield put(
        videoQuizActions.testSearchSuccess({
          testList: [...formattedTestList],
          count: totalTestCount,
          page,
        })
      )
    }
  } catch (err) {
    yield put(videoQuizActions.testSearchFailure())
    notification({ type: 'error', messageKey: 'receiveTestFailing' })
  }
}

function* ytSearchRequestSaga({
  payload: { searchString, nextPageToken = '', append = false },
}) {
  try {
    const {
      items: videoList = [],
      nextPageToken: ytNextPageToken = '',
      pageInfo: { totalResult: ytTotalResult = 0 },
    } = yield youtubeSearchApi.fetchYoutubeVideos({
      query: searchString,
      safeSearch: 'moderate',
      nextPageToken,
    })

    const formattedVideoList = mapListDataFromVideoList(videoList)
    if (append) {
      const vqVideoList = yield select(vqVideoListSelector)
      yield put(
        videoQuizActions.ytSearchSuccess({
          videoList: [...vqVideoList, ...formattedVideoList],
          ytNextPageToken,
          ytTotalResult,
        })
      )
    } else {
      yield put(
        videoQuizActions.ytSearchSuccess({
          videoList: [...formattedVideoList],
          ytNextPageToken,
          ytTotalResult,
        })
      )
    }
  } catch (error) {
    notification({ type: 'error', messageKey: 'youtubeSearchApiError' })
    yield put(videoQuizActions.ytSearchFailure())
  }
}

function* getYoutubeThumbnail(youtubeVideoId) {
  try {
    yield put(videoQuizActions.getYoutubeThumbnailRequest())
    return yield call(testsApi.getYoutubeThumbnail, youtubeVideoId)
  } catch (error) {
    captureSentryException(error)
    yield put(videoQuizActions.getYoutubeThumbnailFailure())
  }
}

function* createVQAssessmentRequestSaga({
  payload: {
    youtubeVideoId,
    validVideoUrl,
    selectedVideoTitle = '',
    searchParam = '',
  },
}) {
  try {
    let videoUrl = ''
    let thumbnail = ''
    let title = ''

    if (youtubeVideoId) {
      const result = yield getYoutubeThumbnail(youtubeVideoId)

      if (!result?.cdnLocation) {
        throw new Error('Failed to get thumbnail')
      }

      if (!(selectedVideoTitle || '').trim().length) {
        try {
          const data = yield call(
            youtubeSearchApi.fetchVideoDetails,
            youtubeVideoId
          )

          const { snippet: { title: videoTitle = '' } = {} } =
            (data?.items || []).find(({ id }) => id === youtubeVideoId) || {}

          title = videoTitle
        } catch (error) {
          captureSentryException(error)
        }
      } else {
        title = selectedVideoTitle
      }
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
        title: title.trim() || DEFAULT_TEST_TITLE,
        searchParam,
      })
    )
  } catch (err) {
    yield put(videoQuizActions.resetIsLoading())
    captureSentryException(err)
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
