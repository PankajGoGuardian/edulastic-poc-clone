import { createSelector } from 'reselect'
import { testItemsApi, evaluateApi, questionsApi } from '@edulastic/api'
import {
  call,
  put,
  all,
  takeEvery,
  takeLatest,
  select,
  take,
} from 'redux-saga/effects'
import {
  cloneDeep,
  values,
  get,
  omit,
  set,
  uniqBy,
  uniq,
  isEmpty,
} from 'lodash'
import produce from 'immer'
import { questionType, questionTitle } from '@edulastic/constants'
import {
  helpers,
  notification,
  captureSentryException,
} from '@edulastic/common'
import { push } from 'connected-react-router'
import * as Sentry from '@sentry/browser'
import { storeInLocalStorage } from '@edulastic/api/src/utils/Storage'
import { alignmentStandardsFromMongoToUI as transformDomainsToStandard } from '../../assessment/utils/helpers'

import {
  getItemDetailSelector,
  getItemDetailQuestionsSelector,
  setItemLevelScoreFromRubricAction,
  UPDATE_ITEM_DETAIL_SUCCESS,
  setRedirectTestAction,
  hasStandards,
  PROCEED_PUBLISH_ACTION,
  togglePublishWarningModalAction,
  getPassageSelector,
  generateRecentlyUsedCollectionsList,
  proceedToPublishItemAction,
  setTestItemsSavingAction,
  setTestItemScoreUpdatedAction,
  getScoreUpdatedSelector,
} from '../ItemDetail/ducks'
import {
  setTestDataAndUpdateAction,
  setCreatedItemToTestAction,
  updateTestAndNavigateAction,
  getTestSelector,
  SET_TEST_DATA,
  getCurrentGroupIndexSelector,
} from '../TestPage/ducks'
import {
  setTestItemsAction,
  getSelectedItemSelector,
} from '../TestPage/components/AddItems/ducks'
import {
  SET_RUBRIC_ID,
  UPDATE_QUESTION,
  UPDATE_QUESTION_REQUEST,
  UPDATE_SCORE_AND_VALIDATION,
  SET_FIRST_MOUNT,
  getCurrentQuestionSelector,
  getQuestionsArraySelector,
  changeCurrentQuestionAction,
  changeUpdatedFlagAction,
} from '../sharedDucks/questions'

import {
  SET_ALIGNMENT_FROM_QUESTION,
  CLEAR_ITEM_EVALUATION,
  ADD_ITEM_EVALUATION,
} from '../src/constants/actions'
import { toggleCreateItemModalAction } from '../src/actions/testItem'
import { getNewAlignmentState } from '../src/reducers/dictionaries'
import {
  isIncompleteQuestion,
  hasImproperDynamicParamsConfig,
} from '../questionUtils'
import { changeViewAction } from '../src/actions/view'
import {
  getDictionariesAlignmentsSelector,
  getRecentStandardsListSelector,
  getRecentCollectionsListSelector,
} from '../src/selectors/dictionaries'
import {
  updateRecentStandardsAction,
  updateRecentCollectionsAction,
} from '../src/actions/dictionaries'
import {
  getOrgDataSelector,
  isPublisherUserSelector,
} from '../src/selectors/user'
import { getTestEntitySelector } from '../AssignTest/duck'
import { reSequenceQuestionsWithWidgets } from '../../common/utils/helpers'
import { getCurrentLanguage } from '../../common/components/LanguageSelector/duck'
import {
  changeDataToPreferredLanguage,
  changeDataInPreferredLanguage,
} from '../../assessment/utils/question'
import {
  hasMathFormula,
  getLatexValuePairs,
  generateExamples,
  getOptionsForMath,
  getOptionsForClozeMath,
} from '../../assessment/utils/variables'

// constants
export const resourceTypeQuestions = {
  PASSAGE: questionType.PASSAGE,
  PROTRACTOR: questionType.PROTRACTOR,
  VIDEO: questionType.VIDEO,
  TEXT: questionType.TEXT,
}

export const widgetTypes = {
  QUESTION: 'question',
  RESOURCE: 'resource',
}

export const RECEIVE_QUESTION_REQUEST = '[question] receive question request'
export const RECEIVE_QUESTION_SUCCESS = '[question] receive question success'
export const RECEIVE_QUESTION_ERROR = '[question] receive question error'

export const SAVE_QUESTION_REQUEST = '[question] save question request'
export const SAVE_QUESTION_SUCCESS = '[question] save question success'
export const SAVE_QUESTION_ERROR = '[question] save question error'

export const SET_QUESTION_DATA = '[question] set question data'
export const SET_QUESTION_ALIGNMENT_ADD_ROW =
  '[question] set question alignment add row'
export const SET_QUESTION_ALIGNMENT_REMOVE_ROW =
  '[question] set question alignment remove row'
export const SET_QUESTION = '[question] set question'
export const LOAD_QUESTION = '[quesiton] load question from testItem'
export const ADD_AUTHORED_ITEMS_TO_TEST =
  '[question] add authored items to test'
export const SET_IS_GRADING_RUBRIC =
  '[question] set is grading rubric checkbox state'
// actions

// Variable
export const GENERATE_VARIABLE_REQUEST =
  '[variable] generate dynamic examples request'
export const GENERATE_VARIABLE_START =
  '[variable] generate dynamic examples start'
export const GENERATE_VARIABLE_FINISHED =
  '[variable] generate dynamic examples finished'
export const DYNAMIC_PARAMETER_UPDATED =
  '[variable] dynamic parameters settings chagned'

const ADD_ITEM_TO_CART = '[item list] add item to cart'

const addItemToCartAction = (item) => ({
  type: ADD_ITEM_TO_CART,
  payload: {
    item,
    fromQuestionEdit: true,
  },
})

export const receiveQuestionByIdAction = (id) => ({
  type: RECEIVE_QUESTION_REQUEST,
  payload: {
    id,
  },
})

export const saveQuestionAction = (data) => ({
  type: SAVE_QUESTION_REQUEST,
  payload: data,
})

export const setQuestionDataAction = (question) => ({
  type: UPDATE_QUESTION_REQUEST,
  payload: question,
})

export const updateScoreAndValidationAction = (score) => ({
  type: UPDATE_SCORE_AND_VALIDATION,
  payload: { score },
})

export const setFirstMountAction = (id) => ({
  type: SET_FIRST_MOUNT,
  id,
})

export const setQuestionAlignmentAddRowAction = (alignmentRow) => ({
  type: SET_QUESTION_ALIGNMENT_ADD_ROW,
  payload: { alignmentRow },
})

export const setQuestionAlignmentRemoveRowAction = (index) => ({
  type: SET_QUESTION_ALIGNMENT_REMOVE_ROW,
  payload: { index },
})

export const setQuestionAction = (data) => ({
  type: SET_QUESTION,
  payload: { data },
})

export const loadQuestionAction = (
  data,
  rowIndex,
  isPassageWidget = false
) => ({
  type: LOAD_QUESTION,
  payload: { data, rowIndex, isPassageWidget },
})

export const generateVariableAction = (data) => ({
  type: GENERATE_VARIABLE_REQUEST,
  payload: data,
})

export const variableSettingsChangedAction = () => ({
  type: DYNAMIC_PARAMETER_UPDATED,
})

export const setDictAlignmentFromQuestion = (payload) => ({
  type: SET_ALIGNMENT_FROM_QUESTION,
  payload,
})

export const addAuthoredItemsAction = (payload) => ({
  type: ADD_AUTHORED_ITEMS_TO_TEST,
  payload,
})

export const setIsGradingRubricAction = (payload) => ({
  type: SET_IS_GRADING_RUBRIC,
  payload,
})
// reducer

const initialState = {
  entity: null,
  loading: false,
  saving: false,
  error: null,
  saveError: null,
  calculating: false,
  dpUpdated: false,
}

export const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case CLEAR_ITEM_EVALUATION: {
      return {
        ...state,
        calculating: !!payload,
      }
    }
    case GENERATE_VARIABLE_START:
      return {
        ...state,
        calculating: true,
      }
    case ADD_ITEM_EVALUATION:
    case UPDATE_QUESTION: {
      return {
        ...state,
        calculating: false,
      }
    }
    case GENERATE_VARIABLE_FINISHED: {
      return {
        ...state,
        calculating: false,
        dpUpdated: false,
      }
    }
    case DYNAMIC_PARAMETER_UPDATED: {
      return {
        ...state,
        dpUpdated: true,
      }
    }
    case RECEIVE_QUESTION_REQUEST:
      return {
        ...state,
        loading: true,
      }
    case RECEIVE_QUESTION_SUCCESS:
      return {
        ...state,
        loading: false,
        entity: payload.entity,
      }
    case RECEIVE_QUESTION_ERROR:
      return {
        ...state,
        loading: false,
        error: payload.error,
      }

    case SAVE_QUESTION_REQUEST:
      return {
        ...state,
        saving: true,
      }
    case SAVE_QUESTION_SUCCESS:
      return {
        ...state,
        saving: false,
      }
    case SAVE_QUESTION_ERROR:
      return {
        ...state,
        saving: false,
        saveError: payload.error,
      }

    case SET_QUESTION_DATA:
      return {
        ...state,
        entity: { ...state.entity, data: payload.data },
      }
    case SET_QUESTION_ALIGNMENT_ADD_ROW: {
      const { alignmentRow } = payload
      const currentAlignment = state.entity.data && state.entity.data.alignment
      const newAlignment = currentAlignment ? [...currentAlignment] : []
      newAlignment.push(alignmentRow)
      return {
        ...state,
        entity: {
          ...state.entity,
          data: {
            ...state.entity.data,
            alignment: newAlignment,
          },
        },
      }
    }
    case SET_QUESTION_ALIGNMENT_REMOVE_ROW: {
      const { index } = payload
      const newAlignment = [...state.entity.data.alignment]
      newAlignment.splice(index, 1)
      return {
        ...state,
        entity: {
          ...state.entity,
          data: {
            ...state.entity.data,
            alignment: newAlignment,
          },
        },
      }
    }
    case SET_QUESTION:
      return {
        ...state,
        entity: {
          data: payload.data,
        },
      }
    case SET_IS_GRADING_RUBRIC:
      return {
        ...state,
        isGradingRubric: payload,
      }
    case SET_RUBRIC_ID:
      return {
        ...state,
        isGradingRubric: false,
      }
    default:
      return state
  }
}

// selectors

export const stateSelector = (state) => state.question
export const getQuestionSelector = createSelector(
  stateSelector,
  (state) => state.entity
)
export const getQuestionDataSelector = createSelector(
  getCurrentQuestionSelector,
  getCurrentLanguage,
  (state, currentLang) => changeDataToPreferredLanguage(state, currentLang)
)
export const getQuestionAlignmentSelector = createSelector(
  getCurrentQuestionSelector,
  (state) => get(state, 'alignment', [])
)

export const getValidationSelector = createSelector(
  getCurrentQuestionSelector,
  (state) => state.validation
)

export const getAlignmentFromQuestionSelector = createSelector(
  getQuestionAlignmentSelector,
  (alignments) => {
    const modifyAlignment = alignments.map((item) => ({
      ...item,
      ...transformDomainsToStandard(item.domains),
    }))
    delete modifyAlignment.domains
    return modifyAlignment
  }
)

export const getCalculatingSelector = createSelector(
  stateSelector,
  (state) => state.calculating
)

export const getDpUpdatedSelector = createSelector(
  stateSelector,
  (state) => state.dpUpdated
)

export const getIsGradingCheckboxState = createSelector(
  stateSelector,
  (state) => state.isGradingRubric
)
// saga

function* receiveQuestionSaga({ payload }) {
  try {
    const entity = yield call(questionsApi.getById, payload.id)

    yield put({
      type: RECEIVE_QUESTION_SUCCESS,
      payload: { entity },
    })
  } catch (err) {
    const errorMessage = 'Unable to fetch question info.'
    notification({ type: 'error', msg: errorMessage })
    yield put({
      type: RECEIVE_QUESTION_ERROR,
      payload: { error: errorMessage },
    })
  }
}

export const getQuestionIds = (item) => {
  const { rows = [] } = item
  let questionIds = []
  rows.forEach((entry) => {
    const qIds = (entry.widgets || []).map((w) => w.reference)
    questionIds = [...questionIds, ...qIds]
  })

  return questionIds
}

const updateItemWithAlignmentDetails = (itemDetail = {}, alignments = []) => {
  itemDetail.grades = alignments[0]?.grades || []
  itemDetail.subjects = itemDetail.subjects || []
  itemDetail.curriculums = itemDetail.curriculums || []
  alignments[0]?.subject
    ? itemDetail.subjects.push(alignments[0].subject)
    : null
  alignments[0]?.curriculumId
    ? itemDetail.curriculums.push(alignments[0].curriculumId.toString())
    : null
}

export const redirectTestIdSelector = (state) =>
  get(state, 'itemDetail.redirectTestId', false)

function* saveQuestionSaga({
  payload: {
    testId: tId,
    isTestFlow,
    isEditFlow,
    saveAndPublishFlow = false,
    rowIndex: passageQuestionRowIndex,
    tabIndex: passageQuestionTabIndex,
    callback,
  },
}) {
  try {
    yield put(setTestItemsSavingAction(true))

    if (isTestFlow) {
      const questions = Object.values(
        yield select((state) => get(state, ['authorQuestions', 'byId'], {}))
      )
      const testItem = yield select((state) =>
        get(state, ['itemDetail', 'item'])
      )
      const isMultipartOrPassageType =
        testItem && (testItem.multipartItem || testItem.isPassageWithQuestions)
      const standardPresent = questions.some(hasStandards)

      // if alignment data is not present and question is not multipart or passage type ,
      // set the flag to open the modal, and wait for
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
    const question = yield select(getCurrentQuestionSelector)
    const itemDetail = yield select(getItemDetailSelector)
    const alignments = yield select(getDictionariesAlignmentsSelector)
    const { itemLevelScoring = false, multipartItem = false } = itemDetail
    const [isIncomplete, errMsg] = isIncompleteQuestion(
      question,
      itemLevelScoring,
      multipartItem
    )

    if (isIncomplete) {
      notification({ msg: errMsg })
      if (saveAndPublishFlow) {
        yield put({
          type: SAVE_QUESTION_ERROR,
          payload: { error: errMsg, customError: true },
        })
      }
      return
    }

    const [
      hasImproperConfig,
      warningMsg,
      shouldUncheck,
    ] = hasImproperDynamicParamsConfig(question)
    if (hasImproperConfig) {
      notification({ type: 'warn', msg: warningMsg })
    }

    if (shouldUncheck) {
      question.variable.enabled = false
      delete question.variable.examples
    }

    const isGradingCheckboxState = yield select(getIsGradingCheckboxState)

    if (isGradingCheckboxState && !question.rubrics) {
      if (saveAndPublishFlow) {
        yield put({
          type: SAVE_QUESTION_ERROR,
          payload: { error: 'Rubric not associated', customError: true },
        })
      }
      return notification({ messageKey: 'pleaseAssociateARubric' })
    }

    const locationState = yield select((state) => state.router.location.state)
    updateItemWithAlignmentDetails(itemDetail, alignments)
    let currentQuestionIds = getQuestionIds(itemDetail)
    let { rowIndex, tabIndex } = locationState || {
      rowIndex: 0,
      tabIndex: 1,
    }
    if (callback) {
      tabIndex = passageQuestionTabIndex
      rowIndex = passageQuestionRowIndex
    }
    const { id } = question
    const entity = {
      ...question,
      firstMount: false,
    }
    if (itemDetail && itemDetail.rows) {
      const isNew =
        currentQuestionIds.filter((item) => item === id).length === 0

      // if a new question add question
      if (isNew) {
        const widgetType = values(resourceTypeQuestions).includes(entity.type)
          ? widgetTypes.RESOURCE
          : widgetTypes.QUESTION
        itemDetail.rows[rowIndex].widgets.push({
          widgetType,
          type: entity.type,
          title: entity.title,
          reference: id,
          tabIndex,
        })
      }
    }

    currentQuestionIds = getQuestionIds(itemDetail)
    const allQuestions = yield select(getQuestionsArraySelector)
    const currentQuestions = allQuestions.filter(
      (q) =>
        currentQuestionIds.includes(q.id) &&
        !values(resourceTypeQuestions).includes(q.type)
    )
    const currentResources = allQuestions.filter(
      (q) =>
        currentQuestionIds.includes(q.id) &&
        values(resourceTypeQuestions).includes(q.type)
    )

    const _widgets = itemDetail?.rows
      ?.flatMap(({ widgets }) => widgets)
      ?.filter((widget) => widget.widgetType === 'question')

    let data = {
      ...itemDetail,
      data: {
        questions: reSequenceQuestionsWithWidgets(_widgets, currentQuestions),
        resources: currentResources,
      },
    }

    let allQuestionsArePractice = data.data.questions.length > 0
    data = produce(data, (draftData) => {
      if (draftData.data.questions.length > 0) {
        if (data.itemLevelScoring) {
          draftData.data.questions[0].itemScore = data.itemLevelScore
          set(
            draftData,
            ['data', 'questions', 0, 'validation', 'validResponse', 'score'],
            data.itemLevelScore
          )
          for (const [index, _question] of draftData.data.questions.entries()) {
            if (allQuestionsArePractice && !_question?.validation?.unscored) {
              allQuestionsArePractice = false
            }
            if (index > 0) {
              set(
                draftData,
                [
                  'data',
                  'questions',
                  index,
                  'validation',
                  'validResponse',
                  'score',
                ],
                0
              )
            }
          }
        } else if (draftData.data.questions[0].itemScore) {
          // const itemScore = draftData.data.questions[0].itemScore;
          // for (let [index] of draftData.data.questions.entries()) {
          //   draftData.data.questions[index].validation.validResponse.score =
          //     itemScore / draftData.data.questions.length;
          // }
          for (const _question of draftData.data.questions) {
            if (allQuestionsArePractice && !_question?.validation?.unscored) {
              allQuestionsArePractice = false
            }
          }
          delete draftData.data.questions[0].itemScore
        } else if (!data.itemLevelScoring) {
          for (const _question of draftData.data.questions) {
            if (allQuestionsArePractice && !_question?.validation?.unscored) {
              allQuestionsArePractice = false
            }
          }
        }

        if (allQuestionsArePractice) {
          draftData.itemLevelScore = 0
        }

        draftData.data.questions.forEach((q, index) => {
          if (index === 0) {
            if (data.itemLevelScoring && q.scoringDisabled) {
              // on item level scoring item, first question removed situation.
              if (!questionType.manuallyGradableQn.includes(data.type)) {
                set(q, 'validation.validResponse.score', data.itemLevelScore)
              }
            }
            /**
             * after shuffle we need to reset scoringDisabled to false for the first question
             * irrespective to itemLevelScoring
             */
            q.scoringDisabled = false
          }
          if (index > 0) {
            if (data.itemLevelScoring) {
              q.scoringDisabled = true
            } else {
              q.scoringDisabled = false
            }
          }

          if (allQuestionsArePractice) {
            q.itemScore = 0
            q.validation.validResponse.score = 0
            ;(q.validation.altResponses || []).forEach((altResponse) => {
              altResponse.score = 0
            })
          }

          const isMatrices =
            q.type === questionType.MATH && q.title === questionTitle.MATRICES
          if (q.template && !isMatrices) {
            q.template = helpers.removeIndexFromTemplate(q.template)
          }
          if (q.templateMarkUp) {
            q.templateMarkUp = helpers.removeIndexFromTemplate(q.templateMarkUp)
          }
        })
      }

      const itemGrades = draftData.grades.filter(
        (item) => !!item && typeof item === 'string'
      )
      const itemSubjects = draftData.subjects.filter(
        (item) => !!item && typeof item === 'string'
      )
      draftData.grades = uniq(itemGrades)
      draftData.subjects = uniq(itemSubjects)
    })

    const redirectTestId = yield select(redirectTestIdSelector)
    // In test flow, if test not created, testId is 'undefined' | EV-27944
    const _testId = redirectTestId || (tId === 'undefined' ? undefined : tId)
    const scoreUpdatedData = yield select(getScoreUpdatedSelector) || {}
    const isScoreUpdatedParam =
      scoreUpdatedData && itemDetail._id === scoreUpdatedData.currentTestItemId
        ? scoreUpdatedData.isUpdated
        : null

    const params = {
      ...(_testId && { testId: _testId }),
      ...(_testId &&
        typeof isScoreUpdatedParam === 'boolean' && {
          isScoreUpdated: isScoreUpdatedParam,
        }),
    }
    let item
    // if its a new testItem, create testItem, else update it.
    // TODO: do we need redirect testId here?!
    if (itemDetail._id === 'new') {
      const reqData = omit(data, '_id')
      item = yield call(
        testItemsApi.create,
        reqData,
        ...(itemDetail.multipartItem && _testId ? [{ testId: _testId }] : [])
      )
    } else {
      item = yield call(testItemsApi.updateById, itemDetail._id, data, params)
    }
    yield put(addItemToCartAction(item))
    yield put(changeUpdatedFlagAction(false))

    if (item.testId) {
      yield put(setRedirectTestAction(item.testId))
    }

    if (!saveAndPublishFlow) {
      notification({ type: 'success', messageKey: 'itemSavedSuccess' })
    }

    if (typeof callback === 'function') {
      yield put({
        type: UPDATE_ITEM_DETAIL_SUCCESS,
        payload: { item },
      })
      callback()
      yield put(changeCurrentQuestionAction(''))
      const currentRouterState = yield select(
        (state) => state.router.location.state
      )

      if (isTestFlow) {
        if (!tId || tId === 'undefined') {
          const { __v, ...passageData } =
            (yield select(getPassageSelector)) || {}
          let passageItems = []
          if (passageData?._id && passageData?.testItems?.length > 1) {
            passageItems = yield call(
              testItemsApi.getPassageItems,
              passageData._id
            )
          }
          yield put(
            setTestDataAndUpdateAction({
              item,
              passageItems,
              addToTest: true,
              fromSaveMultipartItem: true,
              routerState: currentRouterState,
              url: `/author/tests/${tId}/editItem/${item?._id}`,
            })
          )
        } else {
          yield put(setCreatedItemToTestAction(item))
          yield put(
            push({
              pathname: `/author/tests/${tId}/editItem/${item?._id}`,
              state: currentRouterState,
            })
          )
        }
      } else {
        yield put(
          push({
            pathname: `/author/items/${item._id}/item-detail`,
            state: currentRouterState,
          })
        )
      }
      return
    }

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
    if (saveAndPublishFlow) {
      yield put(proceedToPublishItemAction({ itemId: item._id }))
    }
    if (isTestFlow) {
      // user should get redirected to item detail page
      // when multipart or passgae questions are being created
      // from test flow or else save and continue.
      const isFinalSave = yield select(
        (state) => state.router.location.isFinalSave
      )
      if (
        (item.multipartItem ||
          !!item.passageId ||
          item.isPassageWithQuestions) &&
        !isFinalSave
      ) {
        const {
          isTestFlow: _isTestFlow,
          previousTestId,
          regradeFlow,
        } = yield select((state) => state.router?.location?.state || {})

        const routerState = {
          backText: 'Back to item bank',
          backUrl: '/author/items',
          itemDetail: false,
          isFinalSave: true,
          isTestFlow: isTestFlow || _isTestFlow,
          previousTestId,
          regradeFlow,
        }
        const multipartItemQuestionCount = item?.data?.questions?.length || 0
        if (
          item &&
          item.multipartItem &&
          !item.isPassageWithQuestions &&
          (_isTestFlow || isTestFlow) &&
          tId === 'undefined' &&
          multipartItemQuestionCount === 1
        ) {
          yield put(
            addAuthoredItemsAction({
              item,
              tId,
              isEditFlow: false,
              fromSaveMultipartItem: true,
              url: `/author/tests/${tId}/editItem/${item?._id}`,
              routerState,
            })
          )
        } else {
          yield put(
            push({
              pathname:
                (_isTestFlow || isTestFlow) && tId
                  ? `/author/tests/${tId}/editItem/${item?._id}`
                  : `/author/items/${item._id}/item-detail/test/${tId}`,
              state: routerState,
            })
          )
        }
        yield put({
          type: UPDATE_ITEM_DETAIL_SUCCESS,
          payload: { item },
        })
        return
      }

      const isPublisherUser = yield select(isPublisherUserSelector)
      const { itemGroups } = yield select(getTestEntitySelector)

      if (
        isPublisherUser &&
        (itemGroups.length > 1 || itemGroups[0].type === 'AUTOSELECT')
      ) {
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
        notification({
          type: 'info',
          messageKey: 'pleaseAddItemManuallyToGroup',
        })
      } else {
        // add item to test entity
        yield put(addAuthoredItemsAction({ item, tId, isEditFlow }))
      }
      yield put({
        type: UPDATE_ITEM_DETAIL_SUCCESS,
        payload: { item },
      })
      if (!isEditFlow) return
      yield put(changeViewAction('edit'))
      return
    }
    const stateToFollow =
      locationState?.testAuthoring === false
        ? { testAuthoring: false, testId: locationState.testId }
        : {}
    const { previousTestId, regradeFlow } = yield select(
      (state) => state.router?.location?.state || {}
    )

    if (itemDetail) {
      yield put(
        push({
          pathname:
            isTestFlow && tId
              ? `/author/tests/${tId}/editItem/${item?._id}`
              : `/author/items/${item._id}/item-detail`,
          state: {
            backText: 'Back to item bank',
            backUrl: '/author/items',
            itemDetail: false,
            ...stateToFollow,
            previousTestId,
            regradeFlow,
            isTestFlow,
          },
        })
      )
    }
    yield put({
      type: UPDATE_ITEM_DETAIL_SUCCESS,
      payload: { item },
    })
  } catch (err) {
    console.error(err)
    captureSentryException(err)
    const errorMessage = 'Unable to save the question.'
    if (isTestFlow) {
      yield put(toggleCreateItemModalAction(false))
    }
    notification({ type: 'error', messageKey: 'saveQuestionFailing' })
    yield put({
      type: SAVE_QUESTION_ERROR,
      payload: { error: errorMessage },
    })
  } finally {
    yield put(setTestItemsSavingAction(false))
  }
}

/**
 *
 * @param {*} payload should be an object with testId and isEditFlow flags
 *
 */
function* addAuthoredItemsToTestSaga({ payload }) {
  try {
    const {
      item,
      tId: testId,
      isEditFlow,
      fromSaveMultipartItem = false,
      url = '',
      routerState = {},
    } = payload
    const testItems = yield select(getSelectedItemSelector)
    const currentGroupIndex = yield select(getCurrentGroupIndexSelector)
    // updated testItems should have the current authored item
    // if it is passage item there could be multiple testitems
    // merge all into nextTestItems and add to test.
    let nextTestItems = testItems
    if (item.passageId) {
      const passage = yield select(getPassageSelector)
      nextTestItems = [...nextTestItems, ...passage.testItems]
    } else {
      nextTestItems = [...nextTestItems, item._id]
    }

    yield put(setTestItemsAction(nextTestItems))
    yield put(setCreatedItemToTestAction(item))

    // if the item is getting created from test before saving
    // then save and continue else change the route to test
    if (!testId || testId === 'undefined') {
      yield put(
        setTestDataAndUpdateAction({
          addToTest: true,
          item,
          fromSaveMultipartItem,
          url,
          routerState,
        })
      )
    } else {
      const test = yield select(getTestSelector)
      // update the test store with new test ITem
      const updatedTest = produce(test, (draft) => {
        draft.itemGroups[currentGroupIndex].items.push(item)
      })

      yield put({
        type: SET_TEST_DATA,
        payload: { data: updatedTest },
      })
      // save the test and navigate to test page.
      const pathname = !isEditFlow
        ? `/author/tests/tab/addItems/id/${testId}`
        : `/author/tests/${testId}/createItem/${item._id}`
      yield put(updateTestAndNavigateAction({ pathname, testId }))
    }
  } catch (e) {
    console.log(e, 'error')
    const errorMessage = 'Loading Question is failed'
    notification({ msg: errorMessage })
  }
}
// actions

function* loadQuestionSaga({ payload }) {
  try {
    const { data, rowIndex, isPassageWidget = false } = payload
    const pathname = yield select((state) => state.router.location.pathname)
    const locationState = yield select(
      (state) => state.router.location?.state || {}
    )
    yield put(changeCurrentQuestionAction(data.reference))
    if (pathname.includes('tests')) {
      yield put(
        push({
          pathname: `${pathname}/questions/edit/${data.type}`,
          state: {
            ...locationState,
            backText: 'question edit',
            backUrl: pathname,
            rowIndex,
            isPassageWithQuestions: isPassageWidget,
          },
        })
      )
    } else {
      yield put(
        push({
          pathname: `/author/questions/edit/${data.type}`,
          state: {
            backText: 'question edit',
            backUrl: pathname,
            rowIndex,
            isPassageWithQuestions: isPassageWidget,
          },
        })
      )
    }
    let alignments = yield select(getAlignmentFromQuestionSelector)
    if (!alignments.length) {
      alignments = [getNewAlignmentState()]
    }
    yield put(setDictAlignmentFromQuestion(alignments))
  } catch (e) {
    Sentry.captureException(e)
    const errorMessage = 'Unable to load the question.'
    notification({ type: 'error', msg: errorMessage })
  }
}

const changeValidationWhenUnscored = (score, currentQuestion) => {
  const isUnscored = score === 0
  if (isUnscored) {
    return produce(currentQuestion, (draft) => {
      draft.validation.validResponse.score = 0
      draft.validation.altResponses?.forEach((altResp) => {
        altResp.score = 0
      })
      if (draft.validation?.maxScore) {
        draft.validation.maxScore = 0
      }

      draft.validation.unscored = isUnscored
    })
  }
  return produce(currentQuestion, (draft) => {
    draft.validation.unscored = isUnscored
  })
}

function* updateScoreAndValidationSaga({ payload }) {
  const { score } = payload || {}
  const currentQuestion = yield select(getCurrentQuestionSelector)
  const resourceTypes = [
    questionType.VIDEO,
    questionType.PASSAGE,
    questionType.TEXT,
  ]

  const pathname = yield select((state) =>
    get(state, 'router.location.pathname', false)
  )
  const itemDetail = yield select(getItemDetailSelector)

  if (pathname.includes('/author/tests') && itemDetail?._id) {
    yield put(
      setTestItemScoreUpdatedAction({
        currentTestItemId: itemDetail._id,
        isUpdated: true,
      })
    )
  }

  if (
    typeof score === 'number' &&
    !resourceTypes.includes(currentQuestion?.type) &&
    !isEmpty(currentQuestion)
  ) {
    const newQuestion = changeValidationWhenUnscored(score, currentQuestion)
    const itemDetailQuestions = yield select(getItemDetailQuestionsSelector)
    const itemDetailQuestionsLength = itemDetailQuestions?.length || 0
    const isUnscored = get(newQuestion, 'validation.unscored', false)
    /**
     * @see EV-35429 and EV-29700
     * If question is marked as unscored itemLevelScoring should be set to false (EV-29700).
     * If unscored is checked then as mentioned above itemLevelScoring was set to false
     * but if unscored is unchecked itemLevelScoring value wasn't being changed.
     * Items other than multipart have by default itemLevelScoring value true.
     * Thus setting back itemLevelScoring value if unscored is unchecked (for non-multipart items).
     */
    if (isUnscored) {
      yield put(setItemLevelScoreFromRubricAction(false))
    } else if (
      isUnscored === false &&
      (itemDetailQuestionsLength === 0 || itemDetailQuestionsLength === 1)
    ) {
      yield put(setItemLevelScoreFromRubricAction(true))
    }
    yield put({
      type: UPDATE_QUESTION_REQUEST,
      payload: newQuestion,
    })
  }
}

function* updateQuestionSaga({ payload }) {
  const prevQuestion = yield select(getCurrentQuestionSelector)
  const currentLanguage = yield select(getCurrentLanguage)

  yield put({
    type: UPDATE_QUESTION,
    payload: changeDataInPreferredLanguage(
      currentLanguage,
      prevQuestion,
      payload
    ),
  })
}

function* generateVariableSaga({ payload }) {
  try {
    const dpUpdated = yield select(getDpUpdatedSelector)
    const currentQues = yield select(getCurrentQuestionSelector)
    if (!dpUpdated && !payload.newQuestion && !payload.shouldNotCheckUpdate) {
      if (typeof payload.nextAction === 'function') {
        payload.nextAction()
      }
      return
    }

    const question = payload.newQuestion ? payload.newQuestion : currentQues

    if (!question.variable || !question.variable.enabled) {
      return
    }

    yield put({
      type: GENERATE_VARIABLE_START,
    })

    const variables = get(question, 'variable.variables', {})
    const count = get(question, 'variable.combinationsCount', 25)
    const examples = generateExamples(variables, count)

    let results = []
    if (hasMathFormula(variables)) {
      const isClozeMath = question.type === questionType.EXPRESSION_MULTIPART
      const options = question?.isMath
        ? isClozeMath
          ? getOptionsForClozeMath(variables, get(question, 'validation', {}))
          : getOptionsForMath(
              get(question, 'validation.validResponse.value', [])
            )
        : {}
      const latexValuePairs = [
        getLatexValuePairs({
          id: 'definition',
          variables,
          options,
          isClozeMath,
        }),
      ]
      if (examples) {
        for (const example of examples) {
          const pair = getLatexValuePairs({
            id: `example${example.key}`,
            variables,
            example,
            options,
            isClozeMath,
          })
          if (pair.latexes.length > 0) {
            latexValuePairs.push(pair)
          }
        }
      }
      results = yield call(evaluateApi.calculate, latexValuePairs)
    }

    const variable = { ...question.variable, examples, variables }
    const newQuestion = { ...cloneDeep(question), variable }
    for (const result of results) {
      if (result.id === 'definition') {
        Object.keys(result.values).forEach((key) => {
          newQuestion.variable.variables[key].exampleValue = result.values[key]
        })
      } else {
        const idx = newQuestion.variable.examples.findIndex(
          (example) => `example${example.key}` === result.id
        )
        Object.keys(result.values).forEach((key) => {
          newQuestion.variable.examples[idx][key] = result.values[key]
        })
      }
    }

    if (newQuestion.rdv) {
      delete newQuestion.rdv
    }

    yield put({
      type: UPDATE_QUESTION_REQUEST,
      payload: newQuestion,
    })

    yield put({
      type: GENERATE_VARIABLE_FINISHED,
    })

    if (typeof payload.nextAction === 'function') {
      payload.nextAction()
    }
  } catch (error) {
    yield put({
      type: GENERATE_VARIABLE_FINISHED,
    })
    notification({ messageKey: 'somethingWentPleaseTryAgain' })
    console.log(error)
  }
}

export function* watcherSaga() {
  yield all([
    yield takeEvery(RECEIVE_QUESTION_REQUEST, receiveQuestionSaga),
    yield takeEvery(SAVE_QUESTION_REQUEST, saveQuestionSaga),
    yield takeEvery(LOAD_QUESTION, loadQuestionSaga),
    yield takeLatest(GENERATE_VARIABLE_REQUEST, generateVariableSaga),
    yield takeEvery(ADD_AUTHORED_ITEMS_TO_TEST, addAuthoredItemsToTestSaga),
    yield takeLatest(UPDATE_QUESTION_REQUEST, updateQuestionSaga),
    yield takeEvery(UPDATE_SCORE_AND_VALIDATION, updateScoreAndValidationSaga),
  ])
}
