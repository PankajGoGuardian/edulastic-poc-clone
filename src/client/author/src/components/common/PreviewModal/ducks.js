import { createSelector } from 'reselect'
import { createAction } from 'redux-starter-kit'
import {
  call,
  put,
  all,
  takeEvery,
  select,
  takeLatest,
} from 'redux-saga/effects'
import { push } from 'connected-react-router'
import { get, last } from 'lodash'
import { testItemsApi, passageApi } from '@edulastic/api'
import { notification } from '@edulastic/common'
import * as Sentry from '@sentry/browser'
import {
  updateTestAndNavigateAction,
  updateTestSaga,
  getTestSelector,
  setTestsLoadingAction,
} from '../../../../TestPage/ducks'

export const SET_QUESTIONS_IN_PASSAGE =
  '[testItemPreview] set questions to passage'
export const ADD_PASSAGE = '[testItemPreview] add passage to item'
export const SET_ITEM_PREVIEW_DATA = '[testItemPreview] set data'
export const CLEAR_ITEM_PREVIEW = '[testItemPreview] clear item preview'
export const DUPLICATE_TESTITEM_PREVIEW_REQUEST =
  '[testItemPreview] duplicate request'
export const EDIT_NON_AUTHORED_ITEM = '[testItemPreview] edit non authored item'

export const setQuestionsForPassageAction = createAction(
  SET_QUESTIONS_IN_PASSAGE
)
export const addPassageAction = createAction(ADD_PASSAGE)
export const clearPreviewAction = createAction(CLEAR_ITEM_PREVIEW)
export const setPrevewItemAction = createAction(SET_ITEM_PREVIEW_DATA)
export const duplicateTestItemPreviewRequestAction = createAction(
  DUPLICATE_TESTITEM_PREVIEW_REQUEST
)
export const editNonAuthoredItemAction = createAction(EDIT_NON_AUTHORED_ITEM)
export const stateSelector = (state) => state.testItemPreview
export const archivedItemsSelector = (state) =>
  get(state, 'testsAddItems.archivedItems', [])

export const getPassageSelector = createSelector(
  stateSelector,
  archivedItemsSelector,
  (state, archivedItems) => {
    const { passage = {} } = state
    // Filtering archived testItems from passage testItems after deletion
    if (passage) {
      passage.testItems = (passage?.testItems || []).filter(
        (id) => !archivedItems.includes(id)
      )
      return passage
    }
    return null
  }
)

export const getItemDetailSelectorForPreview = (state, id, page) => {
  let testItems = []
  const testItemPreview = get(state, 'testItemPreview.item', {})
  const nextItemId = get(state, 'tests.nextItemId', null)
  if (testItemPreview && testItemPreview.data) {
    return get(state, 'testItemPreview.item')
  }
  if (page === 'addItems' || page === 'itemList') {
    testItems = get(state, 'testsAddItems.items', [])
  } else if (page === 'review') {
    testItems =
      state.tests.entity.itemGroups.flatMap(
        (itemGroup) => itemGroup.items || []
      ) || []
  } else {
    console.warn('unknown page type ', page)
  }
  let item = testItems.find((x) => x._id === id)
  if (!item && page === 'review' && testItems.length) {
    item = testItems.find((x) => x._id === nextItemId)
    if (!item) {
      item = last(testItems)
    }
  }
  if (item?.multipartItem) {
    // markQuestionLabel([item]);
  }
  return item || undefined
}

const itemPreviewSelector = (state) => get(state, 'testItemPreview.item', {})
const passageItemsSelector = (state) => get(state, 'tests.passageItems', [])

export const itemInPreviewModalSelector = createSelector(
  itemPreviewSelector,
  (item) => item
)

export const passageItemIdsSelector = createSelector(
  passageItemsSelector,
  (passageItems) => (passageItems || []).map((item) => String(item?._id))
)

// reducer

const initialState = {
  item: null,
  passage: null,
}

export function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case SET_QUESTIONS_IN_PASSAGE: {
      return {
        ...state,
        item: {
          ...payload,
          data: {
            ...state.item.data,
            questions: payload.data.questions,
          },
        },
      }
    }
    case ADD_PASSAGE: {
      return {
        ...state,
        item: { ...state.item, passageId: payload._id },
        passage: payload,
      }
    }
    case SET_ITEM_PREVIEW_DATA:
      return { ...state, item: payload }
    case CLEAR_ITEM_PREVIEW:
      return initialState
    default:
      return state
  }
}

function* duplicateItemRequestSaga({ payload }) {
  try {
    notification({ type: 'info', msg: 'Cloning items...', duration: 3 })
    const {
      data,
      testId,
      test,
      isTest,
      regradeFlow,
      duplicateWholePassage,
      currentItem,
      isPlaylistTestReview,
      playlistId,
    } = payload
    const { passage } = payload
    const itemId = data.id
    let duplicatedItem = {}
    const isEditEnable = yield select((state) => get(state, 'tests.editEnable'))
    const isTestEditing = test.status === 'draft' || isEditEnable
    if (passage) {
      // Current item selected in preview modal
      // or all test items based on duplicateWholePassage (flag)
      const testItemsToDuplicate = duplicateWholePassage
        ? passage.testItems
        : currentItem
        ? [currentItem]
        : []
      // To duplicate passage we require passageId and testItemsIds
      const passageDuplicateParams = {
        passageId: passage?._id,
        testItemIds: testItemsToDuplicate,
      }

      if (isTestEditing && testId && testId !== 'undefined') {
        passageDuplicateParams.testId = testId
        const hasUnsavedTestData = yield select((state) =>
          get(state, 'tests.updated', false)
        )
        if (hasUnsavedTestData) {
          const _testData = { ...(yield select(getTestSelector)) }
          yield call(updateTestSaga, {
            payload: { id: testId, data: _testData },
          })
        }
      }
      const duplicatedPassage = yield call(
        passageApi.duplicate,
        passageDuplicateParams
      )
      if (duplicateWholePassage && testId && isTestEditing) {
        notification({
          msg: `${testItemsToDuplicate.length} items added to test`,
          type: 'success',
        })
      }

      // using first item to show when redirected to itemDetails page
      duplicatedItem._id = duplicatedPassage?.testItems?.[0]
    } else {
      duplicatedItem = yield call(testItemsApi.duplicateTestItem, itemId)
    }
    if (isTest && !isTestEditing) {
      return yield put(
        push({
          pathname: `/author/items/${duplicatedItem._id}/item-detail`,
          state: {
            testAuthoring: false,
            testId,
            isPlaylistTestReview,
            playlistId,
          },
        })
      )
    }
    if (isTest) {
      const _payload = {
        pathname: `/author/tests/${testId}/editItem/${duplicatedItem._id}`,
        fadeSidebar: true,
        regradeFlow,
        testId,
        isDuplicating: true,
        passage,
      }
      if (testId !== test.previousTestId) {
        _payload.previousTestId = test.previousTestId
      }
      yield put(updateTestAndNavigateAction(_payload))
    } else {
      yield put(push(`/author/items/${duplicatedItem._id}/item-detail`))
    }
  } catch (e) {
    Sentry.captureException(e)
    console.error('duplicateItemrequest error - ', e)
    notification({ messageKey: 'duplicationItemError' })
  }
}

// editing an item without edit permission.
function* editNonAuthoredItemSaga({ payload }) {
  try {
    const {
      itemId,
      testId,
      replaceOldItem,
      passageItems: testItemIds,
      passageId,
    } = payload
    const test = { ...(yield select(getTestSelector)) }
    yield call(updateTestSaga, {
      payload: { id: testId, data: test },
    })
    yield put(setTestsLoadingAction(true))
    let duplicateItemId = 'new'
    if (testItemIds && passageId) {
      const duplicatedPassage = yield call(passageApi.duplicate, {
        passageId,
        testItemIds,
        testId,
        replaceOldItem,
      })
      duplicateItemId = duplicatedPassage?.testItems?.[0]
    } else {
      const duplicatedItem = yield call(
        testItemsApi.duplicateTestItem,
        itemId,
        {
          testId,
          replaceOldItem,
        }
      )
      duplicateItemId = duplicatedItem._id
    }
    const path = `/author/tests/${testId}/editItem/${duplicateItemId}`
    const _payload = {
      fadeSidebar: true,
      regradeFlow: true,
    }
    if (testId !== test.previousTestId) {
      _payload.previousTestId = test.previousTestId
    }
    yield put(push(path, _payload))
    yield put(setTestsLoadingAction(false))
  } catch (e) {
    yield put(setTestsLoadingAction(false))
    Sentry.captureException(e)
    notification({ messageKey: 'errorUpdatingTest' })
    console.error('err', e)
  }
}

export function* watcherSaga() {
  yield all([
    yield takeEvery(
      DUPLICATE_TESTITEM_PREVIEW_REQUEST,
      duplicateItemRequestSaga
    ),
    yield takeLatest(EDIT_NON_AUTHORED_ITEM, editNonAuthoredItemSaga),
  ])
}
