/* eslint-disable */
import { createSelector } from 'reselect'
import uuid from 'uuid/v4'
import {
  cloneDeep,
  keyBy as _keyBy,
  omit as _omit,
  get,
  flatten,
  pull,
  uniqBy,
  uniq,
  isEmpty,
  set,
  isArray,
} from 'lodash'
import { testItemsApi, passageApi, attchmentApi } from '@edulastic/api'
import { questionType, roleuser } from '@edulastic/constants'
import { delay } from 'redux-saga'
import {
  call,
  put,
  all,
  takeEvery,
  takeLatest,
  select,
  take,
} from 'redux-saga/effects'
import { storeInLocalStorage } from '@edulastic/api/src/utils/Storage'

import { createAction } from 'redux-starter-kit'
import { replace, push } from 'connected-react-router'
import produce from 'immer'
import { captureSentryException, notification } from '@edulastic/common'
import * as Sentry from '@sentry/browser'
import {
  loadQuestionsAction,
  addItemsQuestionAction,
  deleteQuestionAction,
  changeCurrentQuestionAction,
  UPDATE_QUESTION,
  changeUpdatedFlagAction,
  addQuestionAction,
  getCurrentQuestionSelector,
  isRegradeFlowSelector,
  getQuestionsSelector,
} from '../sharedDucks/questions'
import {
  CLEAR_DICT_ALIGNMENTS,
  SAVE_QUESTION_ERROR,
} from '../src/constants/actions'
import {
  isIncompleteQuestion,
  hasImproperDynamicParamsConfig,
  isOptionsRemoved,
  validateScore,
  getQuestionIndexFromItemData,
  isV1MultipartItem,
} from '../questionUtils'
import {
  setTestItemsAction,
  getSelectedItemSelector,
} from '../TestPage/components/AddItems/ducks'
import {
  getTestEntitySelector,
  setTestDataAndUpdateAction,
  setTestDataAction,
  setCreatedItemToTestAction,
  setTestPassageAction,
  setPassageItemsAction,
  getPassageItemsSelector,
  hasSectionsSelector,
  getCurrentGroupIndexSelector,
} from '../TestPage/ducks'
import { changeViewAction } from '../src/actions/view'

import { setQuestionCategory } from '../src/actions/pickUpQuestion'

import {
  getOrgDataSelector,
  isPublisherUserSelector,
  getUserRole,
  isOrganizationDistrictUserSelector,
  getIsCurator,
  getUserOrgId,
  allowedToSelectMultiLanguageInTest,
} from '../src/selectors/user'

import {
  getAlignmentFromQuestionSelector,
  setDictAlignmentFromQuestion,
  getIsGradingCheckboxState,
  SAVE_QUESTION_REQUEST,
  addAuthoredItemsAction,
  resourceTypeQuestions,
} from '../QuestionEditor/ducks'
import { getNewAlignmentState } from '../src/reducers/dictionaries'
import {
  getDictionariesAlignmentsSelector,
  getRecentStandardsListSelector,
  getRecentCollectionsListSelector,
} from '../src/selectors/dictionaries'
import {
  updateRecentStandardsAction,
  updateRecentCollectionsAction,
} from '../src/actions/dictionaries'
import { markQuestionLabel } from './Transformer'
import { getUserFeatures } from '../../student/Login/ducks'
import {
  addLoadingComponentAction,
  removeLoadingComponentAction,
} from '../src/actions/authorUi'
import { reSequenceQuestionsWithWidgets } from '../../common/utils/helpers'
import { getCurrentLanguage } from '../../common/components/LanguageSelectorTab/duck'
import {
  ENGLISH,
  LANGUAGES_OPTIONS,
  LANGUAGE_ES,
} from '@edulastic/constants/const/languages'
import { PassageDefaultTemplate } from '@edulastic/constants/const/questionType'

// constants
const testItemStatusConstants = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
  INREVIEW: 'inreview',
}

export const RECEIVE_ITEM_DETAIL_REQUEST = '[itemDetail] receive request'
export const RECEIVE_ITEM_DETAIL_SUCCESS = '[itemDetail] receive success'
export const RECEIVE_ITEM_DETAIL_ERROR = '[itemDetail] receive error'
export const SET_ITEM_QIDS = '[itemDetail] set qids'

export const UPDATE_ITEM_DOC_BASED_REQUEST =
  '[itemDetail] update doc based by id request'
export const UPDATE_ITEM_DETAIL_REQUEST = '[itemDetail] update by id request'
export const UPDATE_ITEM_DETAIL_SUCCESS = '[itemDetail] update by id success'
export const UPDATE_ITEM_DETAIL_ERROR = '[itemDetail] update by id error'
export const UPDATE_ITEM_DETAIL_ITEM_DATA =
  '[itemDetail] update item detail item data'
export const CLEAR_ITEM_DETAIL = '[itemDetail] clear item detail'
export const SET_ITEM_DETAIL_DATA = '[itemDetail] set data'
export const SET_ITEM_DETAIL_ITEM_LEVEL_SCORING =
  '[itemDetail] set item level scoring'
export const SET_ITEM_DETAIL_MULTIPART_EVALUATION_SETTING =
  '[itemDetail] set multipart evaluation setting'
export const SET_ITEM_LEVEL_SCORING_FROM_RUBRIC =
  '[itemDetail] set item level scoring from rubric'
export const SET_ITEM_DETAIL_SCORE = '[itemDetail] set item score'
export const INC_ITEM_DETAIL_SCORE = '[itemDetail] increment item score'
export const DEC_ITEM_DETAIL_SCORE = '[itemDetail] decrement item score'
export const UPDATE_ITEM_DETAIL_DIMENSION = '[itemDetail] update dimension'
export const ADD_QUESTION = '[author questions] add question'
export const REMOVE_QUESTION_BY_ID = '[author questions] delete question by id'
export const SET_DRAGGING = '[itemDetail] set dragging'

export const DELETE_ITEM_DETAIL_WIDGET = '[itemDetail] delete widget'
export const UPDATE_TAB_TITLE = '[itemDetail] update tab title'
export const USE_TABS = '[itemDetail] is use tabs'
export const ADD_TAB = '[itemDetail] add new tab'
export const CHANGE_TAB_TITLE = '[itemDetail] change tab title'
export const REMOVE_TAB = '[itemDetail] remove tab'
export const USE_FLOW_LAYOUT = '[itemDetail] is use flow layout'
export const MOVE_WIDGET = '[itemDetail] move widget'
export const MOVE_WIDGET_APPLY = '[itemDetail] move widget apply'
export const ITEM_DETAIL_PUBLISH = '[itemDetail] publish test item'
export const UPDATE_TESTITEM_STATUS = '[itemDetail] update test item status'
export const UPDATE_COMPLETED = '[itemDetail] item update completed'
export const ITEM_SET_REDIRECT_TEST = '[itemDetail] set redirect test id'
export const ITEM_CLEAR_REDIRECT_TEST = '[itemDetail] clear redirect test id'
export const DELETE_ITEM_DETAIL_WIDGET_APPLY =
  '[itemDetail] delete widget apply'

export const SAVE_CURRENT_EDITING_TEST_ID =
  '[itemDetail] save current editing test id'
export const SHOW_PUBLISH_WARNING_MODAL =
  '[itemDetail] show publish warning modal'
export const PROCEED_PUBLISH_ACTION = '[itemDeatil] goto metadata page'
export const SAVE_CURRENT_TEST_ITEM = '[itemDetail] save current test item'
export const CONVERT_TO_MULTIPART = '[itemDetail] convert item to multipart'
export const CONVERT_TO_PASSAGE_WITH_QUESTIONS =
  '[itemDetail] convert to passage with questions'
export const ADD_PASSAGE = '[itemDetail] add passage to item'
export const SAVE_PASSAGE = '[itemDetail] save passage to item'
export const UPDATE_PASSAGE_STRUCTURE = '[itemDetail] update passage structure'
export const ADD_WIDGET_TO_PASSAGE = '[itemDetail] add widget to passage'
export const DELETE_ITEM = '[itemDetail] delete item'
export const DELETE_ITEM_SUCCESS = '[itemDetail] delete item success'
export const SET_DELETING_ITEM = '[itemDetail] item deletion in progress'
export const DELETE_WIDGET_FROM_PASSAGE =
  '[itemDetail] delete widget from passage'
export const UPDATE_ITEM_TO_PASSAGE_TYPE =
  '[itemDetail] convert item to passage type'
export const SET_COLLECTIONS = '[itemDetail] set collections'
export const SET_HIGHLIGHT_COLLECTION = '[itemDetail] set highlight collection'

export const RECEIVE_QUESTION_PREVIEW_ATTACHMENT_REQUEST =
  '[question] recieve question preview attachment request'
export const RECEIVE_QUESTION_PREVIEW_ATTACHMENT_SUCCESS =
  '[question] recieve question preview attachment success'
export const RECEIVE_QUESTION_PREVIEW_ATTACHMENT_FAILURE =
  '[question] recieve question preview attachment failure'
export const SAVE_AND_PUBLISH_ITEM =
  '[question, itemDetail] save question and publish item'
export const PROCEED_TO_PUBLISH_ITEM = '[itemDetail] proceed to publish item'

const EDIT_MULTIPART_WIDGET = '[itemDetail] edit multipart widget'
const ADD_ITEM_TO_CART = '[item list] add item to cart'
export const SAVE_CURRENT_ITEM_MOVE_TO_NEXT =
  '[itemDetail] save current item and paginate'
const SET_PASSAGE_UPDATE_IN_PROGRESS =
  '[itemDetail] set passage update in progress'
const SET_TEST_ITEMS_SAVING = '[itemDetail] set test item saving in progress'

// actions

//
export const togglePublishWarningModalAction = createAction(
  SHOW_PUBLISH_WARNING_MODAL
)
export const proceedPublishingItemAction = createAction(PROCEED_PUBLISH_ACTION)
export const saveCurrentTestItemAction = createAction(SAVE_CURRENT_TEST_ITEM)
export const convertItemToMultipartAction = createAction(CONVERT_TO_MULTIPART)
export const convertItemToPassageWithQuestionsAction = createAction(
  CONVERT_TO_PASSAGE_WITH_QUESTIONS
)
export const addPassageAction = createAction(ADD_PASSAGE)
export const savePassageAction = createAction(SAVE_PASSAGE)
export const updatePassageStructureAction = createAction(
  UPDATE_PASSAGE_STRUCTURE
)
export const addWidgetToPassageAction = createAction(ADD_WIDGET_TO_PASSAGE)
export const deleteItemAction = createAction(DELETE_ITEM)
export const deleteItemSuccesAction = createAction(DELETE_ITEM_SUCCESS)
export const deleteWidgetFromPassageAction = createAction(
  DELETE_WIDGET_FROM_PASSAGE
)
export const setCollectionsAction = createAction(SET_COLLECTIONS)
export const setItemLevelScoreFromRubricAction = createAction(
  SET_ITEM_LEVEL_SCORING_FROM_RUBRIC
)
export const setHighlightCollectionAction = createAction(
  SET_HIGHLIGHT_COLLECTION
)
export const fetchQuestionPreviewAttachmentsAction = createAction(
  RECEIVE_QUESTION_PREVIEW_ATTACHMENT_REQUEST
)
export const saveAndPublishItemAction = createAction(SAVE_AND_PUBLISH_ITEM)
export const proceedToPublishItemAction = createAction(PROCEED_TO_PUBLISH_ITEM)

export const getItemDetailByIdAction = (id, params) => ({
  type: RECEIVE_ITEM_DETAIL_REQUEST,
  payload: { id, params },
})

export const updateItemsDocBasedByIdAction = (
  id,
  data,
  keepData,
  redirect = true
) => ({
  type: UPDATE_ITEM_DOC_BASED_REQUEST,
  payload: { id, data, keepData, redirect },
})

export const receiveItemDetailSuccess = (item) => ({
  type: RECEIVE_ITEM_DETAIL_SUCCESS,
  payload: { item },
})

export const updateItemDetailItemDataAction = (item) => ({
  type: UPDATE_ITEM_DETAIL_ITEM_DATA,
  payload: item,
})

export const receiveItemDetailError = (error) => ({
  type: RECEIVE_ITEM_DETAIL_ERROR,
  payload: { error },
})

export const setItemDetailDataAction = (item) => ({
  type: SET_ITEM_DETAIL_DATA,
  payload: { item },
})

export const updateItemDetailByIdAction = (
  id,
  data,
  testId,
  addToTest = false,
  locationState = false,
  redirect = true,
  redirectOnDeleteQuestion = true,
  updateScoreInQuestionsAsPerItem = false
) => ({
  type: UPDATE_ITEM_DETAIL_REQUEST,
  payload: {
    id,
    data,
    testId,
    addToTest,
    redirect,
    locationState,
    redirectOnDeleteQuestion,
    updateScoreInQuestionsAsPerItem,
  },
})

export const saveCurrentItemAndRoueToOtherAction = (payload) => ({
  type: SAVE_CURRENT_ITEM_MOVE_TO_NEXT,
  payload,
})

export const updateItemDetailSuccess = (item) => ({
  type: UPDATE_ITEM_DETAIL_SUCCESS,
  payload: { item },
})

export const updateItemDetailError = (error) => ({
  type: UPDATE_ITEM_DETAIL_ERROR,
  payload: { error },
})

export const updateItemDetailDimensionAction = (left, right) => ({
  type: UPDATE_ITEM_DETAIL_DIMENSION,
  payload: { left, right },
})

export const setItemDetailDraggingAction = (dragging) => ({
  type: SET_DRAGGING,
  payload: { dragging },
})

export const deleteWidgetAction = (rowIndex, widgetIndex, updateData = {}) => ({
  type: DELETE_ITEM_DETAIL_WIDGET,
  payload: { rowIndex, widgetIndex, updateData },
})

export const updateTabTitleAction = ({ rowIndex, tabIndex, value }) => ({
  type: UPDATE_TAB_TITLE,
  payload: { rowIndex, tabIndex, value },
})

export const useTabsAction = ({ rowIndex, isUseTabs }) => ({
  type: USE_TABS,
  payload: { rowIndex, isUseTabs },
})

export const addTabsAction = (payload) => ({
  type: ADD_TAB,
  payload,
})

export const removeTabAction = (payload) => ({
  type: REMOVE_TAB,
  payload,
})

export const changeTabTitleAction = (index, value, containerType) => ({
  type: CHANGE_TAB_TITLE,
  payload: {
    index,
    value,
    containerType,
  },
})

export const useFlowLayoutAction = ({ rowIndex, isUseFlowLayout }) => ({
  type: USE_FLOW_LAYOUT,
  payload: { rowIndex, isUseFlowLayout },
})

export const moveItemDetailWidgetAction = ({ from, to }) => ({
  type: MOVE_WIDGET,
  payload: { from, to },
})

export const publishTestItemAction = (testItemId) => ({
  type: ITEM_DETAIL_PUBLISH,
  payload: testItemId,
})

export const updateTestItemStatusAction = (status) => ({
  type: UPDATE_TESTITEM_STATUS,
  payload: status,
})

export const clearItemDetailAction = createAction(CLEAR_ITEM_DETAIL)

export const setRedirectTestAction = createAction(ITEM_SET_REDIRECT_TEST)
export const clearRedirectTestAction = createAction(ITEM_CLEAR_REDIRECT_TEST)
export const setItemLevelScoringAction = createAction(
  SET_ITEM_DETAIL_ITEM_LEVEL_SCORING
)
export const setMultipartEvaluationSettingAction = createAction(
  SET_ITEM_DETAIL_MULTIPART_EVALUATION_SETTING
)
export const setItemLevelScoreAction = createAction(SET_ITEM_DETAIL_SCORE)
export const incrementItemLevelScore = createAction(INC_ITEM_DETAIL_SCORE)
export const decrementItemLevelScore = createAction(DEC_ITEM_DETAIL_SCORE)
export const setItemDeletingAction = createAction(SET_DELETING_ITEM)
const setPassageUpdateInProgressAction = createAction(
  SET_PASSAGE_UPDATE_IN_PROGRESS
)
export const setTestItemsSavingAction = createAction(SET_TEST_ITEMS_SAVING)

export const saveCurrentEditingTestIdAction = (id) => ({
  type: SAVE_CURRENT_EDITING_TEST_ID,
  payload: id,
})

export const editMultipartWidgetAction = createAction(EDIT_MULTIPART_WIDGET)

const addItemToCartAction = (item) => ({
  type: ADD_ITEM_TO_CART,
  payload: {
    item,
    fromItemDetail: true,
  },
})

export const itemUpdateCompletedAction = createAction(UPDATE_COMPLETED)

// selectors

export const stateSelector = (state) => state.itemDetail

export const getIsNewItemSelector = createSelector(
  stateSelector,
  (state) => !get(state, 'item.version', 0)
)

export const getItemDetailSelector = createSelector(stateSelector, (state) => {
  const item = state.item || {}
  // creating a copy of questions before mutating them and mutate the copied
  const questions = get(item, 'data,questions', []).map((q) => ({ ...q }))
  const itemWithQuestionsCloned = {
    ...item,
    data: {
      ...item.data,
      questions,
    },
  }
  markQuestionLabel([itemWithQuestionsCloned])
  return item
})

export const getItemSelector = createSelector(
  stateSelector,
  (state) => state.item
)

export const isDerivedFromPremiumBankSelector = createSelector(
  getItemSelector,
  (state) => !!state?.derivedFromPremiumBankId
)

export const getCollectionsSelector = createSelector(
  getItemDetailSelector,
  (state) => state.collections || []
)

export const getItemDetailQuestionsSelector = createSelector(
  getItemSelector,
  (state) => state?.data?.questions || []
)

export const getHighlightCollectionSelector = createSelector(
  stateSelector,
  (state) => state.highlightCollection
)

export const getPassageSelector = createSelector(
  stateSelector,
  (state) => state.passage
)

/**
 * check if item has only a single question widget.
 */
export const isSingleQuestionViewSelector = createSelector(
  getItemDetailSelector,
  (item = {}) => {
    const widgets = flatten(item.rows).reduce(
      (widgets, row) => [...widgets, ...row.widgets],
      []
    )
    return widgets.length === 1
  }
)

export const getRedirectTestSelector = createSelector(
  stateSelector,
  (state) => state.redirectTestId
)

export const getItemIdSelector = createSelector(
  getItemDetailSelector,
  (item) => item && item._id
)

export const getItemLevelScoringSelector = createSelector(
  getItemDetailSelector,
  (item) => item && item.itemLevelScoring
)

export const getTestItemStatusSelector = createSelector(
  getItemDetailSelector,
  (item) => item && item.status
)

export const getRows = (item) =>
  item.rows &&
  item?.rows?.map((row) => ({
    ...row,
    widgets: row?.widgets?.map((widget) => {
      let referencePopulate = {
        data: null,
      }
      let activity = {
        timespent: null,
        qIndex: null,
      }

      if (item.data && item.data.questions && item.data.questions.length) {
        referencePopulate = item.data.questions.find(
          (q) => q._id === widget.reference
        )
      }

      if (widget && widget.entity && widget.entity.activity) {
        const { timespent } = widget.entity.activity
        const { qIndex } = widget.entity.activity
        activity = { timespent, qIndex }
      }

      if (
        !referencePopulate &&
        item.data &&
        item.data.resources &&
        item.data.resources.length
      ) {
        referencePopulate = item.data.resources.find(
          (r) => r._id === widget.reference
        )
      }

      return {
        ...widget,
        activity,
        referencePopulate,
      }
    }),
  }))

export const getItemDetailRowsSelector = createSelector(
  getItemDetailSelector,
  (item) => {
    if (!item) return []
    return getRows(item)
  }
)

export const getPassageUpdateInProgressSelector = createSelector(
  stateSelector,
  (state) => state.passageUpdateInProgress
)

export const getTestItemsSavingSelector = createSelector(
  stateSelector,
  (state) => state.testItemSavingInProgress
)

export const getItemDetailLoadingSelector = createSelector(
  stateSelector,
  (state) => state.loading
)
export const getItemDetailUpdatingSelector = createSelector(
  stateSelector,
  (state) => state.updating
)
export const getItemDetailDraggingSelector = createSelector(
  stateSelector,
  (state) => state.dragging
)

export const getItemDeletingSelector = createSelector(
  stateSelector,
  (state) => state.deleting
)

export const getItemDetailDimensionTypeSelector = createSelector(
  getItemDetailSelector,
  (state) => {
    if (!state || !state.rows) return ''
    const left = state.rows[0].dimension.trim().slice(0, -1)
    const right = state.rows[1]
      ? state.rows[1].dimension.trim().slice(0, -1)
      : '100'
    return `${left}-${right}`
  }
)

export const getItemDetailValidationSelector = createSelector(
  getItemDetailRowsSelector,
  (rows) => {
    const validations = {}
    rows.forEach((row) => {
      row.widgets.forEach(({ entity }) => {
        validations[entity.id] = entity
      })
    })
    return validations
  }
)

export function* generateRecentlyUsedCollectionsList(
  collections,
  itemBanks,
  recentCollectionsList
) {
  const userDistrictId = yield select(getUserOrgId)
  recentCollectionsList = [...recentCollectionsList, ...collections]
  recentCollectionsList = recentCollectionsList.map((collection) => {
    if (typeof collection === 'object') return collection
    return itemBanks.find((data) => data._id === collection)
  })
  recentCollectionsList = uniqBy(recentCollectionsList, '_id')
  storeInLocalStorage(
    `recentCollections_${userDistrictId}`,
    JSON.stringify(recentCollectionsList)
  )
  return recentCollectionsList
}

// reducer

const initialState = {
  item: null,
  passage: null,
  error: null,
  loading: false,
  updating: false,
  updateError: null,
  dragging: false,
  redirectTestId: null,
  currentEditingTestId: null,
  showWarningModal: false,
  highlightCollection: false,
  loadingAuditLogs: false,
  originalItem: null,
  passageUpdateInProgress: false,
  testItemSavingInProgress: false,
}

const deleteWidget = (state, { rowIndex, widgetIndex }) =>
  produce(state, (newState) => {
    if (newState.item.itemLevelScoring) {
      if (newState.qids.length === 1) {
        newState.item.itemLevelScore = 0
      } else if (newState.item.itemLevelScore > 1) {
        newState.item.itemLevelScore = newState.item.itemLevelScore - 1
      }
    }
    const qid = newState.item.rows[rowIndex].widgets[widgetIndex].reference
    newState.item.rows[rowIndex].widgets = newState.item.rows[
      rowIndex
    ].widgets.filter((w, i) => i !== widgetIndex)

    newState.item.data.questions = reSequenceQuestionsWithWidgets(
      get(newState, `item.rows.[${rowIndex}].widgets`),
      get(newState, 'item.data.questions'),
      newState.item.itemLevelScoring
    )

    pull(newState.qids, qid)
  })

const updateDimension = (state, { left, right, ...rest }) => {
  const {
    item: { rows = [] },
  } = state
  if (rows.length > 0 && rows[0].dimension === left) {
    /**
     * fixing page crash here when same option is clicked
     * separate bug is to be logged for fixing page crash
     * will ideally prevent in from the action being called in that
     */

    return state
  }

  /**
   * https://snapwiz.atlassian.net/browse/EV-12853 (comments)
   *
   * allow only resources to be added to the left column
   * allow only questions to be added to the right column
   *
   * below manipulations cater this
   */
  return produce(state, (newState) => {
    newState.item.rows[0].dimension = left

    if (left === '100%') {
      //  if coming from 2 col layout to 1 col layout
      //  shifting all the widgets back in the first column
      if (newState.item.rows[1]) {
        newState.item.rows[0].widgets = newState.item.rows[0].widgets || []
        newState.item.rows[0].widgets = [
          ...newState.item.rows[0].widgets,
          ...(newState.item.rows[1].widgets || []),
        ]
      }
      newState.item.rows.length = 1
    } else {
      // if its a pasage type. left is passage and right is the testItem
      if (newState.item.passageId) {
        newState.item.rows[0].dimension = right
        newState.passage.structure.dimension = left
      } else if (!newState.item.rows[1]) {
        // normal multipart

        const firstRowWidgets = newState.item.rows[0].widgets
        const resources = firstRowWidgets.filter(
          (widget) => widget.widgetType !== 'question'
        )
        const questions = firstRowWidgets.filter(
          (widget) => widget.widgetType === 'question'
        )

        newState.item.rows[0].widgets = resources // keep only the resources at the left panel
        newState.item.rows[1] = {
          tabs: [],
          dimension: right,
          widgets: questions, // keep only questions on the right column
        }
      } else {
        newState.item.rows[1].dimension = right
      }
    }
  })
}

const updateTabTitle = (state, { rowIndex, tabIndex, value }) => {
  const newState = cloneDeep(state)
  newState.item.rows[rowIndex].tabs[tabIndex] = value
  return newState
}

const useTabs = (state, { rowIndex, isUseTabs }) =>
  produce(state, (newState) => {
    const { item, passage } = newState
    if (item.passageId) {
      if (rowIndex === 0) {
        passage.structure.tabs = isUseTabs ? ['Tab 1', 'Tab 2'] : []
      } else {
        item.rows[0].tabs = isUseTabs ? ['Tab 1', 'Tab 2'] : []
      }
    } else if (newState.item.rows[rowIndex]) {
      newState.item.rows[rowIndex].tabs = isUseTabs ? ['Tab 1', 'Tab 2'] : []
    }
    return newState
  })

const addTabs = (state) =>
  produce(state, (newState) => {
    const { passage } = newState
    if (passage.structure.tabs.length === 0) {
      passage.structure.tabs = ['Tab 1', 'Tab 2']
    } else {
      passage.structure.tabs.push(`Tab ${passage.structure.tabs.length + 1}`)
    }
    return newState
  })

const removeTab = (state, payload) =>
  produce(state, (newState) => {
    const { passage } = newState
    if (passage.structure.tabs.length === 2) {
      passage.structure.tabs = []
    } else if (passage.structure.tabs.length >= payload) {
      passage.structure.tabs.splice(payload, 1)
    }
    const { updatedWidgets, deletedWidgetIds } = (
      passage?.structure?.widgets || []
    ).reduce(
      (acc, curr) => {
        if (curr.tabIndex === payload) {
          acc.deletedWidgetIds.push(curr.reference)
        } else {
          let { tabIndex } = curr
          if (tabIndex > payload) {
            tabIndex--
          }
          acc.updatedWidgets.push({ ...curr, tabIndex })
        }
        return acc
      },
      {
        updatedWidgets: [],
        deletedWidgetIds: [],
      }
    )
    passage.structure.widgets = updatedWidgets
    passage.data = passage.data.filter(
      ({ id }) => !deletedWidgetIds.includes(id)
    )
    return newState
  })

const changeTabTitle = (state, payload) => {
  const { index, value, containerType } = payload
  return produce(state, (newState) => {
    const {
      passage,
      item: { rows },
    } = newState
    const tabs =
      containerType === 'passage'
        ? get(passage, 'structure.tabs', [])
        : get(rows, [0, 'tabs'], [])

    tabs[index] = value

    return newState
  })
}

const useFlowLayout = (state, { rowIndex, isUseFlowLayout }) => {
  const newState = cloneDeep(state)
  if (newState.item.rows[rowIndex]) {
    newState.item.rows[rowIndex].flowLayout = isUseFlowLayout
  }
  return newState
}

const moveWidget = (state, { from, to }) => {
  if (from.isPassageQuestion) {
    return produce(state, (newState) => {
      // change the order of widgets
      const widgets = newState.passage?.structure?.widgets || []
      const [movedWidget] = widgets.splice(from.widgetIndex, 1)
      movedWidget.tabIndex = to.tabIndex || 0
      widgets.splice(to.widgetIndex, 0, movedWidget)

      const { data } = newState?.passage || {}
      if (Array.isArray(data) && data.length > 0) {
        // change the order of passage.data
        newState.passage.data = reSequenceQuestionsWithWidgets(
          get(newState, `passage.structure.widgets`),
          data
        )
      }
    })
  } else {
    return produce(state, (newState) => {
      // change the order of widgets
      const [movedWidget] = newState.item.rows[from.rowIndex].widgets.splice(
        from.widgetIndex,
        1
      )
      movedWidget.tabIndex = to.tabIndex || 0
      newState.item.rows[to.rowIndex].widgets.splice(
        to.widgetIndex,
        0,
        movedWidget
      )
      newState.qids = newState.item.rows
        .flatMap((x) => x.widgets)
        .filter((widget) => widget.widgetType === 'question')
        .map((x) => x.reference)
      const { questions } = newState?.item?.data || {}
      if (Array.isArray(questions) && questions.length > 0) {
        // change the order of item.data.questions
        newState.item.data.questions = reSequenceQuestionsWithWidgets(
          get(newState, `item.rows[${to?.rowIndex}].widgets`),
          questions,
          newState.item.itemLevelScoring
        )
        if (
          newState.item.itemLevelScoring &&
          newState.item.data.questions.length > 1
        ) {
          newState.item.data.questions[0].validation.validResponse.score =
            newState.item.itemLevelScore
        }
        markQuestionLabel([newState.item]) // change the question label as per new order
      }
    })
  }
}

export function reducer(state = initialState, { type, payload }) {
  switch (type) {
    case RECEIVE_ITEM_DETAIL_REQUEST:
      return { ...state, loading: true }
    case RECEIVE_ITEM_DETAIL_SUCCESS:
    case UPDATE_ITEM_DETAIL_ITEM_DATA:
      return {
        ...state,
        item: payload,
        loading: false,
        error: null,
        originalItem: payload,
      }

    case SET_ITEM_QIDS:
      return { ...state, qids: payload }

    case RECEIVE_ITEM_DETAIL_ERROR:
      return { ...state, loading: false, error: payload.error }

    case SET_ITEM_DETAIL_DATA:
      return { ...state, item: payload.item }

    case SET_ITEM_DETAIL_ITEM_LEVEL_SCORING:
      return { ...state, item: { ...state.item, itemLevelScoring: !!payload } }

    case SET_ITEM_DETAIL_MULTIPART_EVALUATION_SETTING:
      return {
        ...state,
        item: { ...state.item, [payload.type]: payload.value },
      }

    case SET_ITEM_LEVEL_SCORING_FROM_RUBRIC:
      return { ...state, item: { ...state.item, itemLevelScoring: !!payload } }

    case SET_DELETING_ITEM:
      return { ...state, deleting: payload }

    case SET_ITEM_DETAIL_SCORE:
      if (!(payload > 0)) {
        return state
      }
      return { ...state, item: { ...state.item, itemLevelScore: payload } }

    case UPDATE_QUESTION:
      /**
       * since we are enabling scoring block on single
       * questions even with itemLevelScoring
       *  we need to update the itemLevel score on scoring block change.
       * But only need to do under certain conditions
       */
      const itemLevelScoring = get(state, 'item.itemLevelScoring')
      const updatingScore = get(payload, 'validation.validResponse.score')
      const newQuestionTobeAdded = !get(state, 'item.data.questions', []).find(
        (x) => x.id === payload.id
      )
      const isPassageWidget = payload.type === 'passage'
      let canUpdateItemLevelScore = false
      const questionsLength = get(state, 'item.data.questions.length', 0)
      if (questionsLength === 0) {
        canUpdateItemLevelScore = true
      } else if (questionsLength === 1 && !newQuestionTobeAdded) {
        canUpdateItemLevelScore = true
      }
      if (isPassageWidget) {
        canUpdateItemLevelScore = false
      }

      if (itemLevelScoring && canUpdateItemLevelScore) {
        return {
          ...state,
          item: { ...state.item, itemLevelScore: updatingScore },
        }
      }
      return state

    case ADD_QUESTION:
      if (!payload.validation) return state // do not set itemLevelScore for resources
      return {
        ...state,
        item: {
          ...state.item,
          itemLevelScore: ((state.item && state.item.itemLevelScore) || 0) + 1,
        },
      }

    case DELETE_ITEM_DETAIL_WIDGET_APPLY:
      return deleteWidget(state, payload)

    case DELETE_WIDGET_FROM_PASSAGE:
      return produce(state, (draft) => {
        draft.passage.structure.widgets.splice(payload, 1)
        draft.passage.data.splice(payload, 1)
      })

    case UPDATE_TAB_TITLE:
      return updateTabTitle(state, payload)

    case MOVE_WIDGET_APPLY:
      return moveWidget(state, payload)

    case USE_TABS:
      return useTabs(state, payload)
    case ADD_TAB:
      return addTabs(state, payload)
    case REMOVE_TAB:
      return removeTab(state, payload)
    case CHANGE_TAB_TITLE:
      return changeTabTitle(state, payload)
    case USE_FLOW_LAYOUT:
      return useFlowLayout(state, payload)

    case SET_DRAGGING:
      return { ...state, dragging: payload.dragging }

    case UPDATE_ITEM_DETAIL_DIMENSION:
      return updateDimension(state, payload)
    case SAVE_CURRENT_ITEM_MOVE_TO_NEXT:
    case UPDATE_ITEM_DETAIL_REQUEST:
    case UPDATE_ITEM_DOC_BASED_REQUEST:
      return { ...state, updating: true }
    case UPDATE_ITEM_DETAIL_SUCCESS:
      return { ...state, item: payload.item, updating: false }
    case UPDATE_ITEM_DETAIL_ERROR:
      return { ...state, updating: false, updateError: payload.error }
    case ITEM_SET_REDIRECT_TEST:
      return { ...state, redirectTestId: payload }
    case ITEM_CLEAR_REDIRECT_TEST:
      return { ...state, redirectTestId: undefined }
    case UPDATE_TESTITEM_STATUS:
      return {
        ...state,
        item: {
          ...state.item,
          status: payload,
        },
      }
    case UPDATE_COMPLETED:
      return {
        ...state,
        updating: false,
      }
    case SAVE_CURRENT_EDITING_TEST_ID:
      return {
        ...state,
        currentEditingTestId: payload,
      }
    case CLEAR_ITEM_DETAIL:
      return initialState
    case SHOW_PUBLISH_WARNING_MODAL:
      return {
        ...state,
        showWarningModal: payload,
      }
    case CONVERT_TO_MULTIPART:
      return {
        ...state,
        item: {
          ...state.item,
          multipartItem: true,
        },
      }
    case UPDATE_ITEM_TO_PASSAGE_TYPE:
      return {
        ...state,
        item: {
          ...state.item,
          multipartItem: true,
          isPassageWithQuestions: true,
          canAddMultipleItems: !!payload.canAddMultipleItems,
          itemLevelScoring: state?.item?.itemLevelScoring || false,
        },
      }
    case ADD_PASSAGE: {
      return produce(state, (draft) => {
        draft.item.passageId = payload._id
        draft.passage = payload
        draft.item.rows[0].dimension = '50%'
        return draft
      })
    }
    case UPDATE_PASSAGE_STRUCTURE: {
      return {
        ...state,
        passage: payload,
      }
    }
    case SET_COLLECTIONS: {
      return {
        ...state,
        item: {
          ...state.item,
          collections: payload,
        },
        highlightCollection: false,
      }
    }
    case SET_HIGHLIGHT_COLLECTION: {
      return {
        ...state,
        highlightCollection: payload,
      }
    }
    case RECEIVE_QUESTION_PREVIEW_ATTACHMENT_REQUEST: {
      return {
        ...state,
        loadingAuditLogs: true,
      }
    }
    case RECEIVE_QUESTION_PREVIEW_ATTACHMENT_SUCCESS: {
      return {
        ...state,
        previewData: payload,
        loadingAuditLogs: false,
      }
    }
    case RECEIVE_QUESTION_PREVIEW_ATTACHMENT_FAILURE: {
      return {
        ...state,
        loadingAuditLogs: false,
      }
    }
    case SET_PASSAGE_UPDATE_IN_PROGRESS: {
      return {
        ...state,
        passageUpdateInProgress: payload,
      }
    }
    case SET_TEST_ITEMS_SAVING: {
      return {
        ...state,
        testItemSavingInProgress: payload,
      }
    }
    default:
      return state
  }
}

// saga

export function* setItemLanguage(data) {
  // default langauage is english
  let language = ENGLISH
  const allowedToSelectMultiLanguage = yield select(
    allowedToSelectMultiLanguageInTest
  )
  const languageCode = yield select(getCurrentLanguage)
  if (allowedToSelectMultiLanguage) {
    // Setting language to spanish if english stimulus is empty
    if (
      !data?.data?.questions?.[0]?.stimulus?.length &&
      data?.data?.questions?.[0]?.languageFeatures
    ) {
      const languageCode = Object.keys(
        data?.data?.questions?.[0]?.languageFeatures
      ).shift()
      language = LANGUAGES_OPTIONS.find(
        (lang) => lang.value === languageCode
      )?.label?.toLowerCase()
    }
    // for passage setting language to spanish if english stimulus is empty
    if (
      data.testItems &&
      !data?.data?.[0]?.contentTitle?.length &&
      data?.data?.[0]?.languageFeatures
    ) {
      const languageCode = Object.keys(
        data?.data?.[0]?.languageFeatures
      ).shift()
      language = LANGUAGES_OPTIONS.find(
        (lang) => lang.value === languageCode
      )?.label?.toLowerCase()
    }
  }
  return language
}

function* receiveItemSaga({ payload }) {
  try {
    const data = yield call(testItemsApi.getById, payload.id, payload.params)
    let questions = (data.data && data.data.questions) || []
    const questionsArr = (data.data && data.data.questions) || []
    let resources = (data.data && data.data.resources) || []

    //
    if (data.passageData) {
      const passageWidgets = data.passageData.data
      resources = [...resources, ...passageWidgets]
      yield put(updatePassageStructureAction(data.passageData))
    } else {
      yield put(updatePassageStructureAction(undefined))
    }

    questions = [...questions, ...resources]

    // if there is only one question, set it as currentQuestionId, since
    // questionView will be loaded instead.
    if (questions.length === 1 && !data.isPassageWithQuestions) {
      yield put(changeCurrentQuestionAction(questions[0].id))
    }

    questions = _keyBy(questions, 'id')
    if (get(payload, 'params.addItem', false)) {
      yield put(addItemsQuestionAction(questions))
    } else {
      yield put(loadQuestionsAction(questions))
    }

    const qids = questionsArr.map((x) => x.id)

    yield put({
      type: RECEIVE_ITEM_DETAIL_SUCCESS,
      payload: _omit(data, ['passageData']),
    })

    yield put({
      type: SET_ITEM_QIDS,
      payload: qids,
    })

    const { itemLevelScore } = data
    yield put(setItemLevelScoreAction(itemLevelScore))

    yield put({
      type: CLEAR_DICT_ALIGNMENTS,
    })

    let alignments = yield select(getAlignmentFromQuestionSelector)
    if (!alignments.length) {
      alignments = [getNewAlignmentState()]
    }
    yield put(setDictAlignmentFromQuestion(alignments))
  } catch (err) {
    captureSentryException(err)
    let msg = 'Unable to retrieve the item.'
    if (err.status === 404) {
      msg = 'Item not found'
      yield put(push('/author/items'))
    }
    console.log('err is', err)

    notification({ type: 'error', msg: msg })
    yield put({
      type: RECEIVE_ITEM_DETAIL_ERROR,
      payload: { error: msg },
    })
  }
}

export function* deleteItemSaga({ payload }) {
  try {
    yield put(setItemDeletingAction(true))
    const {
      id,
      redirectId,
      isTestFlow,
      testId,
      isItemPrevew = false,
      isPassageWithQuestions = false,
    } = payload
    const hasValidTestId = testId && testId !== 'undefined'
    yield call(testItemsApi.deleteById, id, {
      ...(hasValidTestId && { testId }),
    })
    if (isItemPrevew && isPassageWithQuestions) {
      let passageItems = yield select(getPassageItemsSelector)
      passageItems = (passageItems || []).filter((item) => !(item?._id === id))
      yield put(setPassageItemsAction(passageItems))
    }
    yield put(setItemDeletingAction(false))
    yield put(deleteItemSuccesAction(id))
    notification({ type: 'success', messageKey: 'itemDeletedSuccessfully' })
    if (isItemPrevew) return

    // Note: testId could be "undefined" (string value)
    if (testId && isTestFlow) {
      if (redirectId) {
        yield put(push(`/author/tests/${testId}/editItem/${redirectId}`))
      } else {
        // when test no test item to redirect, back ot description
        yield put(push(`/author/tests/create/description`))
      }
      return
    }
    if (redirectId) {
      yield put(push(`/author/items/${redirectId}/item-detail`))
    } else {
      yield put(push(`/author/items`))
    }
  } catch (e) {
    Sentry.captureException(e)
    yield put(setItemDeletingAction(false))
    console.error(e)
    if (e.status === 403) {
      return notification({ msg: e?.response?.data?.message })
    }
    notification({ messageKey: 'deletingItemFailed' })
  }
}

export function* updateItemSaga({ payload }) {
  try {
    yield put(setTestItemsSavingAction(true))

    const { addToTest, updateScoreInQuestionsAsPerItem } = payload
    const oldTestId = payload?.locationState?.previousTestId
    if (!payload.keepData) {
      // avoid data part being put into db
      delete payload.data.data
    }
    const data = _omit(payload.data, ['authors', '__v'])

    /**
     * Commented the below code as it was adding testId to item data which
     * caused failing of test item update api because testId is not allowed
     * in test item data
     */

    const {
      itemLevelScoring,
      itemLevelScore,
      isPassageWithQuestions,
      multipartItem = false,
      _id: _itemId,
    } = data

    const resourceTypes = [
      questionType.VIDEO,
      questionType.PASSAGE,
      questionType.TEXT,
      questionType.PROTRACTOR,
    ]
    const rows = yield select((state) => get(state, 'itemDetail.item.rows'), [])

    const testItemWidgetIds = rows.reduce((allIds, row = {}) => {
      const widgetIds = (row.widgets || []).map((i) => i.reference)
      return [...allIds, ...widgetIds]
    }, [])

    const widgets = Object.values(
      yield select((state) => get(state, 'authorQuestions.byId', {}))
    ).filter((item) => testItemWidgetIds.includes(item.id))
    let questions = widgets.filter((item) => !resourceTypes.includes(item.type))

    const isGradingCheckBox = yield select(getIsGradingCheckboxState)
    if (isGradingCheckBox) {
      const currentQuestionId = yield select((state) =>
        get(state, 'authorQuestions.current')
      )
      const currentQuestion = questions.find((q) => q.id === currentQuestionId)
      if (!currentQuestion.rubrics)
        return notification({ messageKey: 'pleaseAssociateARubric' })
    }

    const resources = widgets.filter((item) =>
      resourceTypes.includes(item.type)
    )

    if (isPassageWithQuestions && !questions.length) {
      notification({ messageKey: 'CannotSaveWithoutQuestions' })
      yield put(itemUpdateCompletedAction())
      return null
    }

    const _widgets = rows
      .flatMap(({ widgets }) => widgets)
      .filter((widget) => widget.widgetType === 'question')

    questions = reSequenceQuestionsWithWidgets(
      _widgets,
      questions,
      itemLevelScoring
    )

    questions = produce(questions, (draft) => {
      draft.map((q, index) => {
        const [
          hasImproperConfig,
          warningMsg,
          shouldUncheck,
        ] = hasImproperDynamicParamsConfig(q)
        if (hasImproperConfig) {
          notification({ type: 'warn', msg: warningMsg })
        }
        if (shouldUncheck) {
          q.variable.enabled = false
          delete q.variable.examples
        }
        if (index === 0) {
          if (data.itemLevelScoring && q.scoringDisabled) {
            //on item level scoring item, first question removed situation.
            if (!questionType.manuallyGradableQn.includes(data.type)) {
              set(q, 'validation.validResponse.score', data.itemLevelScore)
            }
          }
          /**
           * after shuffle we need to reset scoringDisabled to false for the first question
           * irrespective to itemLevelScoring
           */
          q.scoringDisabled = false
          return q
        }

        q.scoringDisabled = !!itemLevelScoring
        return q
      })
    })

    data.data = {
      questions,
      resources,
    }
    if (questions.length === 1) {
      const [isIncomplete, errMsg] = isIncompleteQuestion(questions[0])
      if (isIncomplete) {
        return notification({ msg: errMsg })
      }
    } else if (questions.length > 1) {
      const isV1Mutlipart = isV1MultipartItem(rows)
      for (const [qIndex, question] of questions.entries()) {
        const [hasInvalidScore, errMsg] = validateScore(
          question,
          itemLevelScoring,
          multipartItem || isV1Mutlipart,
          _itemId,
          qIndex
        )
        if (hasInvalidScore) {
          return notification({ msg: errMsg })
        }
      }
    }

    const itemHasQuestions = questions?.length > 0
    const isPracticeQuestion = (question) =>
      question?.validation?.unscored === true
    const allQuestionsArePractice =
      itemHasQuestions && questions.every(isPracticeQuestion)

    if (allQuestionsArePractice) {
      data.itemLevelScore = 0
    }
    const originalQuestions = yield select((state) =>
      get(state, ['itemDetail', 'originalItem', 'data', 'questions'])
    )
    const regradeFlow = yield select(isRegradeFlowSelector)
    if (regradeFlow && isOptionsRemoved(originalQuestions, questions)) {
      return notification({
        type: 'warn',
        messageKey: 'optionRemove',
      })
    }

    if (addToTest) {
      const testItem = yield select((state) =>
        get(state, ['itemDetail', 'item'])
      )
      const isMultipartOrPassageType =
        testItem && (testItem.multipartItem || testItem.isPassageWithQuestions)
      const standardPresent = questions.some(hasStandards)

      // if alignment data is not present, set the flag to open the modal, and wait for
      // an action from the modal.!
      if (!(isMultipartOrPassageType || standardPresent)) {
        yield put(togglePublishWarningModalAction(true))
        // action dispatched by the modal.
        const { payload: publishItem } = yield take(PROCEED_PUBLISH_ACTION)
        yield put(togglePublishWarningModalAction(false))

        // if he wishes to add some just close the modal, and go to metadata.
        // else continue the normal flow.
        if (!publishItem) {
          yield put(changeViewAction('metadata'))
          return
        }
      }
    }
    const { __v, ...passageData } = (yield select(getPassageSelector)) || {}

    /*
     * in test flow, until test is not created, testId comes as "undefined" in string
     * do no pass it to API as testId argument
     * @see https://snapwiz.atlassian.net/browse/EV-18458
     */
    const hasValidTestId = payload.testId && payload.testId !== 'undefined'
    const testIdParam = hasValidTestId ? payload.testId : null
    // Setting item level langauge
    data.language = yield setItemLanguage(data)
    if (!isEmpty(passageData) && testIdParam) {
      passageData.testId = testIdParam
      // Setting item level langauge for passage
      passageData.language = yield setItemLanguage(passageData)
    }

    const [{ testId, ...item }, updatedPassage] = yield all([
      data._id === 'new'
        ? yield call(testItemsApi.create, _omit(data, '_id'))
        : call(testItemsApi.updateById, payload.id, data, testIdParam),
      !isEmpty(passageData) ? call(passageApi.update, passageData) : null,
    ])

    /**
     * need to update the version and data of passage returned from API into the redux store
     * for subsequent updates,
     * to keep the version sync with the latest in the database
     * @see https://snapwiz.atlassian.net/browse/EV-10507
     */
    // EV-28143 | not to show deleted items, thus store active items in store

    if (updatedPassage) {
      let modifiedPassageData
      if (passageData?.activeTestItems?.length > 0) {
        modifiedPassageData = {
          ...updatedPassage,
          activeTestItems: passageData.activeTestItems,
        }
      } else {
        modifiedPassageData = { ...updatedPassage }
      }
      yield put(updatePassageStructureAction(modifiedPassageData))
    }

    yield put({
      type: UPDATE_ITEM_DETAIL_SUCCESS,
      payload: { item },
    })

    // on update, if there is only question.. set it as the questionId, since we are changing the view
    // to singleQuestionView!
    if (questions.length === 1 && !isPassageWithQuestions) {
      yield put(changeCurrentQuestionAction(questions[0].id))
    }

    const currentQuestion = yield select(getCurrentQuestionSelector)
    const currentQuestionScore = get(currentQuestion, [
      'validation',
      'validResponse',
      'score',
    ])

    if (
      updateScoreInQuestionsAsPerItem &&
      itemLevelScoring &&
      itemLevelScore &&
      currentQuestionScore === 0
    ) {
      // update the score in the question after some question is deleleted in multipart
      const updatedQuestion = produce(currentQuestion, (draft) => {
        set(draft, ['validation', 'validResponse', 'score'], itemLevelScore)
      })

      yield put({
        type: UPDATE_QUESTION,
        payload: updatedQuestion,
      })
    }

    const { redirect = true } = payload // added for doc based assesment, where redirection is not required.
    if (redirect && item._id !== payload.id) {
      const {
        isTestFlow,
        previousTestId,
        regradeFlow,
      } = yield select((state) => get(state, 'router.location.state', {}))
      yield put(
        replace(
          payload.testId
            ? `/author/tests/${payload.testId}/editItem/${item._id}`
            : `/author/items/${item._id}/item-detail`,
          { isTestFlow, previousTestId, regradeFlow }
        )
      )
    }
    if (testId) {
      yield put(setRedirectTestAction(testId))
    }
    const alignments = yield select(getDictionariesAlignmentsSelector)
    const { standards = [] } = alignments[0]
    // to update recent standards used in local storage and store
    let recentStandardsList = yield select(getRecentStandardsListSelector)
    recentStandardsList = uniqBy(
      [...standards, ...recentStandardsList],
      (i) => i._id
    ).slice(0, 10)
    yield put(
      updateRecentStandardsAction({ recentStandards: recentStandardsList })
    )
    storeInLocalStorage('recentStandards', JSON.stringify(recentStandardsList))

    const { collections } = item
    if (collections) {
      const { itemBanks } = yield select(getOrgDataSelector)
      let recentCollectionsList = yield select(getRecentCollectionsListSelector)
      recentCollectionsList = yield generateRecentlyUsedCollectionsList(
        collections,
        itemBanks,
        recentCollectionsList
      )
      yield put(
        updateRecentCollectionsAction({
          recentCollections: recentCollectionsList,
        })
      )
    }

    const isCurator = yield select(getIsCurator)
    const userRole = yield select(getUserRole)
    if (userRole === roleuser.EDULASTIC_CURATOR || isCurator)
      notification({ type: 'success', messageKey: 'itemIsSaved' })
    else notification({ type: 'success', messageKey: 'itemSavedSuccess' })
    yield put(changeUpdatedFlagAction(false))
    if (addToTest) {
      // add item to test entity
      const testItems = yield select(getSelectedItemSelector)
      const isPublisherUser = yield select(isPublisherUserSelector)
      const { itemGroups } = yield select(getTestEntitySelector)

      if (
        isPublisherUser &&
        (itemGroups.length > 1 || itemGroups[0].type === 'AUTOSELECT')
      ) {
        const tId = payload.testId
        const pathname =
          tId && tId !== 'undefined'
            ? `/author/tests/tab/addItems/id/${tId}`
            : '/author/tests/create/addItems'
        yield put(
          push({
            pathname,
            state: {
              persistStore: true,
              isAuthoredNow: true,
            },
          })
        )
        return notification({
          type: 'success',
          messageKey: 'pleaseAddItemManuallyToGroup',
        })
      }
      const nextTestItems = [...testItems, item._id]

      yield put(setTestItemsAction(nextTestItems))

      if (!payload.testId || payload.testId === 'undefined') {
        let passageItems = []
        if (passageData?._id && passageData?.testItems?.length > 1) {
          passageItems = yield call(
            testItemsApi.getPassageItems,
            passageData._id
          )
        }
        yield put(
          setTestDataAndUpdateAction({ addToTest: true, item, passageItems })
        )
      } else {
        // When deleting question from passage item should not go to test preview
        const { redirectOnDeleteQuestion } = payload
        yield put(setCreatedItemToTestAction(item))
        if (redirectOnDeleteQuestion) {
          yield put(
            push({
              pathname: `/author/tests/tab/review/id/${payload.testId}${
                oldTestId ? `/old/${oldTestId}` : ''
              }`,
              state: {
                isAuthoredNow: true,
              },
            })
          )
          if (oldTestId && oldTestId === payload.testId) {
            Sentry.withScope((scope) => {
              scope.setTag('issueType', 'testIdMisMatchError')
              scope.setExtra(
                'message',
                `old test Id = ${oldTestId}, new test Id = ${payload.testId}, testItemId = ${item._id}`
              )
              Sentry.captureException(
                new Error('[test edit] item edit failure on test update')
              )
            })
          }
        }
      }
      yield put(changeViewAction('edit'))
      return
    } else {
      yield put(addItemToCartAction(item))
    }
  } catch (err) {
    captureSentryException(err)
    console.error(err)
    const errorMessage = err.message || 'Unable to save the item.'
    notification({ type: 'error', msg: errorMessage })
    yield put({
      type: UPDATE_ITEM_DETAIL_ERROR,
      payload: { error: errorMessage },
    })
  } finally {
    yield put(itemUpdateCompletedAction())
    yield put(setTestItemsSavingAction(false))
  }
}

export function* updateItemDocBasedSaga({ payload }) {
  try {
    if (!payload.keepData) {
      // avoid data part being put into db
      delete payload.data.data
    }
    const data = _omit(payload.data, ['authors', '__v'])

    const questions = get(payload.data, ['data', 'questions'], [])
    const { testId, ...item } = yield call(
      testItemsApi.updateById,
      payload.id,
      data,
      payload.testId
    )
    // on update, if there is only question.. set it as the questionId, since we are changing the view
    // to singleQuestionView!
    if (questions.length === 1) {
      yield put(changeCurrentQuestionAction(questions[0].id))
    }

    let test = yield select(getTestEntitySelector)
    test = {
      ...test,
      itemGroups: [{ ...test?.itemGroups?.[0], items: [item] }],
    }
    yield put(setTestDataAction(test))
    const alignments = yield select(getDictionariesAlignmentsSelector)
    const { standards = [] } = alignments[0]
    // to update recent standards used in local storage and store
    let recentStandardsList = yield select(getRecentStandardsListSelector)
    recentStandardsList = uniqBy(
      [...standards, ...recentStandardsList],
      (i) => i._id
    ).slice(0, 10)
    yield put(
      updateRecentStandardsAction({ recentStandards: recentStandardsList })
    )
    storeInLocalStorage('recentStandards', JSON.stringify(recentStandardsList))

    const { collections } = item
    if (collections) {
      const { itemBanks } = yield select(getOrgDataSelector)
      let recentCollectionsList = yield select(getRecentCollectionsListSelector)
      recentCollectionsList = yield generateRecentlyUsedCollectionsList(
        collections,
        itemBanks,
        recentCollectionsList
      )
      yield put(
        updateRecentCollectionsAction({
          recentCollections: recentCollectionsList,
        })
      )
    }
    //to avoid displaying confusing notification when no question present
    if (data?.data?.questions?.length || data?.data?.resources.length) {
      notification({ type: 'success', messageKey: 'itemSavedSuccess' })
    }
    return { testId, ...item }
  } catch (err) {
    captureSentryException(err)
    const errorMessage = 'Unable to save the item.'
    notification({ type: 'error', msg: errorMessage })
    yield put({
      type: UPDATE_ITEM_DETAIL_ERROR,
      payload: { error: errorMessage },
    })
  }
}

export const hasStandards = (question) => {
  const alignments = get(question, 'alignment', [])
  if (!alignments.length) return false
  const hasDomain = alignments.some(
    (i) => i.domains && i.domains.length && !i.isEquivalentStandard
  )
  return !!hasDomain
}

/**
 * save the test item, but not strictly update the store, because it will have
 *  the same data. This is mainly used during publish item, or whlie converting
 *  to a multipart question type.
 */
function* saveTestItemSaga() {
  const resourceTypes = [
    questionType.VIDEO,
    questionType.PASSAGE,
    questionType.TEXT,
    questionType.PROTRACTOR,
  ]
  const data = yield select(getItemDetailSelector)
  const testItemWidgets = data.rows
    .flatMap((i) => i.widgets)
    .map((i) => i.reference)

  const widgets = Object.values(
    yield select((state) => get(state, 'authorQuestions.byId', {}))
  ).filter((i) => testItemWidgets.includes(i.id))
  let questions = widgets.filter((item) => !resourceTypes.includes(item.type))
  const resources = widgets.filter((item) => resourceTypes.includes(item.type))
  questions = produce(questions, () => {
    for (const [ind, q] of questions.entries()) {
      if (ind === 0) {
        if (data.itemLevelScoring && q.scoringDisabled) {
          //on item level scoring item, first question removed situation.
          if (!questionType.manuallyGradableQn.includes(data.type)) {
            set(q, 'validation.validResponse.score', data.itemLevelScore)
          }
        }
        /**
         * after shuffle we need to reset scoringDisabled to false for the first question
         * irrespective to itemLevelScoring
         */
        q.scoringDisabled = false
        continue
      }
      if (data.itemLevelScoring) {
        q.scoringDisabled = true
      } else {
        q.scoringDisabled = false
      }
    }
  })

  data.data = {
    questions,
    resources,
  }
  // Setting item level langauge
  data.language = yield setItemLanguage(data)

  const redirectTestId = yield select(getRedirectTestSelector)

  const newTestItem =
    data._id === 'new'
      ? yield call(testItemsApi.create, _omit(data, '_id'))
      : yield call(testItemsApi.updateById, data._id, data, redirectTestId)
  yield put({
    type: UPDATE_ITEM_DETAIL_SUCCESS,
    payload: { item: newTestItem },
  })
  return newTestItem
}

function* publishTestItemSaga({ payload }) {
  try {
    const questions = Object.values(
      yield select((state) => get(state, ['authorQuestions', 'byId'], {}))
    )
    const testItem = yield select((state) => get(state, ['itemDetail', 'item']))
    const itemQuestions = get(testItem, 'data.questions', [])
    const rows = get(testItem, 'rows', [])

    // if there is only question, then its individual question editing screen.
    // in that case test if question is incomplete
    if (questions.length === 1) {
      const [isIncomplete, errMsg] = isIncompleteQuestion(questions[0])
      if (isIncomplete) {
        return notification({ msg: errMsg })
      }
    }

    const questionsById = _keyBy(questions, 'id')
    // validate score for all questions in multipart item
    const isV1Multipart = isV1MultipartItem(rows)
    if (itemQuestions.length > 1) {
      for (const [qIndex, question] of itemQuestions.entries()) {
        // need to use question from authorQuestions state as validation data in itemDetail.data.questions is not updated
        const _question = get(questionsById, `${question?.id}`, {})
        if (
          !isEmpty(_question) &&
          !Object.values(resourceTypeQuestions).includes(_question?.type)
        ) {
          const [hasInvalidScore, errMsg] = validateScore(
            _question,
            testItem?.itemLevelScoring,
            testItem?.multipartItem || isV1Multipart,
            testItem?._id,
            qIndex
          )
          if (hasInvalidScore) {
            return notification({ msg: errMsg })
          }
        }
      }
    }

    const isGradingCheckBox = yield select(getIsGradingCheckboxState)
    if (isGradingCheckBox) {
      const currentQuestionId = yield select((state) =>
        get(state, 'authorQuestions.current')
      )
      const currentQuestion = questions.find((q) => q.id === currentQuestionId)
      if (!currentQuestion.rubrics)
        return notification({ messageKey: 'pleaseAssociateARubric' })
    }

    const isMultipartOrPassageType =
      testItem && (testItem.multipartItem || testItem.isPassageWithQuestions)
    const standardPresent = questions.some(hasStandards)
    const { saveAndPublishFlow = false } = payload

    if (testItem.isPassageWithQuestions) {
      const { __v, structure } = (yield select(getPassageSelector)) || {}
      const { widgets = [] } = structure
      if (!widgets.length) {
        return notification({ messageKey: 'CannotPublishWithoutPassages' })
      }
    }

    // if alignment data is not present, set the flag to open the modal, and wait for
    // an action from the modal.
    if (!isMultipartOrPassageType && !standardPresent && !saveAndPublishFlow) {
      yield put(togglePublishWarningModalAction(true))
      // action dispatched by the modal.
      const { payload: publishItem } = yield take(PROCEED_PUBLISH_ACTION)
      yield put(togglePublishWarningModalAction(false))

      // if they wishes to add some just close the modal and switch to metadata tab!
      // else continue the normal flow.
      if (!publishItem) {
        yield put(changeViewAction('metadata'))
        return
      }
    }

    if (!saveAndPublishFlow) {
      yield saveTestItemSaga()
    }
    const isOrganizationDistrictUser = yield select(
      isOrganizationDistrictUserSelector
    )
    if (
      (payload.status === 'published' && !isOrganizationDistrictUser) ||
      ((payload.isPublisherAuthor ||
        payload.isCurator ||
        isOrganizationDistrictUser) &&
        testItem?.collections?.length)
    ) {
      yield call(testItemsApi.publishTestItem, payload)

      let successMessage
      let testItemStatus
      if (payload.status === 'published') {
        successMessage =
          'Item published successfully. Item not visible? Clear the applied filters.'
        testItemStatus = testItemStatusConstants.PUBLISHED
      } else {
        successMessage = 'Review request is submitted successfully.'
        testItemStatus = testItemStatusConstants.INREVIEW
      }
      yield put(updateTestItemStatusAction(testItemStatus))
      const redirectTestId = yield select(getRedirectTestSelector)
      yield put(changeUpdatedFlagAction(false))
      if (
        payload.locationState?.testAuthoring === false &&
        payload.locationState?.testId
      ) {
        if (
          payload.locationState?.isPlaylistTestReview &&
          payload.locationState?.playlistId
        ) {
          yield put(
            push({
              pathname: `/author/playlists/playlist/${payload.locationState.playlistId}/use-this`,
              state: { isAuthoredNow: true },
            })
          )
        } else {
          yield put(
            push({
              pathname: `/author/tests/tab/review/id/${payload.locationState.testId}`,
              state: { isAuthoredNow: true },
            })
          )
        }
        return notification({
          type: 'success',
          msg: 'Item is saved in item bank',
        })
      }
      if (redirectTestId) {
        yield delay(1500)
        yield put(
          push({
            pathname: `/author/tests/tests/tab/addItems/id/${redirectTestId}`,
            state: { isAuthoredNow: true },
          })
        )
        yield put(clearRedirectTestAction())
      } else {
        // on publishing redirect to items bank.
        const item = yield select((state) => get(state, ['itemDetail', 'item']))
        yield put(addItemToCartAction(item))
        yield put(
          push({ pathname: '/author/items', state: { isAuthoredNow: true } })
        )
      }

      notification({ type: 'success', msg: successMessage })
    } else {
      yield put(changeViewAction('metadata'))
      yield put(setHighlightCollectionAction(true))
      notification({ messageKey: 'itemIsNotAssociated' })
    }
  } catch (e) {
    Sentry.captureException(e)
    console.warn('publish error', e)
    const { message: errorMessage = 'Failed to publish item' } =
      e?.response?.data || {}
    notification({ msg: errorMessage })
  }
}

function* deleteWidgetSaga({ payload: { rowIndex, widgetIndex, updateData } }) {
  const newState = yield select((state) => state.itemDetail)
  const targetId = newState.item.rows[rowIndex].widgets[widgetIndex].reference

  yield put({
    type: DELETE_ITEM_DETAIL_WIDGET_APPLY,
    payload: { rowIndex, widgetIndex },
  })

  yield put(deleteQuestionAction(targetId))

  const testItem = yield select((state) => getItemDetailSelector(state)) // Get latest data of item after deletion of widget
  const { testItemId, testId, isTestFlow, locationState } = updateData
  const firstQuestionScore = get(testItem, [
    'data',
    'questions',
    0,
    'validation',
    'validResponse',
    'score',
  ])

  if (testItem.itemLevelScoring && firstQuestionScore === 0) {
    set(
      testItem,
      ['data', 'questions', 0, 'validation', 'validResponse', 'score'],
      testItem.itemLevelScore
    )
  }

  yield put(
    updateItemDetailByIdAction(
      testItemId,
      testItem,
      testId,
      isTestFlow,
      locationState,
      true,
      false,
      true
    )
  )
}

function* moveWidgetSaga({ payload }) {
  yield put({
    type: MOVE_WIDGET_APPLY,
    payload,
  })
  const { from: { isPassageQuestion } = {} } = payload || {}
  // validation needs to be updated for author questions after resequence in case of itemLevelScoring true. Thus load questions on resequence
  const itemLevelScoring = yield select(getItemLevelScoringSelector)
  if (itemLevelScoring && !isPassageQuestion) {
    let authoredQuestions = yield select(getQuestionsSelector)
    let questions = yield select(getItemDetailQuestionsSelector)
    questions = _keyBy(questions, 'id')
    if (!isEmpty(authoredQuestions)) {
      authoredQuestions = produce(authoredQuestions, (draft) => {
        for (const qid in draft) {
          if (draft.hasOwnProperty(qid)) {
            const authoredQuestion = draft[qid]
            if (
              authoredQuestion &&
              authoredQuestion.validation &&
              !Object.values(resourceTypeQuestions).includes(
                authoredQuestion.type
              )
            ) {
              const question = questions[qid]
              if (question && question.validation) {
                const newValidation = get(question, 'validation')
                const scoringDisabled = get(question, 'scoringDisabled')
                set(authoredQuestion, 'validation', newValidation)
                set(authoredQuestion, 'scoringDisabled', scoringDisabled)
              }
            }
          }
        }
      })
    }
    yield put(loadQuestionsAction(authoredQuestions))
  }
}

function* convertToMultipartSaga({ payload }) {
  try {
    const { isTestFlow = false, testId } = payload

    const item = yield select(getItemDetailSelector)
    const nextPageUrl = isTestFlow
      ? `/author/tests/${testId}/createItem/${item._id}`
      : `/author/items/${item._id}/item-detail`
    yield put(setQuestionCategory('multiple-choice'))
    yield put(push(nextPageUrl))
  } catch (e) {
    Sentry.captureException(e)
    console.log('error', e)
    notification({ msg: e })
  }
}

function* convertToPassageWithQuestions({ payload }) {
  try {
    const {
      isTestFlow = false,
      itemId,
      testId,
      canAddMultipleItems,
      title,
    } = payload

    // create a passage type with the following structure
    const passage = yield call(passageApi.create, {
      structure: {
        tabs: [],
        dimension: '50%',
        widgets: [],
        flowLayout: false,
        content: '',
      },
    })

    yield put(addPassageAction(passage))
    yield put(setTestPassageAction(passage))

    // yield put(
    //   addQuestionAction({
    //     id: uuid(),
    //     title,
    //     type: questionType.PASSAGE,
    //     heading: 'Section 3',
    //     math_renderer: '',
    //     content:
    //       'Enabling a <b>highlightable</b> text passage that can be used across multiple items.',
    //     hints: [{ value: uuid(), label: 'Hint A' }],
    //   })
    // )

    yield put({
      type: UPDATE_ITEM_TO_PASSAGE_TYPE,
      payload: {
        canAddMultipleItems: canAddMultipleItems,
      },
    })

    // const currentItem = yield select(getItemDetailSelector)
    // const hasValidTestId = testId !== 'undefined'
    // const testIdParam = hasValidTestId ? testId : null
    // const item = yield call(
    //   testItemsApi.create,
    //   _omit(currentItem, '_id'),
    //   ...(testIdParam ? [{ testId: testIdParam }] : [])
    // )
    // yield put({
    //   type: RECEIVE_ITEM_DETAIL_SUCCESS,
    //   payload: { item },
    // })

    const url = isTestFlow
      ? `/author/tests/${testId}/createItem/${itemId}`
      : `/author/items/${itemId}/item-detail`

    yield put(setQuestionCategory('multiple-choice'))
    yield put(push(url))
  } catch (e) {
    Sentry.captureException(e)
    console.log('error', e)
    notification({ msg: e })
  }
}

function* savePassage({ payload }) {
  try {
    yield put(setPassageUpdateInProgressAction(true))
    const { rowIndex, tabIndex, isEdit, callback, isTestFlow } = payload
    const passage = yield select(getPassageSelector)
    const entity = yield select(getCurrentQuestionSelector)
    // EV-31379 | additional check to avoid adding empty passage
    if (isEmpty(entity)) {
      return
    }
    const currentItem = yield select(getItemDetailSelector)

    const widget = {
      widgetType: 'resource',
      type: entity?.type,
      title: entity?.title,
      reference: entity?.id,
      tabIndex,
    }
    const allWidgets = yield select((state) =>
      get(state, 'authorQuestions.byId', {})
    )

    const widgetIds = get(passage, 'structure.widgets', []).map(
      (widget) => widget.reference
    )

    if (!isEdit) {
      widgetIds.push(widget.reference)
    }

    const passageData = Object.values(allWidgets).filter((i) =>
      widgetIds.includes(i.id)
    )
    let currentItemId = currentItem._id

    if (
      passageData.some((i) => {
        const [hasEmptyFields, msg] = isIncompleteQuestion(i)
        if (hasEmptyFields) {
          notification({ msg: msg })
          return true
        }
      })
    ) {
      return
    }

    /*
     * in test flow, until test is not created, testId comes as "undefined" in string
     * do no pass it to API as testId argument
     * @see https://snapwiz.atlassian.net/browse/EV-19517
     */
    const hasValidTestId = payload.testId && payload.testId !== 'undefined'
    const testIdParam = hasValidTestId ? payload.testId : null

    let item
    if (currentItem._id === 'new') {
      const hasSections = yield select(hasSectionsSelector)
      const sectionIndex = hasSections
        ? yield select(getCurrentGroupIndexSelector)
        : undefined
      // Setting item level langauge
      currentItem.language = yield setItemLanguage(currentItem)
      item = yield call(
        testItemsApi.create,
        _omit(currentItem, '_id'),
        // Passing the section index to push the passage
        // or multipart question to the specific item group
        ...(testIdParam ? [{ testId: testIdParam, sectionIndex }] : [])
      )
      yield put({
        type: RECEIVE_ITEM_DETAIL_SUCCESS,
        payload: { item },
      })
      currentItemId = item._id
    }

    const modifiedPassage = produce(passage, (draft) => {
      if (!isEdit) draft.structure.widgets.push(widget)
      draft.data = passageData
      draft.testItems = uniq([...draft.testItems, currentItemId]) // , currentItemId
    })
    // Setting item level langauge
    modifiedPassage.language = yield setItemLanguage(modifiedPassage)
    yield put(updatePassageStructureAction(modifiedPassage))
    if (isTestFlow && hasValidTestId) {
      modifiedPassage.testId = payload.testId
    }

    // only update the item if its not new, since new item already has the passageId added while creating.
    const updatedPassage = yield call(
      passageApi.update,
      _omit(modifiedPassage, ['__v'])
    )
    /**
     * @see https://snapwiz.atlassian.net/browse/EV-29547
     * update passage version in redux-store and keep passage data in sync with DB
     * use "modifiedPassage" as a fallback if update api fails
     */
    if (!isEmpty(updatedPassage)) {
      yield put(updatePassageStructureAction(updatedPassage))
    }

    /**
     * after saving the passage type question we can say there is no user input to be saved
     * after saving the question it redirects to item detail page
     */
    yield put(changeUpdatedFlagAction(false))

    if (typeof callback === 'function') {
      callback()
      yield put(changeCurrentQuestionAction(''))
    }

    let testId = payload.testId
    const currentRouterState = yield select(
      (state) => state.router.location.state
    )
    if (isTestFlow) {
      // testId = yield select((state) => state.tests?.entity?._id)

      if (!testId || testId === 'undefined') {
        let passageItems = []
        if (updatedPassage?._id && updatedPassage?.testItems?.length > 1) {
          passageItems = yield call(
            testItemsApi.getPassageItems,
            updatedPassage._id
          )
        }
        yield put(
          setTestDataAndUpdateAction({
            item,
            passageItems,
            addToTest: true,
            fromSaveMultipartItem: true,
            routerState: currentRouterState,
            url: `/author/tests/${testId}/editItem/${currentItemId}`,
          })
        )
      } else {
        if (item) yield put(setCreatedItemToTestAction(item))
        yield put(
          push({
            pathname: `/author/tests/${testId}/editItem/${currentItemId}`,
            state: currentRouterState,
          })
        )
      }
    } else {
      yield put(
        push({
          pathname: `/author/items/${currentItemId}/item-detail`,
          state: currentRouterState,
        })
      )
    }
  } catch (e) {
    Sentry.captureException(e)
    console.log('error: ', e)
    notification({ messageKey: 'errorSavingPassage' })
  } finally {
    yield put(setPassageUpdateInProgressAction(false))
  }
}

function* addWidgetToPassage({ payload }) {
  try {
    const {
      isTestFlow = false,
      itemId,
      testId,
      type,
      tabIndex = 0,
      canAddMultipleItems,
    } = payload

    const widget =
      type === 'video'
        ? {
            id: uuid(),
            title: 'VIDEO',
            type: questionType.VIDEO,
            sourceURL: '',
            heading: '',
            summary: '',
            transcript: '',
            uiStyle: {
              width: 480,
              height: 270,
              posterImage: '',
              hideControls: false,
              captionURL: '',
            },
            hints: [{ value: uuid(), label: 'Hint A' }],
          }
        : {
            id: uuid(),
            title: PassageDefaultTemplate.title,
            type: questionType.PASSAGE,
            heading: PassageDefaultTemplate.heading,
            math_renderer: '',
            content: PassageDefaultTemplate.content,
            hints: [{ value: uuid(), label: 'Hint A' }],
          }
    yield put(addQuestionAction(widget))
    // const backUrl = isTestFlow
    //   ? `/author/tests/${testId}/createItem/${itemId}`
    //   : `/author/items/${itemId}/item-detail`

    // yield put(
    //   push({
    //     pathname: `/author/questions/create/${questionType.PASSAGE}`,
    //     state: {
    //       isPassageWithQuestions: true,
    //       backUrl,
    //       testItemId: itemId,
    //       tabIndex,
    //       testId,
    //       canAddMultipleItems: !!canAddMultipleItems, // location state prop getting used by savePassage saga
    //     },
    //   })
    // )
  } catch (e) {
    Sentry.captureException(e)
    console.log('error:', e)
    notification({ messageKey: 'failedAddingContent' })
  }
}

function* loadQuestionPreviewAttachmentsSaga({ payload }) {
  try {
    const result = yield call(attchmentApi.loadAllAttachments, payload)
    yield put({
      type: RECEIVE_QUESTION_PREVIEW_ATTACHMENT_SUCCESS,
      payload: result,
    })
  } catch (e) {
    Sentry.captureException(e)
    const errorMessage = 'Loading audit trail logs failed'
    notification({ msg: errorMessage })
    yield put({
      type: RECEIVE_QUESTION_PREVIEW_ATTACHMENT_FAILURE,
    })
  }
}

function* saveAndPublishItemSaga() {
  try {
    yield put(
      addLoadingComponentAction({ componentName: 'saveAndPublishItem' })
    )
    yield put({
      type: SAVE_QUESTION_REQUEST,
      payload: { saveAndPublishFlow: true },
    })
    const { payload } = yield take([
      SAVE_QUESTION_ERROR,
      PROCEED_TO_PUBLISH_ITEM,
    ])
    if (payload.error) {
      throw new Error(error)
    }
    const userFeatures = yield select(getUserFeatures)
    const status = userFeatures.isPublisherAuthor ? 'inreview' : 'published'
    const publishData = {
      isCurator: userFeatures.isCurator,
      isPublisherAuthor: userFeatures.isPublisherAuthor,
      itemId: payload.itemId,
      status,
      saveAndPublishFlow: true,
    }
    yield put(publishTestItemAction(publishData))
  } catch (error) {
    Sentry.captureException(e)
  } finally {
    yield put(
      removeLoadingComponentAction({ componentName: 'saveAndPublishItem' })
    )
    return null
  }
}

function* editMultipartWidgetSaga({ payload }) {
  // payload is the question id
  yield put(changeCurrentQuestionAction(payload))
  let alignments = yield select(getAlignmentFromQuestionSelector)
  if (!alignments.length) {
    alignments = [getNewAlignmentState()]
  }
  yield put(setDictAlignmentFromQuestion(alignments))
}

function* saveCurrentItemAndRoueToOtherSaga({ payload }) {
  try {
    const { redirectData, updateItemData } = payload
    yield call(updateItemSaga, { payload: updateItemData })
    yield put(push(redirectData))
  } catch (err) {
    Sentry.captureException(err)
  }
}

export function* watcherSaga() {
  yield all([
    yield takeEvery(RECEIVE_ITEM_DETAIL_REQUEST, receiveItemSaga),
    yield takeEvery(UPDATE_ITEM_DETAIL_REQUEST, updateItemSaga),
    yield takeEvery(UPDATE_ITEM_DOC_BASED_REQUEST, updateItemDocBasedSaga),
    yield takeEvery(ITEM_DETAIL_PUBLISH, publishTestItemSaga),
    yield takeEvery(DELETE_ITEM_DETAIL_WIDGET, deleteWidgetSaga),
    yield takeLatest(SAVE_CURRENT_TEST_ITEM, saveTestItemSaga),
    yield takeLatest(CONVERT_TO_MULTIPART, convertToMultipartSaga),
    yield takeLatest(
      CONVERT_TO_PASSAGE_WITH_QUESTIONS,
      convertToPassageWithQuestions
    ),
    yield takeLatest(SAVE_PASSAGE, savePassage),
    yield takeLatest(ADD_WIDGET_TO_PASSAGE, addWidgetToPassage),
    yield takeEvery(DELETE_ITEM, deleteItemSaga),
    yield takeLatest(
      RECEIVE_QUESTION_PREVIEW_ATTACHMENT_REQUEST,
      loadQuestionPreviewAttachmentsSaga
    ),
    yield takeLatest(SAVE_AND_PUBLISH_ITEM, saveAndPublishItemSaga),
    yield takeLatest(EDIT_MULTIPART_WIDGET, editMultipartWidgetSaga),
    yield takeEvery(
      SAVE_CURRENT_ITEM_MOVE_TO_NEXT,
      saveCurrentItemAndRoueToOtherSaga
    ),
    yield takeEvery(MOVE_WIDGET, moveWidgetSaga),
  ])
}
