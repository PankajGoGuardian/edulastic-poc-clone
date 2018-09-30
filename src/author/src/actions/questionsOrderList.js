import {
  ORDERLIST_UPDATE_QUESTIONS_LIST,
  ORDERLIST_ADD_ALT_RESPONSES,
  ORDERLIST_CLEAR,
  ORDERLIST_SET_STATE,
  ORDERLIST_UPDATE_ALT_VALIDATION_SCORE,
  ORDERLIST_UPDATE_CORRECT_VALIDATION_SCORE,
  ORDERLIST_UPDATE_STIMULUS,
  ORDERLIST_UPDATE_VALIDATION,
} from '../constants/actions';

export function updateQuestionsListAction(questions) {
  return {
    type: ORDERLIST_UPDATE_QUESTIONS_LIST,
    payload: { questions },
  };
}

export function updateStimulusAction(stimulus) {
  return {
    type: ORDERLIST_UPDATE_STIMULUS,
    payload: { stimulus },
  };
}

export function updateValidationAction(validation) {
  return {
    type: ORDERLIST_UPDATE_VALIDATION,
    payload: { validation },
  };
}

export function updateAltValidationScoreAction(score, index) {
  return {
    type: ORDERLIST_UPDATE_ALT_VALIDATION_SCORE,
    payload: { score, index },
  };
}

export function updateCorrectValidationScoreAction(score) {
  return {
    type: ORDERLIST_UPDATE_CORRECT_VALIDATION_SCORE,
    payload: { score },
  };
}

export function setQuestionsStateAction(state) {
  return {
    type: ORDERLIST_SET_STATE,
    payload: { state },
  };
}

export function clearQuestionsAction() {
  return {
    type: ORDERLIST_CLEAR,
  };
}

export function addAltResponsesAction() {
  return {
    type: ORDERLIST_ADD_ALT_RESPONSES,
  };
}
