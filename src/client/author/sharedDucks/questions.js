import { createAction, createReducer } from 'redux-starter-kit'
import { createSelector } from 'reselect'
import {
  values as _values,
  groupBy as _groupBy,
  intersection as _intersection,
  cloneDeep as _cloneDeep,
  get,
  set,
  sortBy,
  keys,
} from 'lodash'
import produce from 'immer'
import { markQuestionLabel } from '../../assessment/Transformer'
import { changeDataToPreferredLanguage } from '../../assessment/utils/question'
import { getCurrentLanguage } from '../../common/components/LanguageSelector/duck'
import { locationSelector } from '../../assessment/selectors/routes'
import { MOVE_WIDGET } from '../src/constants/actions'

// actions types
export const LOAD_QUESTIONS = '[author questions] load questions'
export const ADD_ITEMS_QUESTION = '[author question] load question'
export const UPDATE_QUESTION = '[author questions] update questions'
export const UPDATE_QUESTION_REQUEST =
  '[author questions] update questions request'
export const CHANGE_LABEL = '[author questions] change label'
export const SET_FIRST_MOUNT = '[author questions] set first mount'
export const CHANGE_ITEM = '[author questions] change item'
export const CHANGE_ITEM_UI_STYLE = '[author questions] change item uiStyle'
export const ADD_QUESTION = '[author questions] add question'
export const CHANGE_CURRENT_QUESTION =
  '[author quesitons] change current question'
export const ADD_ALIGNMENT = '[author questions] add alignment'
export const REMOVE_ALIGNMENT = '[author questions] remove alignment'
export const DELETE_QUESTION = '[author questions] delete question by id'
export const SET_RUBRIC_ID = '[author questions] set rubric id'
export const REMOVE_RUBRIC_ID = '[author questions] remove rubricId'
export const CHANGE_UPDATE_FLAG = '[authorQuestions] update the updated flag'
export const UPDATE_SCORE_AND_VALIDATION =
  '[authorQuestions] update score and validation'
export const SET_ITEM_LEVEL_SCORING_FROM_RUBRIC =
  '[itemDetail] set item level scoring from rubric'
// actions creators
export const loadQuestionsAction = createAction(LOAD_QUESTIONS)
export const addItemsQuestionAction = createAction(ADD_ITEMS_QUESTION)
export const addQuestionAction = createAction(ADD_QUESTION)
export const updateQuestionAction = createAction(UPDATE_QUESTION)
export const changeItemAction = createAction(CHANGE_ITEM)
export const changeUIStyleAction = createAction(CHANGE_ITEM_UI_STYLE)
export const setFirstMountAction = createAction(SET_FIRST_MOUNT)
export const changeCurrentQuestionAction = createAction(CHANGE_CURRENT_QUESTION)
export const addAlignmentAction = createAction(ADD_ALIGNMENT)
export const removeAlignmentAction = createAction(REMOVE_ALIGNMENT)
export const deleteQuestionAction = createAction(DELETE_QUESTION)
export const setRubricIdAction = createAction(SET_RUBRIC_ID)
export const removeRubricIdAction = createAction(REMOVE_RUBRIC_ID)
export const changeUpdatedFlagAction = createAction(CHANGE_UPDATE_FLAG)

export const UPDATE_TEST_DOC_BASED_REQUEST =
  '[tests] update doc based test request'
// initialState
const initialState = {
  byId: {},
  current: '',
  updated: false,
}

// load questions to the store.
const loadQuestions = (state, { payload }) => {
  state.byId = payload
  state.updated = false
}

const addQuestions = (state, { payload }) => {
  state.byId = { ...state.byId, ...payload }
  state.updated = false
}

const deleteQuestion = (state, { payload }) => {
  const newState = _cloneDeep(state)

  const questions = sortBy(_values(newState.byId), ['qIndex'])
  const questionIndex = questions.findIndex((q) => q.id === payload)
  let updatedQuestions = questions
  updatedQuestions = questions.map((question, index) =>
    index < questionIndex
      ? question
      : {
          ...question,
          qIndex: question.qIndex - 1,
        }
  )
  updatedQuestions.splice(questionIndex, 1)
  const byId = updatedQuestions.reduce(
    (total, question) => ({
      ...total,
      [question.id]: question,
    }),
    {}
  )

  state.byId = { ...byId }
  state.updated = true
}

// update question by id
const updateQuestion = (state, { payload }) => {
  let newPayload = payload

  const { updated = true } = newPayload

  delete newPayload.updated

  const prevGroupPossibleResponsesState = get(
    state.byId[payload.id],
    'groupPossibleResponses'
  )
  const groupPossibleResponses = get(payload, 'groupPossibleResponses')

  if (
    groupPossibleResponses === true &&
    groupPossibleResponses !== prevGroupPossibleResponsesState
  ) {
    // toggle group response on - update first group responses with possible responses
    newPayload = produce(payload, (draft) => {
      !draft.possibleResponseGroups[0]
        ? (draft.possibleResponseGroups = [
            { title: 'Group 1', responses: draft.possibleResponses },
          ])
        : (draft.possibleResponseGroups[0].responses = draft.possibleResponses)
    })
  } else if (
    // edit/regrade in lcb, there is no previous question
    // @see https://snapwiz.atlassian.net/browse/EV-27314
    prevGroupPossibleResponsesState &&
    groupPossibleResponses === false &&
    groupPossibleResponses !== prevGroupPossibleResponsesState
  ) {
    // toggle group response off - put back updated first group responses
    newPayload = produce(payload, (draft) => {
      draft.possibleResponses =
        (draft.possibleResponseGroups[0] &&
          draft.possibleResponseGroups[0].responses) ||
        []
    })
  }

  state.byId[payload.id] = newPayload
  state.updated = updated
}

const changeItem = (state, { payload }) => {
  const newItem = _cloneDeep(state.byId[state.current])
  newItem[payload.prop] = payload.value
  state.byId[state.current] = newItem
}

const changeUIStyle = (state, { payload }) => {
  const newItem = _cloneDeep(state.byId[state.current])

  if (!newItem.uiStyle) {
    newItem.uiStyle = {}
  }

  newItem.uiStyle[payload.prop] = payload.value
  state.byId[state.current] = newItem
}

const setFirstMount = (state, { id }) => {
  if (state.byId[id]) {
    state.byId[id].firstMount = false
  }
}

// add a new question
const addQuestion = (state, { payload }) => {
  const { updated = true, videoQuizAiGeneratedQuestion = false } = payload

  delete payload.updated
  delete payload.videoQuizAiGeneratedQuestion

  state.byId[payload.id] = payload
  state.current = payload.id
  state.updated = updated

  // sort the question indices in docBsed
  if (payload.isDocBased) {
    const qids = Object.values(state.byId)
      .sort((a, b) => a.qIndex - b.qIndex)
      .map((obj) => obj.id)
    qids.forEach((id, i) => {
      state.byId[id].qIndex = i + 1
    })
  }

  if (videoQuizAiGeneratedQuestion) {
    const qids = Object.values(state.byId)
      .filter((question) => question.type !== 'sectionLabel')
      .sort((a, b) => {
        // keep null questionDisplayTimestamp values to last
        if (typeof a.questionDisplayTimestamp !== 'number') {
          return 1
        }
        if (typeof b.questionDisplayTimestamp !== 'number') {
          return -1
        }
        return a.questionDisplayTimestamp - b.questionDisplayTimestamp
      })
      .map((question) => question.id)
    qids.forEach((id, i) => {
      state.byId[id].qIndex = i + 1
    })
  }
}

// change current question
const changeCurrent = (state, { payload }) => {
  state.current = payload
}

// add alignment to question
const addAlignment = (state, { payload }) => {
  const currentQuestion = state.byId[state.current]

  if (!currentQuestion.alignment || currentQuestion.alignment.length === 0) {
    state.byId[currentQuestion.id].alignment = [payload]
    return
  }

  let existing = false

  for (const alignment of currentQuestion.alignment) {
    if (alignment.curriculumId === payload.curriculumId) {
      existing = true
      const domainGrouped = _groupBy(payload.domain, 'id')
      for (const domain of alignment.domains) {
        if (domainGrouped[domain.id]) {
          const selected = domainGrouped[domain.id]
          domain.standards = _intersection(
            domain.standards,
            selected.standards,
            'id'
          )
        }
      }
    }
  }

  if (!existing) {
    currentQuestion.alignment.push(payload)
  }
}

const removeAlignment = (state, { payload }) => {
  const currentQuestion = state.byId[state.current]
  currentQuestion.alignment = currentQuestion.alignment.filter(
    (item) => item.curriculumId !== payload
  )
}

// re sequence questions in multipart types
// https://snapwiz.atlassian.net/browse/EV-27644
const reSequencedQ = (state, { payload }) => {
  const { from, to } = payload
  const qIds = keys(state.byId)
  const [movedQId] = qIds.splice(from.widgetIndex, 1)
  qIds.splice(to.widgetIndex, 0, movedQId)

  const updatedQuestions = {}
  qIds.forEach((qId) => {
    updatedQuestions[qId] = state.byId[qId]
  })

  state.byId = updatedQuestions
}

const changeValidationWhenUnscored = (question, score) => {
  const isUnscored = score === 0

  if (isUnscored) {
    return produce(question, (draft) => {
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
  return produce(question, (draft) => {
    draft.validation.unscored = isUnscored
    draft.validation.validResponse.score = score
  })
}

const setItemLevelScoring = (state, { payload }) => {
  if (!payload) {
    for (const key of Object.keys(state.byId)) {
      const oldScore = get(state.byId[key], 'validation.validResponse.score', 0)
      if (get(state.byId[key], 'validation.unscored', false)) {
        set(state.byId[key], 'validation.validResponse.score', 0)
        continue
      }
      if (parseFloat(oldScore) === 0) {
        set(state.byId[key], 'validation.validResponse.score', 1)
      }
    }
  }
}

export const SET_ITEM_DETAIL_ITEM_LEVEL_SCORING =
  '[itemDetail] set item level scoring'
export const SET_QUESTION_SCORE = '[author questions] set question score'
export const setQuestionScoreAction = createAction(SET_QUESTION_SCORE)
const _module = 'authorQuestions'

// reducer
export default createReducer(initialState, {
  [LOAD_QUESTIONS]: loadQuestions,
  [ADD_ITEMS_QUESTION]: addQuestions,
  [UPDATE_QUESTION]: updateQuestion,
  [CHANGE_ITEM]: changeItem,
  [CHANGE_ITEM_UI_STYLE]: changeUIStyle,
  [ADD_QUESTION]: addQuestion,
  [SET_FIRST_MOUNT]: setFirstMount,
  [CHANGE_CURRENT_QUESTION]: changeCurrent,
  [ADD_ALIGNMENT]: addAlignment,
  [REMOVE_ALIGNMENT]: removeAlignment,
  [DELETE_QUESTION]: deleteQuestion,
  [CHANGE_UPDATE_FLAG]: (state, { payload }) => {
    state.updated = payload
  },
  [UPDATE_TEST_DOC_BASED_REQUEST]: (state) => {
    state.updated = false
  },
  [SET_QUESTION_SCORE]: (state, { payload }) => {
    const { qid, score, isOnBlur = false } = payload
    if (score < 0) {
      return state
    }
    if (isOnBlur) {
      const _question = changeValidationWhenUnscored(state.byId[qid], score)
      state.byId[qid] = _question
    } else {
      set(state.byId[qid], 'validation.validResponse.score', score)
    }
  },
  [SET_ITEM_LEVEL_SCORING_FROM_RUBRIC]: setItemLevelScoring,
  [SET_ITEM_DETAIL_ITEM_LEVEL_SCORING]: setItemLevelScoring,
  [SET_RUBRIC_ID]: (state, { payload }) => {
    state.byId[state.current].rubrics = payload.metadata
    state.byId[state.current].validation.validResponse.score = payload.maxScore
  },
  [REMOVE_RUBRIC_ID]: (state) => {
    delete state.byId[state.current].rubrics
    state.byId[state.current].validation.validResponse.score = 1
  },
  [MOVE_WIDGET]: reSequencedQ,
})

// selectors

export const getCurrentQuestionIdSelector = (state) => state[_module].current
export const getQuestionsSelector = (state) => state[_module].byId
export const getTestStateSelector = (state) => state.tests
export const getAuthorQuestionSelector = (state) => state[_module]

export const getTestSelector = createSelector(
  getTestStateSelector,
  (state) => state.entity
)

export const getQuestionRubrics = createSelector(
  getQuestionsSelector,
  getCurrentQuestionIdSelector,
  (state, id) => state[id]?.rubrics
)

export const getQuestionsSelectorForReview = createSelector(
  getTestSelector,
  (state) => {
    const testItems =
      state?.itemGroups?.flatMap((itemGroup) => itemGroup.items || []) || []
    const testItemsLabeled = markQuestionLabel(testItems)
    const passages = get(state, 'tests.entity.passages', [])
    const questionsKeyed = testItemsLabeled.reduce((acc, item) => {
      const questions = get(item, 'data.questions', [])
      const resources = get(item, 'data.resources', [])
      for (const question of questions) {
        acc[`${item._id}_${question.id}`] = question
      }
      for (const resource of resources) {
        acc[`${item._id}_${resource.id}`] = resource
      }
      return acc
    }, {})
    const passagesKeyed = passages.reduce((acc, passage) => {
      for (const data of passage.data) {
        acc[data.id] = { ...data, isPassage: true }
      }
      return acc
    }, {})
    return { ...questionsKeyed, ...passagesKeyed }
  }
)

// get current Question
export const getCurrentQuestionSelector = createSelector(
  getQuestionsSelector,
  getCurrentQuestionIdSelector,
  (questions, currentId) => questions[currentId]
)

export const getQuestionsArraySelector = createSelector(
  getQuestionsSelector,
  (questions) => _values(questions)
)

// export const getQuestionByIdSelector = (state, qId) =>
//   state[_module].byId[qId] || {}
// this selector was used only in the ItemDetailWidget component.
export const getQuestionByIdSelector = createSelector(
  getQuestionsSelector,
  getCurrentLanguage,
  (_, qId) => qId,
  (questionsById, currentLang, qId) =>
    changeDataToPreferredLanguage(questionsById[qId] || {}, currentLang)
)

// get alignment of current question
export const getQuestionAlignmentSelector = createSelector(
  getCurrentQuestionSelector,
  (question) => question.alignment || []
)

// get curret updated state of author question
export const getAuthorQuestionStatus = createSelector(
  getAuthorQuestionSelector,
  (state) => state.updated
)

export const isRegradeFlowSelector = createSelector(
  locationSelector,
  (location) => get(location, 'state.regradeFlow', false)
)

export const getIsEditDisbledSelector = createSelector(
  getQuestionsSelector,
  isRegradeFlowSelector,
  (questionsById, regradeFlow) => {
    const hasDynamicValues = Object.values(questionsById)?.some((q) =>
      get(q, 'variable.enabled', false)
    )
    if (hasDynamicValues && regradeFlow) {
      return [
        true,
        'Dynamic Parameter questions have their random values generated when the test is assigned, and they cannot be changed. You will have to grade these questions manually',
      ]
    }
    return [false, '']
  }
)
