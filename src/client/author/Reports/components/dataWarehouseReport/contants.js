import {
  IconAdminDashboardAddOn,
  IconPerformanceTrendAddOn,
  IconWholeLearnerReportAddOn,
  IconAttendanceAddOn,
  IconGaolsAndInterventionsAddOn,
  IconEfficacyAddOn,
  IconEarlyWarningAddOn,
  IconBehaviourReportAddOn,
  IconSurveyInsightsAddOn,
  IconTailoredInsights,
  // IconDistrictReports,
  IconPerformanceTrendLarge,
} from '@edulastic/icons'

import {
  DW_ATTENDANCE_REPORT_URL,
  DW_EARLY_WARNING_REPORT_URL,
  DW_MAR_REPORT_URL,
  DW_WLR_REPORT_URL,
  DW_DASHBOARD_URL,
  DW_GOALS_AND_INTERVENTIONS_URL,
  DW_EFFICACY_REPORT_URL,
  CUSTOM_REPORTS_URL,
} from '../../common/constants/dataWarehouseReports'

export const DATA_WAREHOUSE_MODAL_MODES = {
  UPLOAD: 'upload',
  EDIT: 'edit',
  DELETE: 'delete',
}

export const DATA_WAREHOUSE_REPORT_CARDS_DATA = [
  {
    id: 1,
    title: 'Academic Reports',
    cards: [
      {
        id: 1,
        IconThumbnail: IconAdminDashboardAddOn,
        title: 'Dashboard',
        description:
          "View key health checks for students' performance. Drill down to analyze and intervene.",
        url: DW_DASHBOARD_URL,
      },
      {
        id: 2,
        IconThumbnail: IconPerformanceTrendAddOn,
        title: 'Performance Trends',
        description:
          "View whether the student's performance is improving over time and take necessary interventions.",
        url: DW_MAR_REPORT_URL,
      },
      {
        id: 3,
        IconThumbnail: IconWholeLearnerReportAddOn,
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
        IconThumbnail: IconAttendanceAddOn,
        title: 'Attendance Summary',
        description:
          'Monitor attendance and tardies, identify students at risk of chronic absenteeism, and intervene.',
        url: DW_ATTENDANCE_REPORT_URL,
      },
      {
        id: 2,
        comingSoon: true,
        IconThumbnail: IconBehaviourReportAddOn,
        title: 'Behavior',
        description:
          'Understand student behavior trends, reduce suspensions and referrals and support the whole student.',
        url: '',
      },
      {
        id: 3,
        comingSoon: true,
        IconThumbnail: IconSurveyInsightsAddOn,
        title: 'Survey Insights',
        description:
          'Get insights from responses in Skill Surveys and build a positive school culture.',
        url: '',
      },
    ],
  },
  {
    id: 3,
    title: 'Measure and Improve',
    cards: [
      {
        id: 1,
        IconThumbnail: IconGaolsAndInterventionsAddOn,
        title: 'Goals / Interventions Management',
        description: 'Set SMART Goals and Interventions and track improvement.',
        url: DW_GOALS_AND_INTERVENTIONS_URL,
      },
      {
        id: 2,
        IconThumbnail: IconEarlyWarningAddOn,
        title: 'Early Warning',
        description:
          'View students at risk based on their academic and attendance performance and plan interventions.',
        url: DW_EARLY_WARNING_REPORT_URL,
      },
      {
        id: 3,
        IconThumbnail: IconEfficacyAddOn,
        title: 'Efficacy',
        description:
          'Compare student performance across tests pre and post-intervention.',
        url: DW_EFFICACY_REPORT_URL,
      },
    ],
  },
]

export const DATA_WAREHOUSE_REPORT_CARDS_DATA_FOR_DGA = [
  {
    id: 1,
    title: 'DISTRICT GROUP REPORTS',
    cards: [
      {
        id: 1,
        IconThumbnail: IconPerformanceTrendLarge,
        title: 'Performance Trends',
        description:
          'Monitor performance improvement over time for timely interventions.',
        url: DW_MAR_REPORT_URL,
        styles: { span: 8, offset: 4, height: '110px' },
      },
      {
        id: 2,
        IconThumbnail: IconTailoredInsights,
        title: 'Tailored Insights',
        description: 'View customized reports as per your need.',
        url: CUSTOM_REPORTS_URL,
        styles: { span: 8, height: '110px' },
      },
    ],
  },
  // {
  //   id: 1,
  //   title: 'DISTRICT REPORTS',
  //   cards: [
  //     {
  //       id: 1,
  //       IconThumbnail: IconDistrictReports,
  //       title: 'District Reports',
  //       description:
  //         'View all district level reports by accessing a district admin view.',
  //       url: '',
  //       styles: { span: 16, offset: 4, height: '100px' },
  //     },
  //   ],
  // },
]
