import {
  IconWholeLearnerReport,
  IconMultipleAssessmentReportDW,
  IconAttendanceReport,
  IconDashboardReport,
  IconEarlyWarningReport,
  IconSetGoals,
  IconEfficacyReport,
} from '@edulastic/icons'

import {
  DW_ATTENDANCE_REPORT_URL,
  DW_EARLY_WARNING_REPORT_URL,
  DW_MAR_REPORT_URL,
  DW_WLR_REPORT_URL,
  DW_DASHBOARD_URL,
  DW_GOALS_AND_INTERVENTIONS_URL,
  DW_EFFICACY_REPORT_URL,
} from '../../common/constants/dataWarehouseReports'

export const dataWarehousereportCardsData = [
  {
    id: 1,
    title: 'Academic Reports',
    cards: [
      {
        id: 1,
        IconThumbnail: IconDashboardReport,
        title: 'Dashboard',
        description:
          "View key health checks for students' performance. Drill down to analyze and intervene.",
        url: DW_DASHBOARD_URL,
      },
      {
        id: 2,
        IconThumbnail: IconMultipleAssessmentReportDW,
        title: 'Performance Trends',
        description:
          "View whether the student's performance is improving over time and take necessary interventions.",
        url: DW_MAR_REPORT_URL,
      },
      {
        id: 3,
        IconThumbnail: IconWholeLearnerReport,
        title: 'Whole Learner',
        description:
          "Get a complete understanding of a learner's academic and associated indicators and take necessary actions for the learner’s growth.",
        url: DW_WLR_REPORT_URL,
      },
    ],
  },
  {
    id: 2,
    title: 'Non-Academic Reports',
    cards: [
      {
        id: 1,
        IconThumbnail: IconAttendanceReport,
        title: 'Attendance Summary',
        description:
          'Monitor attendance and tardies, identify students at risk of chronic absenteeism, and intervene.',
        url: DW_ATTENDANCE_REPORT_URL,
      },
    ],
  },
  {
    id: 3,
    title: 'Measure and Improve',
    cards: [
      {
        id: 1,
        IconThumbnail: IconSetGoals,
        title: 'Goals / Interventions Management',
        description: 'Set SMART Goals and Interventions and track improvement.',
        url: DW_GOALS_AND_INTERVENTIONS_URL,
      },
      {
        id: 2,
        IconThumbnail: IconEarlyWarningReport,
        title: 'Early Warning',
        description:
          'View students at risk based on their academic and attendance performance and plan interventions.',
        url: DW_EARLY_WARNING_REPORT_URL,
      },
      {
        id: 3,
        IconThumbnail: IconEfficacyReport,
        title: 'Efficacy',
        description:
          'Compare student performance across tests pre and post-intervention.',
        url: DW_EFFICACY_REPORT_URL,
      },
    ],
  },
]
