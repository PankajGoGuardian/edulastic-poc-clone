import {
  LOAD_TEST_ITEMS,
  GOTO_ITEM,
  SET_TEST_ACTIVITY_ID,
  SET_TEST_ID,
  RESET_CURRENT_TEST_ITEM,
  SET_RESUME_STATUS,
  SET_TEST_LOADING_STATUS,
  COUNT_CHECK_ANSWER,
  SET_PASSWORD_VALIDATE_STATUS,
  TEST_ACTIVITY_LOADING,
  SET_PASSWORD_STATUS_MESSAGE,
  UPDATE_CURRENT_AUDIO_DEATILS
} from "../constants/actions";

const initialState = {
  testActivityId: "",
  resume: false, // resume from last attempted?
  items: [],
  currentItem: 0,
  title: "",
  loading: true,
  settings: {},
  answerCheckByItemId: {},
  isPasswordValidated: false,
  loadingTestActivity: true,
  passwordStatusMessage: "",
  currentPlayingDetails: {
    qId: ""
  }
};

const test = (state = initialState, { payload, type }) => {
  switch (type) {
    case LOAD_TEST_ITEMS:
      return {
        ...state,
        items: payload.items,
        title: payload.title,
        annotations: payload.annotations,
        docUrl: payload.docUrl,
        answerCheckByItemId: payload.answerCheckByItemId,
        settings: {
          ...state.settings,
          ...payload.settings
        }
      };

    case GOTO_ITEM:
      return {
        ...state,
        currentItem: payload.item
      };

    case SET_TEST_ID:
      return {
        ...state,
        testId: payload.testId
      };

    case RESET_CURRENT_TEST_ITEM:
      return {
        ...state,
        currentItem: 0
      };
    case SET_TEST_ACTIVITY_ID:
      return {
        ...state,
        testActivityId: payload.testActivityId
      };
    case SET_RESUME_STATUS:
      return {
        ...state,
        resume: payload
      };
    case SET_TEST_LOADING_STATUS:
      return {
        ...state,
        loading: payload
      };
    case COUNT_CHECK_ANSWER:
      const answerCheckCount = state.answerCheckByItemId[payload.itemId]
        ? state.answerCheckByItemId[payload.itemId]
        : 0;
      return {
        ...state,
        answerCheckByItemId: {
          ...state.answerCheckByItemId,
          [payload.itemId]: answerCheckCount + 1
        }
      };
    case SET_PASSWORD_VALIDATE_STATUS:
      return {
        ...state,
        isPasswordValidated: payload
      };
    case TEST_ACTIVITY_LOADING:
      return {
        ...state,
        loadingTestActivity: payload
      };
    case SET_PASSWORD_STATUS_MESSAGE:
      return {
        ...state,
        passwordStatusMessage: payload
      };
    case UPDATE_CURRENT_AUDIO_DEATILS:
      return {
        ...state,
        currentPlayingDetails: {
          qId: payload
        }
      };
    default:
      return state;
  }
};

export default test;
