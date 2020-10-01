export const setAuthTokenAction = (payload) => ({
  type: 'SET_AUTH_TOKEN',
  payload,
})

export const updateUserAction = (payload) => ({
  type: 'UPDATE_USER',
  payload,
})

export const updateClassDataAction = (payload) => ({
  type: 'UPDATE_CLASS_DATA',
  payload,
})

export const setDropdownTabAction = (payload) => ({
  type: 'SET_DROPDOWN_TAB',
  payload,
})

export const setQuestionItemsAction = (payload) => ({
  type: 'SET_QUESTION_ITEMS',
  payload,
})

export const setEvaluationAction = (payload) => ({
  type: 'SET_EVALUATION',
  payload,
})

export const saveAnswerAction = (payload) => ({
  type: 'SAVE_ANSWER',
  payload,
})

export const clearAnswerAction = (payload) => ({
  type: 'CLEAR_ANSWER',
  payload,
})

const iniialState = {
  authToken: '',
  user: {},
  classData: {},
  dropdownTab: '',
  questionItems: [],
  evaluation: {},
  userAnswer: {},
}

const edulasticReducer = (state = { ...iniialState }, { type, payload }) => {
  console.log({ type, payload })
  switch (type) {
    case 'SET_AUTH_TOKEN':
      return {
        ...state,
        authToken: payload,
      }
    case 'UPDATE_USER':
      return {
        ...state,
        user: payload,
      }
    case 'UPDATE_CLASS_DATA':
      return {
        ...state,
        classData: payload,
      }
    case 'SET_DROPDOWN_TAB':
      return {
        ...state,
        dropdownTab: payload,
      }
    case 'SET_QUESTION_ITEMS':
      return {
        ...state,
        questionItems: payload,
      }
    case 'SET_EVALUATION':
      return {
        ...state,
        evaluation: payload,
      }
    case 'SAVE_ANSWER':
      return {
        ...state,
        userAnswer: {
          ...state.userAnswer,
          [payload.questionId]: payload.answer,
        },
      }
    case 'CLEAR_ANSWER':
      return {
        ...state,
        userAnswer: {},
      }

    default:
      return state
  }
}

export default edulasticReducer
