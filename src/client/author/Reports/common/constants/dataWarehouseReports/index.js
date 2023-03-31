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
export const DW_ATTENDANCE_REPORT_URL = '${prefix}/attendance-summary'

export const DW_REPORT_URLS = [
  DW_DASHBOARD_URL,
  DW_MAR_REPORT_URL,
  DW_WLR_REPORT_URL,
  DW_ATTENDANCE_REPORT_URL,
]