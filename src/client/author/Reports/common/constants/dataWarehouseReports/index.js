import { reportNavType } from '@edulastic/constants/const/report'

const {
  DW_DASHBOARD_REPORT,
  WHOLE_LEARNER_REPORT,
  MULTIPLE_ASSESSMENT_REPORT_DW,
  DW_ATTENDANCE_REPORT,
  DW_EARLY_WARNING_REPORT,
  DW_EFFICACY_REPORT,
  DW_GOALS_AND_INTERVENTIONS_REPORT,
  DW_SURVEY_INSIGHTS_REPORT,
} = reportNavType

const commonUrl = '/author/reports'

export const DW_MAR_REPORT_URL = `${commonUrl}/${MULTIPLE_ASSESSMENT_REPORT_DW}`
export const DW_WLR_REPORT_URL = `${commonUrl}/${WHOLE_LEARNER_REPORT}/student/`
export const DW_DASHBOARD_REPORT_URL = `${commonUrl}/${DW_DASHBOARD_REPORT}`
export const DW_ATTENDANCE_REPORT_URL = `${commonUrl}/${DW_ATTENDANCE_REPORT}`
export const DW_EARLY_WARNING_REPORT_URL = `${commonUrl}/${DW_EARLY_WARNING_REPORT}`
export const DW_EFFICACY_REPORT_URL = `${commonUrl}/${DW_EFFICACY_REPORT}`
export const DW_GOALS_AND_INTERVENTIONS_URL = `${commonUrl}/${DW_GOALS_AND_INTERVENTIONS_REPORT}`
export const DW_SURVEY_INSIGHTS_URL = `${commonUrl}/${DW_SURVEY_INSIGHTS_REPORT}`
