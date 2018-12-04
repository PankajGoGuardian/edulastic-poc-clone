import { RECEIVE_DICT_CURRICULUMS_REQUEST, RECEIVE_DICT_STANDARDS_REQUEST } from '../constants/actions';

export const getDictCurriculumsAction = () => ({
  type: RECEIVE_DICT_CURRICULUMS_REQUEST
});

export const getDictStandardsForCurriculumAction = (curriculumId, grades, searchStr) => ({
  type: RECEIVE_DICT_STANDARDS_REQUEST,
  payload: { curriculumId, grades, searchStr }
});
