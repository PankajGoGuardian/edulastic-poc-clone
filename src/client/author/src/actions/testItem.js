import {
  CREATE_TEST_ITEM_REQUEST,
  UPDATE_TEST_ITEM_REQUEST,
  CHECK_ANSWER,
  SHOW_ANSWER,
  TOGGLE_CREATE_ITEM_MODAL,
  ADD_ITEM_EVALUATION,
} from '../constants/actions'

export const createTestItemAction = (
  data,
  testFlow = false,
  testId,
  newPassageItem = false,
  testName,
  isMultipart = false,
  questionData = {},
  isFromQuestionTypeChange = false
) => ({
  type: CREATE_TEST_ITEM_REQUEST,
  payload: {
    data,
    testFlow,
    testId,
    newPassageItem,
    testName,
    isMultipart,
    questionData,
    isFromQuestionTypeChange,
  },
})

export const updateTestItemByIdAction = (id, data) => ({
  type: UPDATE_TEST_ITEM_REQUEST,
  payload: { id, data },
})

export const checkAnswerAction = (mode) => ({
  type: CHECK_ANSWER,
  payload: mode,
})

export const showAnswerAction = (mode) => ({
  type: SHOW_ANSWER,
  payload: mode,
})

export const toggleCreateItemModalAction = ({ modalVisible, itemId }) => ({
  type: TOGGLE_CREATE_ITEM_MODAL,
  payload: { modalVisible, itemId },
})

export const addItemEvaluationAction = (data) => ({
  type: ADD_ITEM_EVALUATION,
  payload: data,
})
