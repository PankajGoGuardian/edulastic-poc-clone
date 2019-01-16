import {
  GET_SKILL_REPORT_BY_CLASSID
} from '../constants/actions';

export const fetchSkillReportByClassID = classId => ({
  type: GET_SKILL_REPORT_BY_CLASSID,
  payload: { classId }
});
