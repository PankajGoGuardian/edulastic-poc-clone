import { reportNavType } from '@edulastic/constants/const/report'

const {
  WHOLE_LEARNER_REPORT,
  MULTIPLE_ASSESSMENT_REPORT_DW,
  DW_DASHBOARD_REPORT,
} = reportNavType
const prefix = '/author/reports'

export const DW_MAR_REPORT_URL = `${prefix}/${MULTIPLE_ASSESSMENT_REPORT_DW}`
export const DW_WLR_REPORT_URL = `${prefix}/${WHOLE_LEARNER_REPORT}/student/`
export const DW_DASHBOARD_URL = `${prefix}/${DW_DASHBOARD_REPORT}`
