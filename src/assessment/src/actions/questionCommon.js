import {
  QUESTIONCOMMON_UPDATE_QUESTIONS_LIST,
  QUESTIONCOMMON_ADD_ALT_RESPONSES,
  QUESTIONCOMMON_CLEAR,
  QUESTIONCOMMON_SET_STATE,
  QUESTIONCOMMON_UPDATE_ALT_VALIDATION_SCORE,
  QUESTIONCOMMON_UPDATE_CORRECT_VALIDATION_SCORE,
  QUESTIONCOMMON_UPDATE_STIMULUS,
  QUESTIONCOMMON_UPDATE_VALIDATION,
} from '../constants/actions';

export function updateQuestionsListAction(questions) {
  return {
    type: QUESTIONCOMMON_UPDATE_QUESTIONS_LIST,
    payload: { questions },
  };
}

export function updateStimulusAction(stimulus) {
  return {
    type: QUESTIONCOMMON_UPDATE_STIMULUS,
    payload: { stimulus },
  };
}

export function updateValidationAction(validation) {
  return {
    type: QUESTIONCOMMON_UPDATE_VALIDATION,
    payload: { validation },
  };
}

export function updateAltValidationScoreAction(score, index) {
  return {
    type: QUESTIONCOMMON_UPDATE_ALT_VALIDATION_SCORE,
    payload: { score, index },
  };
}

export function updateCorrectValidationScoreAction(score) {
  return {
    type: QUESTIONCOMMON_UPDATE_CORRECT_VALIDATION_SCORE,
    payload: { score },
  };
}

export function setQuestionsStateAction(state) {
  return {
    type: QUESTIONCOMMON_SET_STATE,
    payload: { state },
  };
}

export function clearQuestionsAction() {
  return {
    type: QUESTIONCOMMON_CLEAR,
  };
}

export function addAltResponsesAction() {
  return {
    type: QUESTIONCOMMON_ADD_ALT_RESPONSES,
  };
}
