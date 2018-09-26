import {
  ORDERLIST_ADD_ALT_RESPONSES,
  ORDERLIST_UPDATE_ALT_VALIDATION_SCORE,
  ORDERLIST_UPDATE_CORRECT_VALIDATION_SCORE,
} from '../constants/actions';

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

export function addAltResponsesAction() {
  return {
    type: ORDERLIST_ADD_ALT_RESPONSES,
  };
}
