import {
  RESET_TEST_ITEMS,
  LOAD_TEST_ITEMS,
  GOTO_ITEM,
  SET_TEST_ACTIVITY_ID,
  SET_TEST_ID,
  RESET_CURRENT_TEST_ITEM,
  SET_RESUME_STATUS,
  SET_TEST_LOADING_STATUS,
  COUNT_CHECK_ANSWER,
  SET_PASSWORD_VALIDATE_STATUS,
  SET_STUDENT_SESSION_EXPIRED,
  TEST_ACTIVITY_LOADING,
  SET_PASSWORD_STATUS_MESSAGE,
  UPDATE_CURRENT_AUDIO_DEATILS,
  SET_TEST_LOADING_ERROR,
  SAVE_USER_RESPONSE,
  SAVE_USER_RESPONSE_SUCCESS,
  SAVE_USER_RESPONSE_ERROR,
  SHOW_HINTS,
  Hide_HINTS,
  SET_SAVE_USER_RESPONSE,
  SET_CHECK_ANSWER_PROGRESS_STATUS,
  LANG_CHANGE_SUCCESS,
  UPDATE_PLAYER_PREVIEW_STATE,
  SET_VIEW_TEST_INFO_SUCCESS,
  SET_PREVIEW_LANGUAGE,
  SET_IS_TEST_PREVIEW_VISIBLE,
  SAVE_BLUR_TIME,
  SET_SAVED_BLUR_TIME,
  SET_SUBMIT_TEST_COMPLETE,
} from '../constants/actions'

const initialState = {
  testActivityId: '',
  resume: false, // resume from last attempted?
  items: [],
  currentItem: 0,
  title: '',
  error: false,
  loading: true,
  showHints: false,
  settings: {},
  isDocBased: false,
  answerCheckByItemId: {},
  isPasswordValidated: false,
  isStudentSessionExpired: false,
  loadingTestActivity: true,
  passwordStatusMessage: '',
  savingResponse: false,
  currentPlayingDetails: {
    qId: '',
  },
  currentAssignmentTime: null,
  stopTimerFlag: false,
  checkAnswerInProgress: false,
  languagePreference: '',
  previewState: {},
  viewTestInfoSuccess: false,
  isTestPreviewModalVisible: false,
  blurTime: 0,
  savedBlurTime: 0,
  grades: [],
  subjects: [],
  submitTestComplete: false,
}

const test = (state = initialState, { payload, type }) => {
  switch (type) {
    case RESET_TEST_ITEMS:
      return initialState
    case LOAD_TEST_ITEMS:
      return {
        ...state,
        items: payload.items,
        testType: payload.testType,
        playerSkinType: payload.playerSkinType,
        testletConfig: payload.testletConfig,
        passages: payload.passages,
        title: payload.title,
        annotations: payload.annotations,
        docUrl: payload.docUrl,
        answerCheckByItemId: payload.answerCheckByItemId,
        pageStructure: payload.pageStructure,
        isDocBased: payload.isDocBased,
        freeFormNotes: payload.freeFormNotes,
        showMagnifier: payload.showMagnifier,
        languagePreference: payload.languagePreference,
        grades: payload.grades,
        subjects: payload.subjects,
        referenceDocAttributes: payload?.referenceDocAttributes,
        settings: {
          ...state.settings,
          ...payload.settings,
        },
      }

    case GOTO_ITEM:
      return {
        ...state,
        currentItem: payload.item,
      }

    case SET_TEST_ID:
      return {
        ...state,
        testId: payload.testId,
      }

    case RESET_CURRENT_TEST_ITEM:
      return {
        ...state,
        currentItem: 0,
      }
    case SET_TEST_ACTIVITY_ID:
      return {
        ...state,
        testActivityId: payload.testActivityId,
      }
    case SET_RESUME_STATUS:
      return {
        ...state,
        resume: payload,
      }

    case SET_TEST_LOADING_ERROR:
      return {
        ...state,
        error: true,
      }

    case SET_TEST_LOADING_STATUS:
      return {
        ...state,
        error: false,
        loading: payload,
      }
    case COUNT_CHECK_ANSWER: {
      const answerCheckCount = state.answerCheckByItemId[payload.itemId]
        ? state.answerCheckByItemId[payload.itemId]
        : 0
      return {
        ...state,
        answerCheckByItemId: {
          ...state.answerCheckByItemId,
          [payload.itemId]: answerCheckCount + 1,
        },
      }
    }
    case SET_PASSWORD_VALIDATE_STATUS:
      return {
        ...state,
        isPasswordValidated: payload,
      }
    case SET_STUDENT_SESSION_EXPIRED:
      return {
        ...state,
        isStudentSessionExpired: payload,
      }
    case TEST_ACTIVITY_LOADING:
      return {
        ...state,
        loadingTestActivity: payload,
      }
    case SET_PASSWORD_STATUS_MESSAGE:
      return {
        ...state,
        passwordStatusMessage: payload,
      }
    case SAVE_BLUR_TIME:
      return {
        ...state,
        blurTime: payload,
      }
    case SET_SAVED_BLUR_TIME:
      return {
        ...state,
        savedBlurTime: payload,
      }
    case SAVE_USER_RESPONSE:
      if (!payload.autoSave) {
        return { ...state, showHints: false }
      }
      return state
    case SAVE_USER_RESPONSE_SUCCESS:
      return { ...state, savingResponse: false }
    case SAVE_USER_RESPONSE_ERROR:
      return { ...state, savingResponse: false }
    case UPDATE_CURRENT_AUDIO_DEATILS:
      return {
        ...state,
        currentPlayingDetails: {
          qId: payload,
        },
      }
    case SHOW_HINTS:
      return { ...state, showHints: true }
    case Hide_HINTS:
      return { ...state, showHints: false }
    case SET_SAVE_USER_RESPONSE:
      return { ...state, savingResponse: payload }
    case SET_CHECK_ANSWER_PROGRESS_STATUS:
      return { ...state, checkAnswerInProgress: payload }
    case LANG_CHANGE_SUCCESS:
      return {
        ...state,
        languagePreference: payload.languagePreference,
        testActivityId: payload.testActivityId,
      }
    case UPDATE_PLAYER_PREVIEW_STATE:
      return {
        ...state,
        previewState: payload,
      }
    case SET_VIEW_TEST_INFO_SUCCESS:
      return {
        ...state,
        viewTestInfoSuccess: payload,
      }
    case SET_PREVIEW_LANGUAGE:
      return {
        ...state,
        languagePreference: payload,
        answerCheckByItemId: {},
      }
    case SET_IS_TEST_PREVIEW_VISIBLE:
      return {
        ...state,
        isTestPreviewModalVisible: payload,
      }
    case SET_SUBMIT_TEST_COMPLETE:
      return { ...state, submitTestComplete: payload }
    default:
      return state
  }
}

export default test
